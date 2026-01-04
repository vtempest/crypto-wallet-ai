import { ChatOpenAI } from '@langchain/openai';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from '@langchain/core/prompts';
import {
  RunnableLambda,
  RunnableMap,
  RunnableSequence,
} from '@langchain/core/runnables';
import { BaseMessage, BaseMessageLike } from '@langchain/core/messages';
import { StringOutputParser } from '@langchain/core/output_parsers';
import LineListOutputParser from '../outputParsers/listLineOutputParser';
import LineOutputParser from '../outputParsers/lineOutputParser';
import { getDocumentsFromLinks } from '@/lib/utils/documents';
import { Document } from '@langchain/core/documents';
import path from 'node:path';
import fs from 'node:fs';
import { formatChatHistoryAsString } from '@/lib/utils';
import eventEmitter from 'events';
import { StreamEvent } from '@langchain/core/tracers/log_stream';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { AgentExecutor, createToolCallingAgent } from '@langchain/classic/agents';

export interface MetaSearchAgentType {
  searchAndAnswer: (
    message: string,
    history: BaseMessage[],
    llm: BaseChatModel,
    optimizationMode: 'speed' | 'balanced' | 'quality',
    fileIds: string[],
    systemInstructions: string,
  ) => Promise<eventEmitter>;
}

interface Config {
  searchWeb: boolean;
  rerank: boolean;
  rerankThreshold: number;
  queryGeneratorPrompt: string;
  queryGeneratorFewShots: BaseMessageLike[];
  responsePrompt: string;
  activeEngines: string[];
  tools?: DynamicStructuredTool[];
}

type BasicChainInput = {
  chat_history: BaseMessage[];
  query: string;
};

class MetaSearchAgent implements MetaSearchAgentType {
  private config: Config;
  private strParser = new StringOutputParser();

  constructor(config: Config) {
    this.config = config;
  }

  // Web search is disabled - this method is no longer used
  private async createSearchRetrieverChain(llm: BaseChatModel) {
    return null;
  }

  private async createAnsweringChain(
    llm: BaseChatModel,
    fileIds: string[],
    optimizationMode: 'speed' | 'balanced' | 'quality',
    systemInstructions: string,
  ) {
    // If tools are provided, use agent executor
    if (this.config.tools && this.config.tools.length > 0) {
      // Pre-format the system prompt with template variables
      const currentDate = new Date().toISOString();
      const context = ''; // Web search is disabled

      // Replace all template variables in the prompt
      const systemPrompt = this.config.responsePrompt
        .replace('{systemInstructions}', systemInstructions || '')
        .replace('{date}', currentDate)
        .replace('{context}', context);

      const currentDate = new Date().toISOString();
      const context = ''; // Web search is disabled
      const formattedSystemPrompt = this.config.responsePrompt
        .replace('{systemInstructions}', systemInstructions || '')
        .replace('{date}', currentDate)
        .replace('{context}', context);

      const prompt = ChatPromptTemplate.fromMessages([
        ['system', formattedSystemPrompt],
        new MessagesPlaceholder('chat_history'),
        ['user', '{query}'],
        new MessagesPlaceholder('agent_scratchpad'),
      ]);

      const agent = await createToolCallingAgent({
        llm,
        tools: this.config.tools,
        prompt,
      });

      return new AgentExecutor({
        agent,
        tools: this.config.tools,
        verbose: false,
      });
    }

    // Default chain without tools (original implementation)
    // Pre-format the system prompt with template variables
    const currentDate = new Date().toISOString();
    const context = ''; // Web search is disabled
    const formattedSystemPrompt = this.config.responsePrompt
      .replace('{systemInstructions}', systemInstructions || '')
      .replace('{date}', currentDate)
      .replace('{context}', context);

    return RunnableSequence.from([
      RunnableMap.from({
        query: (input: BasicChainInput) => input.query,
        chat_history: (input: BasicChainInput) => input.chat_history,
      }),
      ChatPromptTemplate.fromMessages([
        ['system', formattedSystemPrompt],
        new MessagesPlaceholder('chat_history'),
        ['user', '{query}'],
      ]),
      llm,
      this.strParser,
    ]).withConfig({
      runName: 'FinalResponseGenerator',
    });
  }

