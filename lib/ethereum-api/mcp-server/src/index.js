#!/usr/bin/env node

/**
 * api-mcp-server - MCP Server
 *
 * Features:
 * - 49 API tools available
 * - Built-in Inspector at http://localhost:3000/inspector
 */

import 'dotenv/config';
import { MCPServer } from 'mcp-use/server';
import { text, object } from 'mcp-use/server';
import { z } from 'zod';
import { executeRequest } from './http-client.js';
import { toolConfigMap } from './tools-config.js';

// ============================================================================
// Configuration
// ============================================================================

const PORT = parseInt(process.env.PORT || '3000');
const isDev = process.env.NODE_ENV !== 'production';

// API configuration
const apiConfig = {
  baseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api/v1',
  headers: {},
};

// Set up authentication headers
if (process.env.API_KEY) {
  apiConfig.headers['Authorization'] = `Bearer ${process.env.API_KEY}`;
}

if (process.env.API_AUTH_HEADER) {
  const [key, ...valueParts] = process.env.API_AUTH_HEADER.split(':');
  const value = valueParts.join(':'); // Handle values with colons
  if (key && value) {
    apiConfig.headers[key.trim()] = value.trim();
  }
}

// ============================================================================
// Server Setup
// ============================================================================

const server = new MCPServer({
  name: 'api-mcp-server',
  version: '1.0.0',
  description: 'MCP server generated from OpenAPI specification',
  baseUrl: process.env.MCP_URL || `http://localhost:${PORT}`,
  allowedOrigins: isDev 
    ? undefined  // Development: allow all origins
    : process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()) || [],
});

// ============================================================================
// Tool Registrations
// ============================================================================

