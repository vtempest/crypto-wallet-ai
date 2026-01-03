import MetaSearchAgent from '@/lib/research/search/metaSearchAgent';
import prompts from '../prompts';
import { generateCommonEthereumTools } from '@/lib/ethereum-api/langchain-tools';
import { getWalletAwareTools } from '@/lib/ethereum-api/server-tools';
import { DynamicStructuredTool } from '@langchain/core/tools';

/**
 * Create search handlers with optional wallet context
 * If wallet context is provided, the ethereumWallet handler will include
 * tools that can interact with the user's specific wallet.
 */
export function createSearchHandlers(walletContext?: { address: string; chainId: number }): Record<string, MetaSearchAgent> {
  // Get wallet-aware tools if wallet is connected
  const walletTools: DynamicStructuredTool[] = walletContext
    ? getWalletAwareTools(walletContext)
    : [];

  return {
    webSearch: new MetaSearchAgent({
      activeEngines: [],
      queryGeneratorPrompt: prompts.webSearchRetrieverPrompt,
      responsePrompt: prompts.webSearchResponsePrompt,
      queryGeneratorFewShots: prompts.webSearchRetrieverFewShots,
      rerank: true,
      rerankThreshold: 0.3,
      searchWeb: true,
    }),
    academicSearch: new MetaSearchAgent({
      activeEngines: ['arxiv', 'google scholar', 'pubmed'],
      queryGeneratorPrompt: prompts.webSearchRetrieverPrompt,
      responsePrompt: prompts.webSearchResponsePrompt,
      queryGeneratorFewShots: prompts.webSearchRetrieverFewShots,
      rerank: true,
      rerankThreshold: 0,
      searchWeb: true,
    }),
    writingAssistant: new MetaSearchAgent({
      activeEngines: [],
      queryGeneratorPrompt: '',
      queryGeneratorFewShots: [],
      responsePrompt: prompts.writingAssistantPrompt,
      rerank: true,
      rerankThreshold: 0,
      searchWeb: false,
    }),
    wolframAlphaSearch: new MetaSearchAgent({
      activeEngines: ['wolframalpha'],
      queryGeneratorPrompt: prompts.webSearchRetrieverPrompt,
      responsePrompt: prompts.webSearchResponsePrompt,
      queryGeneratorFewShots: prompts.webSearchRetrieverFewShots,
      rerank: false,
      rerankThreshold: 0,
      searchWeb: true,
    }),
    youtubeSearch: new MetaSearchAgent({
      activeEngines: ['youtube'],
      queryGeneratorPrompt: prompts.webSearchRetrieverPrompt,
      responsePrompt: prompts.webSearchResponsePrompt,
      queryGeneratorFewShots: prompts.webSearchRetrieverFewShots,
      rerank: true,
      rerankThreshold: 0.3,
      searchWeb: true,
    }),
    redditSearch: new MetaSearchAgent({
      activeEngines: ['reddit'],
      queryGeneratorPrompt: prompts.webSearchRetrieverPrompt,
      responsePrompt: prompts.webSearchResponsePrompt,
      queryGeneratorFewShots: prompts.webSearchRetrieverFewShots,
      rerank: true,
      rerankThreshold: 0.3,
      searchWeb: true,
    }),
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
