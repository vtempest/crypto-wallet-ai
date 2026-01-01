/**
 * LangChain Tools for Ethereum MCP Server
 *
 * This module converts MCP server tools into LangChain-compatible tools
 * that can be used by the chatbot agent.
 */

import { z } from 'zod';
import { getEthereumMCPClient } from './mcp-client';
import { toolConfigs } from './mcp-server/src/tools-config.js';

/**
 * Generate LangChain tools from MCP tool configurations
 */
export function generateEthereumTools() {
  const mcpClient = getEthereumMCPClient();

  const tools: any[] = [];

  // Create a LangChain tool for each MCP tool
  for (const toolConfig of toolConfigs) {
    // Build Zod schema based on the tool configuration
    const schemaFields: Record<string, any> = {};

    // Add execution parameters (query params, path params)
    if (toolConfig.executionParameters) {
      toolConfig.executionParameters.forEach((param: any) => {
        // Determine the Zod type based on parameter name/context
        if (param.name === 'address') {
          schemaFields[param.name] = z.string().describe('Ethereum address (0x...)');
        } else if (param.name.includes('hash') || param.name.includes('Hash')) {
          schemaFields[param.name] = z.string().describe('Transaction or block hash (0x...)');
        } else if (param.name.includes('block') || param.name.includes('Block')) {
          schemaFields[param.name] = z.string().optional().describe('Block number or "latest"');
        } else if (param.name.includes('count') || param.name.includes('Count')) {
          schemaFields[param.name] = z.number().int().describe('Count value');
        } else if (param.name === 'fullTransactions') {
          schemaFields[param.name] = z.boolean().optional().describe('Return full transaction objects');
        } else if (Array.isArray(param)) {
          schemaFields[param.name] = z.array(z.string()).describe(param.name);
        } else {
          schemaFields[param.name] = z.string().optional().describe(param.name);
        }
      });
    }

    // Add requestBody if the tool accepts one
    if (toolConfig.method.toLowerCase() !== 'get') {
      schemaFields.requestBody = z.record(z.any()).optional().describe('Request body parameters');
    }

    const schema = z.object(schemaFields);

    // Create the tool
    const tool = {
      name: toolConfig.name,
      description: `${toolConfig.description}. ${getToolExtraDescription(toolConfig.name)}`,
      schema: schema,
      func: async (params: Record<string, any>) => {
        try {
          const result = await mcpClient.callTool(toolConfig.name, params);

          if (!result.ok) {
            return `Error calling ${toolConfig.name}: ${result.error || 'Unknown error'}`;
          }

          // Format the response
          if (typeof result.data === 'string') {
            return result.data;
          } else if (typeof result.data === 'object' && result.data !== null) {
            return JSON.stringify(result.data, null, 2);
          } else {
            return String(result.data);
          }
        } catch (error: any) {
          return `Error executing ${toolConfig.name}: ${error.message}`;
        }
      },
    };

    tools.push(tool);
  }

  return tools;
}

/**
 * Get additional description for specific tools to help the AI understand when to use them
 */
function getToolExtraDescription(toolName: string): string {
  const descriptions: Record<string, string> = {
    ethRequestAccounts: 'Use this to request access to user Ethereum accounts',
    ethAccounts: 'Use this to get the list of accounts the user has connected',
    ethGetBalance: 'Use this to check the ETH balance of an address',
    ethSendTransaction: 'Use this to send a transaction (requires user approval)',
    ethGetTransactionByHash: 'Use this to get details of a transaction by its hash',
    ethGetTransactionReceipt: 'Use this to check if a transaction was successful and get its receipt',
    ethChainId: 'Use this to get the current chain ID the wallet is connected to',
    ethBlockNumber: 'Use this to get the latest block number',
    ethGasPrice: 'Use this to get the current gas price',
    ethEstimateGas: 'Use this to estimate gas for a transaction before sending it',
    personalSign: 'Use this to request the user to sign a message',
    ethSignTypedDataV4: 'Use this to request the user to sign structured data (EIP-712)',
    walletSwitchEthereumChain: 'Use this to switch to a different Ethereum network',
    walletAddEthereumChain: 'Use this to add a new network to the user wallet',
    ethCall: 'Use this to call a smart contract function without sending a transaction',
    ethGetCode: 'Use this to get the bytecode of a smart contract',
    ethGetLogs: 'Use this to query event logs from smart contracts',
  };

  return descriptions[toolName] || '';
}

/**
 * Get a subset of the most commonly used Ethereum tools
 * This is useful when you want to limit the number of tools available to the agent
 */
export function generateCommonEthereumTools() {
  const allTools = generateEthereumTools();

  const commonToolNames = [
    'ethRequestAccounts',
    'ethAccounts',
    'ethGetBalance',
    'ethSendTransaction',
    'ethGetTransactionByHash',
    'ethGetTransactionReceipt',
    'ethChainId',
    'ethBlockNumber',
    'ethGasPrice',
    'ethEstimateGas',
    'personalSign',
    'walletSwitchEthereumChain',
    'ethCall',
  ];

  return allTools.filter(tool => commonToolNames.includes(tool.name));
}

/**
 * Generate tools for wallet-specific operations
 */
export function generateWalletTools() {
  const allTools = generateEthereumTools();

  const walletToolNames = [
    'ethRequestAccounts',
    'ethAccounts',
    'ethGetBalance',
    'ethSendTransaction',
    'personalSign',
    'ethSignTypedDataV4',
    'walletSwitchEthereumChain',
    'walletAddEthereumChain',
    'walletGetPermissions',
    'walletRequestPermissions',
  ];

  return allTools.filter(tool => walletToolNames.includes(tool.name));
}

/**
 * Generate tools for blockchain data queries
 */
export function generateBlockchainQueryTools() {
  const allTools = generateEthereumTools();

  const queryToolNames = [
    'ethChainId',
    'ethBlockNumber',
    'ethGasPrice',
    'ethGetBalance',
    'ethGetTransactionByHash',
    'ethGetTransactionReceipt',
    'ethGetBlockByNumber',
    'ethGetBlockByHash',
    'ethGetLogs',
    'ethCall',
    'ethGetCode',
    'ethGetStorageAt',
  ];

  return allTools.filter(tool => queryToolNames.includes(tool.name));
}