// Add Ethereum Chain
server.tool(
  {
    name: 'walletAddEthereumChain',
    description: 'Add Ethereum Chain',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletAddEthereumChain');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Switch Ethereum Chain
server.tool(
  {
    name: 'walletSwitchEthereumChain',
    description: 'Switch Ethereum Chain',
    schema: z.object({
    requestBody: z.object({
    chainId: z.string().describe('The chain ID as a hex string')
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletSwitchEthereumChain');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Watch Asset
server.tool(
  {
    name: 'walletWatchAsset',
    description: 'Watch Asset',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletWatchAsset');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Request Permissions
server.tool(
  {
    name: 'walletRequestPermissions',
    description: 'Request Permissions',
    schema: z.object({
    requestBody: z.object({
    eth_accounts: z.record(z.string(), z.unknown()).optional().describe('Request account access permission')
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletRequestPermissions');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Permissions
server.tool(
  {
    name: 'walletGetPermissions',
    description: 'Get Permissions',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletGetPermissions');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Revoke Permissions
server.tool(
  {
    name: 'walletRevokePermissions',
    description: 'Revoke Permissions',
    schema: z.object({
    requestBody: z.object({
    eth_accounts: z.record(z.string(), z.unknown()).optional()
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletRevokePermissions');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Send Batched Calls
server.tool(
  {
    name: 'walletSendCalls',
    description: 'Send Batched Calls',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletSendCalls');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Calls Status
server.tool(
  {
    name: 'walletGetCallsStatus',
    description: 'Get Calls Status',
    schema: z.object({
    requestBody: z.object({
    batchId: z.string()
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletGetCallsStatus');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Wallet Capabilities
server.tool(
  {
    name: 'walletGetCapabilities',
    description: 'Get Wallet Capabilities',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('walletGetCapabilities');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Request Accounts
server.tool(
  {
    name: 'ethRequestAccounts',
    description: 'Request Accounts',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethRequestAccounts');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Accounts
server.tool(
  {
    name: 'ethAccounts',
    description: 'Get Accounts',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethAccounts');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Send Transaction
server.tool(
  {
    name: 'ethSendTransaction',
    description: 'Send Transaction',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethSendTransaction');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Send Raw Transaction
server.tool(
  {
    name: 'ethSendRawTransaction',
    description: 'Send Raw Transaction',
    schema: z.object({
    requestBody: z.object({
    signedTransaction: z.string().describe('The signed transaction data')
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethSendRawTransaction');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Transaction by Hash
server.tool(
  {
    name: 'ethGetTransactionByHash',
    description: 'Get Transaction by Hash',
    schema: z.object({
    hash: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetTransactionByHash');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Transaction Receipt
server.tool(
  {
    name: 'ethGetTransactionReceipt',
    description: 'Get Transaction Receipt',
    schema: z.object({
    hash: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetTransactionReceipt');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Transaction Count
server.tool(
  {
    name: 'ethGetTransactionCount',
    description: 'Get Transaction Count',
    schema: z.object({
    address: z.string(),
    block: z.string().optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetTransactionCount');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Estimate Gas
server.tool(
  {
    name: 'ethEstimateGas',
    description: 'Estimate Gas',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethEstimateGas');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Personal Sign
server.tool(
  {
    name: 'personalSign',
    description: 'Personal Sign',
    schema: z.object({
    requestBody: z.object({
    message: z.string().describe('Message to sign (hex or UTF-8 string)'),
    address: z.string().describe('Address to sign with')
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('personalSign');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Sign Typed Data V4
server.tool(
  {
    name: 'ethSignTypedDataV4',
    description: 'Sign Typed Data V4',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethSignTypedDataV4');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Decrypt (Deprecated)
server.tool(
  {
    name: 'ethDecrypt',
    description: 'Decrypt (Deprecated)',
    schema: z.object({
    requestBody: z.object({
    encryptedMessage: z.string(),
    address: z.string()
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethDecrypt');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Encryption Public Key (Deprecated)
server.tool(
  {
    name: 'ethGetEncryptionPublicKey',
    description: 'Get Encryption Public Key (Deprecated)',
    schema: z.object({
    requestBody: z.object({
    address: z.string()
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetEncryptionPublicKey');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Chain ID
server.tool(
  {
    name: 'ethChainId',
    description: 'Get Chain ID',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethChainId');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Block Number
server.tool(
  {
    name: 'ethBlockNumber',
    description: 'Get Block Number',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethBlockNumber');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Syncing Status
server.tool(
  {
    name: 'ethSyncing',
    description: 'Get Syncing Status',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethSyncing');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Coinbase
server.tool(
  {
    name: 'ethCoinbase',
    description: 'Get Coinbase',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethCoinbase');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Gas Price
server.tool(
  {
    name: 'ethGasPrice',
    description: 'Get Gas Price',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGasPrice');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Fee History
server.tool(
  {
    name: 'ethFeeHistory',
    description: 'Get Fee History',
    schema: z.object({
    blockCount: z.number().int(),
    newestBlock: z.string().optional(),
    rewardPercentiles: z.array(z.number()).optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethFeeHistory');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Block by Hash
server.tool(
  {
    name: 'ethGetBlockByHash',
    description: 'Get Block by Hash',
    schema: z.object({
    hash: z.string(),
    fullTransactions: z.boolean().optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetBlockByHash');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Block by Number
server.tool(
  {
    name: 'ethGetBlockByNumber',
    description: 'Get Block by Number',
    schema: z.object({
    blockNumber: z.string(),
    fullTransactions: z.boolean().optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetBlockByNumber');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Block Transaction Count by Hash
server.tool(
  {
    name: 'ethGetBlockTransactionCountByHash',
    description: 'Get Block Transaction Count by Hash',
    schema: z.object({
    hash: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetBlockTransactionCountByHash');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Block Transaction Count by Number
server.tool(
  {
    name: 'ethGetBlockTransactionCountByNumber',
    description: 'Get Block Transaction Count by Number',
    schema: z.object({
    blockNumber: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetBlockTransactionCountByNumber');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Uncle Count by Block Hash
server.tool(
  {
    name: 'ethGetUncleCountByBlockHash',
    description: 'Get Uncle Count by Block Hash',
    schema: z.object({
    hash: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetUncleCountByBlockHash');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Uncle Count by Block Number
server.tool(
  {
    name: 'ethGetUncleCountByBlockNumber',
    description: 'Get Uncle Count by Block Number',
    schema: z.object({
    blockNumber: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetUncleCountByBlockNumber');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Balance
server.tool(
  {
    name: 'ethGetBalance',
    description: 'Get Balance',
    schema: z.object({
    address: z.string(),
    block: z.string().optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetBalance');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Storage At
server.tool(
  {
    name: 'ethGetStorageAt',
    description: 'Get Storage At',
    schema: z.object({
    address: z.string(),
    position: z.string(),
    block: z.string().optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetStorageAt');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Code
server.tool(
  {
    name: 'ethGetCode',
    description: 'Get Code',
    schema: z.object({
    address: z.string(),
    block: z.string().optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetCode');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Proof
server.tool(
  {
    name: 'ethGetProof',
    description: 'Get Proof',
    schema: z.object({
    address: z.string(),
    storageKeys: z.array(z.string()),
    block: z.string().optional()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetProof');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Call
server.tool(
  {
    name: 'ethCall',
    description: 'Call',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethCall');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Logs
server.tool(
  {
    name: 'ethGetLogs',
    description: 'Get Logs',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetLogs');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// New Filter
server.tool(
  {
    name: 'ethNewFilter',
    description: 'New Filter',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethNewFilter');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// New Block Filter
server.tool(
  {
    name: 'ethNewBlockFilter',
    description: 'New Block Filter',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethNewBlockFilter');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// New Pending Transaction Filter
server.tool(
  {
    name: 'ethNewPendingTransactionFilter',
    description: 'New Pending Transaction Filter',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethNewPendingTransactionFilter');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Filter Changes
server.tool(
  {
    name: 'ethGetFilterChanges',
    description: 'Get Filter Changes',
    schema: z.object({
    filterId: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetFilterChanges');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Filter Logs
server.tool(
  {
    name: 'ethGetFilterLogs',
    description: 'Get Filter Logs',
    schema: z.object({
    filterId: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethGetFilterLogs');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Uninstall Filter
server.tool(
  {
    name: 'ethUninstallFilter',
    description: 'Uninstall Filter',
    schema: z.object({
    filterId: z.string()
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethUninstallFilter');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Subscribe
server.tool(
  {
    name: 'ethSubscribe',
    description: 'Subscribe',
    schema: z.object({
    requestBody: z.object({
    subscriptionType: z.enum(['newHeads', 'logs', 'newPendingTransactions', 'syncing']),
    filter: z.unknown().optional()
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethSubscribe');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Unsubscribe
server.tool(
  {
    name: 'ethUnsubscribe',
    description: 'Unsubscribe',
    schema: z.object({
    requestBody: z.object({
    subscriptionId: z.string()
  }).describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('ethUnsubscribe');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Get Client Version
server.tool(
  {
    name: 'web3ClientVersion',
    description: 'Get Client Version',
    schema: z.object({}),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('web3ClientVersion');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// Generic JSON-RPC
server.tool(
  {
    name: 'jsonRpc',
    description: 'Generic JSON-RPC',
    schema: z.object({
    requestBody: z.unknown().describe('Request body')
  }),
  },
  async (params) => {
    const toolConfig = toolConfigMap.get('jsonRpc');
    const result = await executeRequest(toolConfig, params, apiConfig);

    if (!result.ok) {
      return text(`Error: ${result.status} ${result.statusText}\n${
        typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)
      }`);
    }

    // Return MCP content based on response type
    if (typeof result.data === 'string') {
      return text(result.data);
    } else if (typeof result.data === 'object' && result.data !== null) {
      return object(result.data);
    } else {
      return text(String(result.data));
    }
  }
);

// ============================================================================
// Start Server
// ============================================================================

server.listen(PORT);

console.log(`
🚀 api-mcp-server MCP Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Server:    http://localhost:${PORT}
🔍 Inspector: http://localhost:${PORT}/inspector
📡 MCP:       http://localhost:${PORT}/mcp
🔄 SSE:       http://localhost:${PORT}/sse

🛠️  Tools Available: 49
   • walletAddEthereumChain
   • walletSwitchEthereumChain
   • walletWatchAsset
   • walletRequestPermissions
   • walletGetPermissions
   ... and 44 more
Environment: ${isDev ? 'Development' : 'Production'}
API Base:    ${apiConfig.baseUrl || 'Not configured'}
`);
