import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { requireUserId } from '@/lib/auth/session';

export const GET = async (req: Request) => {
  try {
    // Require authentication
    const userId = await requireUserId();

    // Get user's chats only
    let userChats = await db.query.chats.findMany({
      where: eq(chats.userId, userId),
    });
    userChats = userChats.reverse();
    return Response.json({ chats: userChats }, { status: 200 });
  } catch (err) {
    // Handle auth errors
    if (err instanceof Error && err.message === 'Unauthorized') {
      return Response.json(
        { message: 'Authentication required' },
        { status: 401 },
      );
    }

    console.error('Error in getting chats: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
