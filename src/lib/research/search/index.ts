import MetaSearchAgent from '@/lib/research/search/metaSearchAgent';
import prompts from '../prompts';
import { generateCommonEthereumTools } from '@/lib/ethereum-api/langchain-tools';
import { getWalletAwareTools } from '@/lib/ethereum-api/server-tools';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { loadMCPServerTools } from '@/lib/mcpservers/toolLoader';

/**
 * Create Ethereum Wallet handler with optional wallet context
 * If wallet context is provided, the handler will include
 * tools that can interact with the user's specific wallet.
 *
 * This function now also loads tools from all enabled MCP servers.
 */
export async function createSearchHandlers(walletContext?: { address: string; chainId: number }): Promise<Record<string, MetaSearchAgent>> {
  // Get wallet-aware tools if wallet is connected
  const walletTools: DynamicStructuredTool[] = walletContext
    ? getWalletAwareTools(walletContext)
    : [];

  // Load tools from all enabled MCP servers
  let mcpTools: DynamicStructuredTool[] = [];
  try {
    mcpTools = await loadMCPServerTools();
    console.log(`[createSearchHandlers] Loaded ${mcpTools.length} tools from MCP servers`);
  } catch (error) {
    console.error('[createSearchHandlers] Failed to load MCP server tools:', error);
    // Continue without MCP tools if loading fails
  }

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
      // Combine Ethereum tools, wallet-specific tools, and MCP server tools
      tools: [...generateCommonEthereumTools(), ...walletTools, ...mcpTools],
    }),
  };
}

// Export default handlers without wallet context for backwards compatibility
// Note: This is now async, so consumers need to await it
export const getDefaultSearchHandlers = async () => createSearchHandlers();
