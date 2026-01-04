/**
 * Server-side Ethereum Tools that work with authenticated user's wallet
 *
 * These tools use the user's wallet address from the session
 * and make calls to Ethereum RPC providers on behalf of the user.
 */

import { z } from 'zod';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { createPublicClient, http, formatEther, parseEther, Address } from 'viem';
import { mainnet } from 'viem/chains';

interface WalletContext {
  address: string;
  chainId: number;
}

/**
 * Get Ethereum tools that work with the user's authenticated wallet
 */
export function getWalletAwareTools(walletContext: WalletContext): DynamicStructuredTool[] {
  // Get RPC URL based on chain ID
  const getRpcUrl = (chainId: number) => {
    // Add more RPC URLs as needed
    const rpcUrls: Record<number, string> = {
      1: process.env.ETHEREUM_RPC_URL || 'https://eth.public-rpc.com',
      137: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      10: process.env.OPTIMISM_RPC_URL || 'https://mainnet.optimism.io',
      42161: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc',
    };

    return rpcUrls[chainId] || rpcUrls[1];
  };

  // Create a public client for the user's chain
  const publicClient = createPublicClient({
    chain: mainnet, // This should be dynamic based on chainId
    transport: http(getRpcUrl(walletContext.chainId)),
  });

  const tools: DynamicStructuredTool[] = [];

  // Get wallet balance
  tools.push(
    new DynamicStructuredTool({
      name: 'getMyWalletBalance',
      description: `Get the ETH balance of your connected wallet (${walletContext.address}). Returns balance in ETH.`,
      schema: z.object({}),
      func: async () => {
        try {
          const balance = await publicClient.getBalance({
            address: walletContext.address as Address,
          });
          const balanceInEth = formatEther(balance);

          // Return structured data for better formatting by AI
          return JSON.stringify({
            address: walletContext.address,
            balance: balanceInEth,
            balanceFormatted: `${parseFloat(balanceInEth).toFixed(4)} ETH`,
            chainId: walletContext.chainId,
          });
        } catch (error: any) {
          return `Error getting balance: ${error.message}`;
        }
      },
    })
  );

  // Get wallet transaction count (nonce)
  tools.push(
    new DynamicStructuredTool({
      name: 'getMyTransactionCount',
      description: `Get the number of transactions sent from your wallet (${walletContext.address}). This is also known as the nonce.`,
      schema: z.object({}),
      func: async () => {
        try {
          const count = await publicClient.getTransactionCount({
            address: walletContext.address as Address,
          });
          return `Your wallet has sent ${count} transactions`;
        } catch (error: any) {
          return `Error getting transaction count: ${error.message}`;
        }
      },
    })
  );

  // Get current chain info
  tools.push(
    new DynamicStructuredTool({
      name: 'getMyChainInfo',
      description: 'Get information about the blockchain network you are currently connected to',
      schema: z.object({}),
      func: async () => {
        try {
          const chainId = await publicClient.getChainId();
          const blockNumber = await publicClient.getBlockNumber();
          const chainNames: Record<number, string> = {
            1: 'Ethereum Mainnet',
            137: 'Polygon',
            10: 'Optimism',
            42161: 'Arbitrum One',
          };

          return JSON.stringify({
            chainId: chainId,
            chainName: chainNames[chainId] || `Chain ${chainId}`,
            latestBlock: blockNumber.toString(),
            connectedWallet: walletContext.address,
          }, null, 2);
        } catch (error: any) {
          return `Error getting chain info: ${error.message}`;
        }
      },
    })
  );

  // Get gas price
  tools.push(
    new DynamicStructuredTool({
      name: 'getCurrentGasPrice',
      description: 'Get the current gas price on the network in Gwei',
      schema: z.object({}),
      func: async () => {
        try {
          const gasPrice = await publicClient.getGasPrice();
          const gasPriceGwei = Number(gasPrice) / 1e9;
          return `Current gas price: ${gasPriceGwei.toFixed(2)} Gwei`;
        } catch (error: any) {
          return `Error getting gas price: ${error.message}`;
        }
      },
    })
  );

  // Get any address balance
  tools.push(
    new DynamicStructuredTool({
      name: 'getAddressBalance',
      description: 'Get the ETH balance of any Ethereum address. Useful for checking other wallets or contracts.',
      schema: z.object({
        address: z.string().describe('The Ethereum address to check (0x...)'),
      }),
      func: async ({ address }) => {
        try {
          const balance = await publicClient.getBalance({
            address: address as Address,
          });
          const balanceInEth = formatEther(balance);
          return `Balance of ${address}: ${balanceInEth} ETH`;
        } catch (error: any) {
          return `Error getting balance: ${error.message}`;
        }
      },
    })
  );

  // Get transaction by hash
  tools.push(
    new DynamicStructuredTool({
      name: 'getTransaction',
      description: 'Get details of a transaction by its hash',
      schema: z.object({
        hash: z.string().describe('The transaction hash (0x...)'),
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
            blockNumber: tx.blockNumber?.toString(),
            status: tx.blockNumber ? 'confirmed' : 'pending',
          }, null, 2);
        } catch (error: any) {
          return `Error getting transaction: ${error.message}`;
        }
      },
    })
  );

  // Get transaction receipt
  tools.push(
    new DynamicStructuredTool({
      name: 'getTransactionReceipt',
      description: 'Get the receipt of a transaction to check if it was successful',
      schema: z.object({
        hash: z.string().describe('The transaction hash (0x...)'),
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
            from: receipt.from,
            to: receipt.to,
          }, null, 2);
        } catch (error: any) {
          return `Error getting receipt: ${error.message}`;
        }
      },
    })
  );

  // Get wallet info summary
  tools.push(
    new DynamicStructuredTool({
      name: 'getMyWalletSummary',
      description: 'Get a complete summary of your wallet including balance, transactions, and network info',
      schema: z.object({}),
      func: async () => {
        try {
          const [balance, txCount, chainId, blockNumber, gasPrice] = await Promise.all([
            publicClient.getBalance({ address: walletContext.address as Address }),
            publicClient.getTransactionCount({ address: walletContext.address as Address }),
            publicClient.getChainId(),
            publicClient.getBlockNumber(),
            publicClient.getGasPrice(),
          ]);

          const chainNames: Record<number, string> = {
            1: 'Ethereum Mainnet',
            137: 'Polygon',
            10: 'Optimism',
            42161: 'Arbitrum One',
          };

          return JSON.stringify({
            wallet: {
              address: walletContext.address,
              balance: formatEther(balance) + ' ETH',
              transactionCount: txCount,
            },
            network: {
              chainId: chainId,
              chainName: chainNames[chainId] || `Chain ${chainId}`,
              latestBlock: blockNumber.toString(),
              gasPrice: (Number(gasPrice) / 1e9).toFixed(2) + ' Gwei',
            },
          }, null, 2);
        } catch (error: any) {
          return `Error getting wallet summary: ${error.message}`;
        }
      },
    })
  );

  return tools;
}
