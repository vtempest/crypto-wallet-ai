/**
 * JSON-RPC Routes
 * Generic JSON-RPC endpoint for any method
 */

import express from 'express';
import { provider } from './ethereumProvider.js';

const router = express.Router();

/**
 * Mapping of JSON-RPC methods to their handlers
 * This allows calling any supported method through a single endpoint
 */
const methodHandlers = {
  // Wallet methods
  'wallet_addEthereumChain': async (params) => provider.walletAddEthereumChain(params[0]),
  'wallet_switchEthereumChain': async (params) => provider.walletSwitchEthereumChain(params[0]?.chainId),
  'wallet_watchAsset': async (params) => provider.walletWatchAsset(params[0]),
  'wallet_requestPermissions': async (params) => provider.walletRequestPermissions(params[0]),
  'wallet_getPermissions': async () => provider.walletGetPermissions(),
  'wallet_revokePermissions': async (params) => provider.walletRevokePermissions(params[0]),
  
  // Account methods
  'eth_accounts': async () => provider.ethAccounts(),
  'eth_requestAccounts': async () => provider.ethRequestAccounts(),
  'eth_sendTransaction': async (params) => provider.ethSendTransaction(params[0]),
  'eth_sendRawTransaction': async (params) => provider.ethSendRawTransaction(params[0]),
  'eth_getTransactionByHash': async (params) => provider.ethGetTransactionByHash(params[0]),
  'eth_getTransactionReceipt': async (params) => provider.ethGetTransactionReceipt(params[0]),
  'eth_getTransactionCount': async (params) => provider.ethGetTransactionCount(params[0], params[1] || 'latest'),
  'eth_getTransactionByBlockHashAndIndex': async (params) => provider.ethGetTransactionByBlockHashAndIndex(params[0], params[1]),
  'eth_getTransactionByBlockNumberAndIndex': async (params) => provider.ethGetTransactionByBlockNumberAndIndex(params[0], params[1]),
  'eth_estimateGas': async (params) => provider.ethEstimateGas(params[0], params[1] || 'latest'),
  
  // Signing methods
  'personal_sign': async (params) => provider.personalSign(params[0], params[1]),
  'eth_signTypedData_v4': async (params) => provider.ethSignTypedDataV4(params[0], params[1]),
  'eth_decrypt': async (params) => provider.ethDecrypt(params[0], params[1]),
  'eth_getEncryptionPublicKey': async (params) => provider.ethGetEncryptionPublicKey(params[0]),
  
  // Chain methods
  'eth_chainId': async () => provider.ethChainId(),
  'eth_blockNumber': async () => provider.ethBlockNumber(),
  'eth_syncing': async () => provider.ethSyncing(),
  'eth_coinbase': async () => provider.ethCoinbase(),
  'eth_gasPrice': async () => provider.ethGasPrice(),
  'eth_feeHistory': async (params) => provider.ethFeeHistory(
    parseInt(params[0], 16),
    params[1] || 'latest',
    params[2] || []
  ),
  
  // Block methods
  'eth_getBlockByHash': async (params) => provider.ethGetBlockByHash(params[0], params[1] || false),
  'eth_getBlockByNumber': async (params) => provider.ethGetBlockByNumber(params[0] || 'latest', params[1] || false),
  'eth_getBlockTransactionCountByHash': async (params) => provider.ethGetBlockTransactionCountByHash(params[0]),
  'eth_getBlockTransactionCountByNumber': async (params) => provider.ethGetBlockTransactionCountByNumber(params[0]),
  'eth_getUncleCountByBlockHash': async (params) => provider.ethGetUncleCountByBlockHash(params[0]),
  'eth_getUncleCountByBlockNumber': async (params) => provider.ethGetUncleCountByBlockNumber(params[0]),
  
  // State methods
  'eth_getBalance': async (params) => provider.ethGetBalance(params[0], params[1] || 'latest'),
  'eth_getStorageAt': async (params) => provider.ethGetStorageAt(params[0], params[1], params[2] || 'latest'),
  'eth_getCode': async (params) => provider.ethGetCode(params[0], params[1] || 'latest'),
  'eth_getProof': async (params) => provider.ethGetProof(params[0], params[1] || [], params[2] || 'latest'),
  'eth_call': async (params) => provider.ethCall(params[0], params[1] || 'latest'),
  'eth_getLogs': async (params) => provider.ethGetLogs(params[0] || {}),
  
  // Filter methods
  'eth_newFilter': async (params) => provider.ethNewFilter(params[0] || {}),
  'eth_newBlockFilter': async () => provider.ethNewBlockFilter(),
  'eth_newPendingTransactionFilter': async () => provider.ethNewPendingTransactionFilter(),
  'eth_getFilterChanges': async (params) => provider.ethGetFilterChanges(params[0]),
  'eth_getFilterLogs': async (params) => provider.ethGetFilterLogs(params[0]),
  'eth_uninstallFilter': async (params) => provider.ethUninstallFilter(params[0]),
  'eth_subscribe': async (params) => provider.ethSubscribe(params[0], params[1]),
  'eth_unsubscribe': async (params) => provider.ethUnsubscribe(params[0]),
  
  // Utility methods
  'web3_clientVersion': async () => provider.web3ClientVersion(),
  'web3_sha3': async (params) => provider.web3Sha3(params[0]),
  'net_version': async () => provider.netVersion(),
  'net_listening': async () => provider.netListening(),
  'net_peerCount': async () => provider.netPeerCount()
};

