import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { walletAddresses } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { getUserId } from '@/lib/auth/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/wallet/info
 * Get the user's primary wallet address and chain information
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's wallet addresses
    const userWallets = await db.query.walletAddresses.findMany({
      where: eq(walletAddresses.userId, userId),
    });

    if (!userWallets || userWallets.length === 0) {
      return NextResponse.json(
        { error: 'No wallet found' },
        { status: 404 }
      );
    }

    // Find primary wallet or use first one
    const primaryWallet = userWallets.find(w => w.isPrimary) || userWallets[0];

    return NextResponse.json({
      address: primaryWallet.address,
      chainId: primaryWallet.chainId,
      wallets: userWallets.map(w => ({
        address: w.address,
        chainId: w.chainId,
        isPrimary: w.isPrimary,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching wallet info:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
