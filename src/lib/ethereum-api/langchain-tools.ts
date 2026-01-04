/**
 * LangChain Tools for Ethereum Blockchain
 *
 * This module provides LangChain-compatible tools for Ethereum blockchain operations
 * using viem for direct RPC calls.
 */

import { z } from 'zod';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { createPublicClient, http, formatEther, Address, parseEther, toHex, fromHex, hexToBigInt } from 'viem';
import { mainnet } from 'viem/chains';

/**
 * Get RPC URL based on chain ID
 */
function getRpcUrl(chainId: number = 1) {
  const rpcUrls: Record<number, string> = {
    1: process.env.ETHEREUM_RPC_URL || 'https://eth.public-rpc.com',
    137: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
    10: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
    42161: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
  };

  return rpcUrls[chainId] || rpcUrls[1];
}

/**
 * Create a public client for blockchain interactions
 */
function createEthereumClient(chainId: number = 1) {
  return createPublicClient({
    chain: mainnet,
    transport: http(getRpcUrl(chainId)),
  });
}

/**
 * Generate all Ethereum tools
 */
export function generateEthereumTools(): DynamicStructuredTool[] {
  const publicClient = createEthereumClient();

  const tools: DynamicStructuredTool[] = [];

  // ethGetBalance
  tools.push(
    new DynamicStructuredTool({
      name: 'ethGetBalance',
      description: 'Get the ETH balance of an address. Use this to check the ETH balance of an address',
      schema: z.object({
        address: z.string().describe('Ethereum address (0x...)'),
      }),
      func: async ({ address }) => {
        try {
          const balance = await publicClient.getBalance({
            address: address as Address,
          });
          const balanceInEth = formatEther(balance);
          return `Balance: ${balanceInEth} ETH (${balance.toString()} wei)`;
        } catch (error: any) {
          return `Error getting balance: ${error.message}`;
        }
      },
    })
  );

  // ethGetTransactionByHash
  tools.push(
    new DynamicStructuredTool({
      name: 'ethGetTransactionByHash',
      description: 'Get details of a transaction by its hash. Use this to get details of a transaction by its hash',
      schema: z.object({
        hash: z.string().describe('Transaction hash (0x...)'),
      }),
      func: async ({ hash }) => {
        try {
          const tx = await publicClient.getTransaction({
            hash: hash as `0x${string}`,
          });

          return JSON.stringify({
            from: tx.from,
            to: tx.to,
            value: formatEther(tx.value) + ' ETH',
            gas: tx.gas?.toString(),
            gasPrice: tx.gasPrice ? formatEther(tx.gasPrice) + ' ETH' : 'N/A',
            blockNumber: tx.blockNumber?.toString(),
            blockHash: tx.blockHash,
            status: tx.blockNumber ? 'confirmed' : 'pending',
          }, null, 2);
        } catch (error: any) {
          return `Error getting transaction: ${error.message}`;
        }
      },
    })
  );

  // ethGetTransactionReceipt
  tools.push(
    new DynamicStructuredTool({
      name: 'ethGetTransactionReceipt',
      description: 'Get the receipt of a transaction to check if it was successful. Use this to check if a transaction was successful and get its receipt',
      schema: z.object({
        hash: z.string().describe('Transaction hash (0x...)'),
      }),
      func: async ({ hash }) => {
        try {
          const receipt = await publicClient.getTransactionReceipt({
            hash: hash as `0x${string}`,
          });

          return JSON.stringify({
            status: receipt.status === 'success' ? 'Success' : 'Failed',
            blockNumber: receipt.blockNumber.toString(),
            gasUsed: receipt.gasUsed.toString(),
            effectiveGasPrice: formatEther(receipt.effectiveGasPrice) + ' ETH',
            from: receipt.from,
            to: receipt.to,
            contractAddress: receipt.contractAddress,
          }, null, 2);
        } catch (error: any) {
          return `Error getting receipt: ${error.message}`;
        }
      },
    })
  );

  // ethChainId
  tools.push(
    new DynamicStructuredTool({
      name: 'ethChainId',
      description: 'Get the current chain ID the wallet is connected to. Use this to get the current chain ID the wallet is connected to',
      schema: z.union([z.object({}), z.null(), z.undefined()]).default({}),
      func: async () => {
        try {
          const chainId = await publicClient.getChainId();
          const chainNames: Record<number, string> = {
            1: 'Ethereum Mainnet',
            137: 'Polygon',
            10: 'Optimism',
            42161: 'Arbitrum One',
          };
          return `Chain ID: ${chainId} (${chainNames[chainId] || `Chain ${chainId}`})`;
        } catch (error: any) {
          return `Error getting chain ID: ${error.message}`;
        }
      },
    })
  );

  // ethBlockNumber
  tools.push(
    new DynamicStructuredTool({
      name: 'ethBlockNumber',
      description: 'Get the latest block number. Use this to get the latest block number',
      schema: z.union([z.object({}), z.null(), z.undefined()]).default({}),
      func: async () => {
        try {
          const blockNumber = await publicClient.getBlockNumber();
          return `Latest block number: ${blockNumber.toString()}`;
        } catch (error: any) {
          return `Error getting block number: ${error.message}`;
        }
      },
    })
  );

  // ethGasPrice
  tools.push(
    new DynamicStructuredTool({
      name: 'ethGasPrice',
      description: 'Get the current gas price. Use this to get the current gas price',
      schema: z.union([z.object({}), z.null(), z.undefined()]).default({}),
      func: async () => {
        try {
          const gasPrice = await publicClient.getGasPrice();
          const gasPriceGwei = Number(gasPrice) / 1e9;
          return `Current gas price: ${gasPriceGwei.toFixed(2)} Gwei (${gasPrice.toString()} wei)`;
        } catch (error: any) {
          return `Error getting gas price: ${error.message}`;
        }
      },
    })
  );

  // ethEstimateGas
  tools.push(
    new DynamicStructuredTool({
      name: 'ethEstimateGas',
      description: 'Estimate gas for a transaction before sending it. Use this to estimate gas for a transaction before sending it',
      schema: z.object({
        from: z.string().describe('From address (0x...)'),
        to: z.string().describe('To address (0x...)'),
        value: z.string().optional().describe('Value to send in ETH (e.g., "0.1")'),
        data: z.string().optional().describe('Transaction data (0x...)'),
      }),
      func: async ({ from, to, value, data }) => {
        try {
          const estimateParams: any = {
            account: from as Address,
            to: to as Address,
          };

          if (value) {
            estimateParams.value = parseEther(value);
          }

          if (data) {
            estimateParams.data = data as `0x${string}`;
          }

          const gasEstimate = await publicClient.estimateGas(estimateParams);
          return `Estimated gas: ${gasEstimate.toString()} units`;
        } catch (error: any) {
          return `Error estimating gas: ${error.message}`;
        }
      },
    })
  );

  // ethCall
  tools.push(
    new DynamicStructuredTool({
      name: 'ethCall',
      description: 'Call a smart contract function without sending a transaction. Use this to call a smart contract function without sending a transaction',
      schema: z.object({
        to: z.string().describe('Contract address (0x...)'),
        data: z.string().describe('Encoded function call data (0x...)'),
        from: z.string().optional().describe('From address (0x...)'),
      }),
      func: async ({ to, data, from }) => {
        try {
          const callParams: any = {
            to: to as Address,
            data: data as `0x${string}`,
          };

          if (from) {
            callParams.account = from as Address;
          }

          const result = await publicClient.call(callParams);
          return `Call result: ${result.data || 'No data returned'}`;
        } catch (error: any) {
          return `Error calling contract: ${error.message}`;
        }
      },
    })
  );

  return tools;
}