/**
 * POST /jsonrpc
 * Generic JSON-RPC endpoint
 */
router.post('/jsonrpc', async (req, res, next) => {
  try {
    const { jsonrpc, method, params = [], id } = req.body;
    
    // Validate JSON-RPC version
    if (jsonrpc !== '2.0') {
      return res.json({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32600,
          message: 'Invalid Request: jsonrpc must be "2.0"'
        }
      });
    }
    
    // Validate method
    if (!method || typeof method !== 'string') {
      return res.json({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32600,
          message: 'Invalid Request: method is required'
        }
      });
    }
    
    // Check if method is supported
    const handler = methodHandlers[method];
    if (!handler) {
      // Try direct provider request for unsupported methods
      try {
        const result = await provider.request(method, params);
        return res.json({
          jsonrpc: '2.0',
          id,
          result
        });
      } catch (error) {
        return res.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`
          }
        });
      }
    }
    
    // Execute method
    const result = await handler(params);
    
    res.json({
      jsonrpc: '2.0',
      id,
      result
    });
  } catch (error) {
    const { id } = req.body;
    
    res.json({
      jsonrpc: '2.0',
      id,
      error: {
        code: error.code || -32603,
        message: error.message || 'Internal error',
        data: error.data
      }
    });
  }
});

/**
 * POST /jsonrpc/batch
 * Batch JSON-RPC endpoint
 */
router.post('/jsonrpc/batch', async (req, res, next) => {
  try {
    const requests = req.body;
    
    if (!Array.isArray(requests)) {
      return res.status(400).json({
        error: { code: -32600, message: 'Invalid Request: expected array for batch' }
      });
    }
    
    const responses = await Promise.all(
      requests.map(async (request) => {
        const { jsonrpc, method, params = [], id } = request;
        
        if (jsonrpc !== '2.0' || !method) {
          return {
            jsonrpc: '2.0',
            id,
            error: { code: -32600, message: 'Invalid Request' }
          };
        }
        
        const handler = methodHandlers[method];
        if (!handler) {
          try {
            const result = await provider.request(method, params);
            return { jsonrpc: '2.0', id, result };
          } catch (error) {
            return {
              jsonrpc: '2.0',
              id,
              error: { code: -32601, message: `Method not found: ${method}` }
            };
          }
        }
        
        try {
          const result = await handler(params);
          return { jsonrpc: '2.0', id, result };
        } catch (error) {
          return {
            jsonrpc: '2.0',
            id,
            error: {
              code: error.code || -32603,
              message: error.message || 'Internal error'
            }
          };
        }
      })
    );
    
    res.json(responses);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /methods
 * List all available methods
 */
router.get('/methods', (req, res) => {
  const methods = Object.keys(methodHandlers).sort();
  
  const categorized = {
    wallet: methods.filter(m => m.startsWith('wallet_')),
    accounts: methods.filter(m => 
      ['eth_accounts', 'eth_requestAccounts', 'eth_sendTransaction', 
       'eth_sendRawTransaction', 'eth_getTransaction', 'eth_estimateGas']
      .some(prefix => m.startsWith(prefix.split('_')[0] + '_' + prefix.split('_')[1]))
    ),
    signing: methods.filter(m => 
      ['personal_sign', 'eth_signTypedData', 'eth_decrypt', 'eth_getEncryption']
      .some(prefix => m.startsWith(prefix))
    ),
    chain: methods.filter(m => 
      ['eth_chainId', 'eth_blockNumber', 'eth_syncing', 'eth_coinbase', 
       'eth_gasPrice', 'eth_feeHistory']
      .includes(m)
    ),
    blocks: methods.filter(m => 
      m.includes('Block') && !m.includes('Filter')
    ),
    state: methods.filter(m => 
      ['eth_getBalance', 'eth_getStorage', 'eth_getCode', 'eth_getProof', 
       'eth_call', 'eth_getLogs']
      .some(prefix => m.startsWith(prefix))
    ),
    filters: methods.filter(m => 
      m.includes('Filter') || m.includes('subscribe')
    ),
    utility: methods.filter(m => 
      m.startsWith('web3_') || m.startsWith('net_')
    )
  };
  
  res.json({
    total: methods.length,
    methods,
    categorized
  });
});

export default router;
