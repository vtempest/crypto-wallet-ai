import crypto from 'crypto';
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages';
import { Document } from '@langchain/core/documents';
import { EventEmitter } from 'stream';
import { db } from '@/lib/db';
import { chats, messages as messagesSchema } from '@/lib/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { searchHandlers } from '@/lib/research/search';
import { z } from 'zod';
import ModelRegistry from '@/lib/research/models/registry';
import { ModelWithProvider } from '@/lib/research/models/types';
import { getUserId } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const messageSchema = z.object({
  messageId: z.string().min(1, 'Message ID is required'),
  chatId: z.string().min(1, 'Chat ID is required'),
  content: z.string().min(1, 'Message content is required'),
});

const chatModelSchema: z.ZodType<ModelWithProvider> = z.object({
  providerId: z.string({
    message: 'Chat model provider id must be provided',
  }),
  key: z.string({
    message: 'Chat model key must be provided',
  }),
});

const bodySchema = z.object({
  message: messageSchema,
  optimizationMode: z.enum(['speed', 'balanced', 'quality'], {
    message: 'Optimization mode must be one of: speed, balanced, quality',
  }),
  focusMode: z.string().min(1, 'Focus mode is required'),
  history: z
    .array(
      z.tuple([z.string(), z.string()], {
        message: 'History items must be tuples of two strings',
      }),
    )
    .optional()
    .default([]),
  files: z.array(z.string()).optional().default([]),
  chatModel: chatModelSchema,
  systemInstructions: z.string().nullable().optional().default(''),
});

type Message = z.infer<typeof messageSchema>;
type Body = z.infer<typeof bodySchema>;

const safeValidateBody = (data: unknown) => {
  const result = bodySchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      // @ts-ignore
      error: result.error.issues.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  return {
    success: true,
    data: result.data,
  };
};

const handleEmitterEvents = async (
  stream: EventEmitter,
  writer: WritableStreamDefaultWriter,
  encoder: TextEncoder,
  chatId: string,
  userId: string | null,
) => {
  let receivedMessage = '';
  const aiMessageId = crypto.randomBytes(7).toString('hex');

  stream.on('data', (data) => {
    const parsedData = JSON.parse(data);
    if (parsedData.type === 'response') {
      writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'message',
            data: parsedData.data,
            messageId: aiMessageId,
          }) + '\n',
        ),
      );

      receivedMessage += parsedData.data;
    } else if (parsedData.type === 'sources') {
      writer.write(
        encoder.encode(
          JSON.stringify({
            type: 'sources',
            data: parsedData.data,
            messageId: aiMessageId,
          }) + '\n',
        ),
      );

      // Only save to database for authenticated users
      if (userId) {
        const sourceMessageId = crypto.randomBytes(7).toString('hex');

        db.insert(messagesSchema)
          .values({
            chatId: chatId,
            userId: userId,
            messageId: sourceMessageId,
            role: 'source',
            content: '',
            sources: parsedData.data as Document[],
            createdAt: new Date().toString(),
          })
          .execute();
      }
    }
  });
  stream.on('end', () => {
    writer.write(
      encoder.encode(
        JSON.stringify({
          type: 'messageEnd',
        }) + '\n',
      ),
    );
    writer.close();

    // Only save to database for authenticated users
    if (userId) {
      db.insert(messagesSchema)
        .values({
          content: receivedMessage,
          chatId: chatId,
          userId: userId,
          messageId: aiMessageId,
          role: 'assistant',
          createdAt: new Date().toString(),
        })
        .execute();
    }
  });
  stream.on('error', (data) => {
    const parsedData = JSON.parse(data);
    writer.write(
      encoder.encode(
        JSON.stringify({
          type: 'error',
          data: parsedData.data,
        }),
      ),
    );
    writer.close();
  });
};

const handleHistorySave = async (
  message: Message,
  humanMessageId: string,
  focusMode: string,
  files: string[],
  userId: string | null,
) => {
  // Only save to database for authenticated users
  if (!userId) return;

  console.log('[handleHistorySave] Starting chat save for chatId:', message.chatId, 'userId:', userId);

  const chat = await db.query.chats.findFirst({
    where: and(eq(chats.id, message.chatId), eq(chats.userId, userId)),
  });


  if (!chat) {
    console.log('[handleHistorySave] Creating new chat:', message.chatId);
    await db
      .insert(chats)
      .values({
        id: message.chatId,
        title: message.content,
        createdAt: new Date().toString(),
        focusMode: focusMode,
        userId: userId,
      })
      .execute();
    console.log('[handleHistorySave] Chat created successfully:', message.chatId);
  }

  const messageExists = await db.query.messages.findFirst({
    where: eq(messagesSchema.messageId, humanMessageId),
  });

  if (!messageExists) {
    await db
      .insert(messagesSchema)
      .values({
        content: message.content,
        chatId: message.chatId,
        userId: userId,
        messageId: humanMessageId,
        role: 'user',
        createdAt: new Date().toString(),
      })
      .execute();
  } else {
    await db
      .delete(messagesSchema)
      .where(
        and(
          gt(messagesSchema.id, messageExists.id),
          eq(messagesSchema.chatId, message.chatId),
        ),
      )
      .execute();
  }
};

export const POST = async (req: Request) => {
  try {
    // Get userId if authenticated, allow guests (null)
    const userId = await getUserId();

    const reqBody = (await req.json()) as Body;

    const parseBody = safeValidateBody(reqBody);
    if (!parseBody.success) {
      return Response.json(
        { message: 'Invalid request body', error: parseBody.error },
        { status: 400 },
      );
    }

    const body = parseBody.data as Body;
    const { message } = body;

    if (message.content === '') {
      return Response.json(
        {
          message: 'Please provide a message to process',
        },
        { status: 400 },
      );
    }

    const registry = new ModelRegistry();

    const llm = await registry.loadChatModel(body.chatModel.providerId, body.chatModel.key);

    const humanMessageId =
      message.messageId ?? crypto.randomBytes(7).toString('hex');

    const history: BaseMessage[] = body.history.map((msg) => {
      if (msg[0] === 'human') {
        return new HumanMessage({
          content: msg[1],
        });
      } else {
        return new AIMessage({
          content: msg[1],
        });
      }
    });

    const handler = searchHandlers[body.focusMode];

    if (!handler) {
      return Response.json(
        {
          message: 'Invalid focus mode',
        },
        { status: 400 },
      );
    }

    const stream = await handler.searchAndAnswer(
      message.content,
      history,
      llm,
      body.optimizationMode,
      body.files,
      body.systemInstructions as string,
    );

    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    handleEmitterEvents(stream, writer, encoder, message.chatId, userId);

    console.log('[POST /api/chat] Awaiting handleHistorySave for chatId:', message.chatId);
    await handleHistorySave(message, humanMessageId, body.focusMode, body.files, userId);
    console.log('[POST /api/chat] handleHistorySave completed, returning stream response');

    return new Response(responseStream.readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err) {
    // Handle auth errors
    if (err instanceof Error && err.message === 'Unauthorized') {
      return Response.json(
        { message: 'Authentication required' },
        { status: 401 },
      );
    }

    console.error('An error occurred while processing chat request:', err);
    return Response.json(
      { message: 'An error occurred while processing chat request' },
      { status: 500 },
    );
  }
};