/**
 * Get additional description for specific tools to help the AI understand when to use them
 */
function getToolExtraDescription(toolName: string): string {
  const descriptions: Record<string, string> = {
    ethGetBalance: 'Use this to check the ETH balance of an address',
    ethGetTransactionByHash: 'Use this to get details of a transaction by its hash',
    ethGetTransactionReceipt: 'Use this to check if a transaction was successful and get its receipt',
    ethChainId: 'Use this to get the current chain ID the wallet is connected to',
    ethBlockNumber: 'Use this to get the latest block number',
    ethGasPrice: 'Use this to get the current gas price',
    ethEstimateGas: 'Use this to estimate gas for a transaction before sending it',
    ethCall: 'Use this to call a smart contract function without sending a transaction',
  };

  return descriptions[toolName] || '';
}

/**
 * Get a subset of the most commonly used Ethereum tools
 * This is useful when you want to limit the number of tools available to the agent
 */
export function generateCommonEthereumTools(): DynamicStructuredTool[] {
  const allTools = generateEthereumTools();

  const commonToolNames = [
    'ethGetBalance',
    'ethGetTransactionByHash',
    'ethGetTransactionReceipt',
    'ethChainId',
    'ethBlockNumber',
    'ethGasPrice',
    'ethEstimateGas',
    'ethCall',
  ];

  return allTools.filter(tool => commonToolNames.includes(tool.name));
}

/**
 * Generate tools for wallet-specific operations
 */
export function generateWalletTools(): DynamicStructuredTool[] {
  return generateCommonEthereumTools();
}

/**
 * Generate tools for blockchain data queries
 */
export function generateBlockchainQueryTools(): DynamicStructuredTool[] {
  return generateEthereumTools();
}
