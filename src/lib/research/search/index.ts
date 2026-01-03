import MetaSearchAgent from '@/lib/research/search/metaSearchAgent';
import prompts from '../prompts';
import { generateCommonEthereumTools } from '@/lib/ethereum-api/langchain-tools';
import { getWalletAwareTools } from '@/lib/ethereum-api/server-tools';
import { DynamicStructuredTool } from '@langchain/core/tools';

/**
 * Create Ethereum Wallet handler with optional wallet context
 * If wallet context is provided, the handler will include
 * tools that can interact with the user's specific wallet.
 */
export function createSearchHandlers(walletContext?: { address: string; chainId: number }): Record<string, MetaSearchAgent> {
  // Get wallet-aware tools if wallet is connected
  const walletTools: DynamicStructuredTool[] = walletContext
    ? getWalletAwareTools(walletContext)
    : [];

  return {
    ethereumWallet: new MetaSearchAgent({
      activeEngines: [],
      queryGeneratorPrompt: '',
      queryGeneratorFewShots: [],
      responsePrompt: walletContext
        ? prompts.ethereumWalletPrompt + `\n\nYou are currently connected to wallet: ${walletContext.address} on chain ID ${walletContext.chainId}.`
        : prompts.ethereumWalletPrompt,
      rerank: false,
      rerankThreshold: 0,
      searchWeb: false,
      // Combine both generic Ethereum tools and wallet-specific tools
      tools: [...generateCommonEthereumTools(), ...walletTools],
    }),
  };
}

// Export default handlers without wallet context for backwards compatibility
export const searchHandlers = createSearchHandlers();