  private async rerankDocs(
    query: string,
    docs: Document[],
    fileIds: string[],
    optimizationMode: 'speed' | 'balanced' | 'quality',
  ) {
    if (docs.length === 0 && fileIds.length === 0) {
      return docs;
    }

    const filesData = fileIds.map((file) => {
      const filePath = path.join(process.cwd(), 'uploads', file);
      const contentPath = filePath + '-extracted.json';
      const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

      return {
        fileName: content.title,
        content: content.content,
      };
    });

    if (query.toLocaleLowerCase() === 'summarize') {
      return docs.slice(0, 15);
    }

    const docsWithContent = docs.filter(
      (doc) => doc.pageContent && doc.pageContent.length > 0,
    );

    // Convert file data to Documents
    const fileDocs = filesData.map((fileData) => {
      return new Document({
        pageContent: fileData.content,
        metadata: {
          title: fileData.fileName,
          url: `File`,
        },
      });
    });

    // Combine web search results with file documents
    // Limit to 15 total documents to avoid overwhelming the context
    const allDocs = [...fileDocs, ...docsWithContent];
    return allDocs.slice(0, 15);
  }

  private processDocs(docs: Document[]) {
    return docs
      .map(
        (_, index) =>
          `${index + 1}. ${docs[index].metadata.title} ${docs[index].pageContent}`,
      )
      .join('\n');
  }

  private async handleStream(
    stream: AsyncGenerator<StreamEvent, any, any>,
    emitter: eventEmitter,
  ) {
    for await (const event of stream) {
      // Handle sources
      if (
        event.event === 'on_chain_end' &&
        event.name === 'FinalSourceRetriever'
      ) {
        emitter.emit(
          'data',
          JSON.stringify({ type: 'sources', data: event.data.output }),
        );
      }

      // Handle regular chain streaming
      if (
        event.event === 'on_chain_stream' &&
        event.name === 'FinalResponseGenerator'
      ) {
        emitter.emit(
          'data',
          JSON.stringify({ type: 'response', data: event.data.chunk }),
        );
      }

      // Handle agent streaming (when tools are used)
      if (
        event.event === 'on_chat_model_stream' &&
        this.config.tools && this.config.tools.length > 0
      ) {
        const content = event.data?.chunk?.content;
        if (content && typeof content === 'string' && content.length > 0) {
          emitter.emit(
            'data',
            JSON.stringify({ type: 'response', data: content }),
          );
        }
      }

      // Handle tool execution events
      if (
        event.event === 'on_tool_start' &&
        this.config.tools && this.config.tools.length > 0
      ) {
        const toolName = event.name;
        emitter.emit(
          'data',
          JSON.stringify({
            type: 'response',
            data: `\n\n🔧 Using tool: ${toolName}\n`
          }),
        );
      }

      // Handle end events
      if (
        event.event === 'on_chain_end' &&
        (event.name === 'FinalResponseGenerator' || event.name === 'AgentExecutor')
      ) {
        emitter.emit('end');
      }
    }
  }

  async searchAndAnswer(
    message: string,
    history: BaseMessage[],
    llm: BaseChatModel,
    optimizationMode: 'speed' | 'balanced' | 'quality',
    fileIds: string[],
    systemInstructions: string,
  ) {
    const emitter = new eventEmitter();

    const answeringChain = await this.createAnsweringChain(
      llm,
      fileIds,
      optimizationMode,
      systemInstructions,
    );

    const stream = answeringChain.streamEvents(
      {
        chat_history: history,
        query: message,
      },
      {
        version: 'v1',
      },
    );

    this.handleStream(stream, emitter);

    return emitter;
  }
}

export default MetaSearchAgent;
