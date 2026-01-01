/**
 * Ethereum Provider Service
 *
 * Handles all JSON-RPC communication with Ethereum nodes.
 * Supports both HTTP and WebSocket connections.
 */

import axios from 'axios';

class EthereumProvider {
  constructor(nodeUrl) {
    this.nodeUrl = nodeUrl || process.env.ETH_NODE_URL || 'https://eth.llamarpc.com';
    this.requestId = 1;
  }

  /**
   * Send a JSON-RPC request to the Ethereum node
   * @param {string} method - The RPC method name
   * @param {Array} params - The method parameters
   * @returns {Promise<any>} - The result from the node
   */
  async request(method, params = []) {
    const payload = {
      jsonrpc: '2.0',
      id: this.requestId++,
      method,
      params
    };

    try {
      const response = await axios.post(this.nodeUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      });

      if (response.data.error) {
        const error = new Error(response.data.error.message);
        error.code = response.data.error.code;
        error.data = response.data.error.data;
        throw error;
      }

      return response.data.result;
    } catch (error) {
      if (error.response) {
        // Server responded with error
        throw {
          code: error.response.data?.error?.code || -32603,
          message: error.response.data?.error?.message || 'Server error',
          data: error.response.data?.error?.data
        };
      } else if (error.request) {
        // No response received
        throw {
          code: -32000,
          message: 'No response from Ethereum node',
          data: { url: this.nodeUrl }
        };
      } else {
        // Request setup error
        throw {
          code: error.code || -32603,
          message: error.message || 'Request failed',
          data: error.data
        };
      }
    }
  }

  /**
   * Batch multiple JSON-RPC requests
   * @param {Array} requests - Array of {method, params} objects
   * @returns {Promise<Array>} - Array of results
   */
  async batchRequest(requests) {
    const payload = requests.map((req, index) => ({
      jsonrpc: '2.0',
      id: this.requestId + index,
      method: req.method,
      params: req.params || []
    }));
    
    this.requestId += requests.length;

    try {
      const response = await axios.post(this.nodeUrl, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 60000
      });

      return response.data.map(item => {
        if (item.error) {
          return { error: item.error };
        }
        return { result: item.result };
      });
    } catch (error) {
      throw {
        code: -32603,
        message: 'Batch request failed',
        data: error.message
      };
    }
  }

  // ============================================
  // WALLET METHODS (MetaMask-specific)
  // Note: These require browser context with MetaMask
  // Server-side implementations are simulations
  // ============================================

  async walletAddEthereumChain(chainParams) {
    // In a real browser context, this triggers MetaMask popup
    // Server-side: validate and return success
    const required = ['chainId', 'chainName', 'rpcUrls'];
    for (const field of required) {
      if (!chainParams[field]) {
        throw { code: -32602, message: `Missing required field: ${field}` };
      }
    }
    return null; // Success returns null
  }

  async walletSwitchEthereumChain(chainId) {
    // Validate chain ID format
    if (!chainId || !chainId.startsWith('0x')) {
      throw { code: -32602, message: 'Invalid chain ID format' };
    }
    return null;
  }

  async walletWatchAsset(params) {
    if (!params.type || !params.options?.address) {
      throw { code: -32602, message: 'Missing required parameters' };
    }
    return true;
  }

  async walletRequestPermissions(permissions) {
    // Return mock permissions for demo
    return [{
      parentCapability: 'eth_accounts',
      invoker: 'https://example.com',
      caveats: []
    }];
  }

  async walletGetPermissions() {
    return [];
  }

  async walletRevokePermissions(permissions) {
    return null;
  }

  // ============================================
  // ACCOUNT METHODS
  // ============================================

  async ethAccounts() {
    return this.request('eth_accounts');
  }

  async ethRequestAccounts() {
    // Server-side: return configured accounts or empty
    return process.env.DEFAULT_ACCOUNTS 
      ? process.env.DEFAULT_ACCOUNTS.split(',')
      : [];
  }

  async ethSendTransaction(tx) {
    return this.request('eth_sendTransaction', [tx]);
  }

  async ethSendRawTransaction(signedTx) {
    return this.request('eth_sendRawTransaction', [signedTx]);
  }

  async ethGetTransactionByHash(hash) {
    return this.request('eth_getTransactionByHash', [hash]);
  }

  async ethGetTransactionReceipt(hash) {
    return this.request('eth_getTransactionReceipt', [hash]);
  }

  async ethGetTransactionCount(address, block = 'latest') {
    return this.request('eth_getTransactionCount', [address, block]);
  }

  async ethGetTransactionByBlockHashAndIndex(blockHash, index) {
    return this.request('eth_getTransactionByBlockHashAndIndex', [blockHash, index]);
  }

  async ethGetTransactionByBlockNumberAndIndex(blockNumber, index) {
    return this.request('eth_getTransactionByBlockNumberAndIndex', [blockNumber, index]);
  }

  async ethEstimateGas(tx, block = 'latest') {
    return this.request('eth_estimateGas', [tx, block]);
  }

  // ============================================
  // SIGNING METHODS
  // Note: Require private key access
  // ============================================

  async personalSign(message, address) {
    // In browser: triggers MetaMask signing popup
    // Server: requires private key configuration
    return this.request('personal_sign', [message, address]);
  }

  async ethSignTypedDataV4(address, typedData) {
    return this.request('eth_signTypedData_v4', [address, typedData]);
  }

  async ethDecrypt(encryptedMessage, address) {
    return this.request('eth_decrypt', [encryptedMessage, address]);
  }

  async ethGetEncryptionPublicKey(address) {
    return this.request('eth_getEncryptionPublicKey', [address]);
  }

  // ============================================
  // CHAIN METHODS
  // ============================================

  async ethChainId() {
    return this.request('eth_chainId');
  }

  async ethBlockNumber() {
    return this.request('eth_blockNumber');
  }

  async ethSyncing() {
    return this.request('eth_syncing');
  }

  async ethCoinbase() {
    return this.request('eth_coinbase');
  }

  async ethGasPrice() {
    return this.request('eth_gasPrice');
  }

  async ethFeeHistory(blockCount, newestBlock, rewardPercentiles) {
    return this.request('eth_feeHistory', [
      `0x${blockCount.toString(16)}`,
      newestBlock,
      rewardPercentiles
    ]);
  }

  // ============================================
  // BLOCK METHODS
  // ============================================

  async ethGetBlockByHash(hash, fullTx = false) {
    return this.request('eth_getBlockByHash', [hash, fullTx]);
  }

  async ethGetBlockByNumber(blockNumber, fullTx = false) {
    return this.request('eth_getBlockByNumber', [blockNumber, fullTx]);
  }

  async ethGetBlockTransactionCountByHash(hash) {
    return this.request('eth_getBlockTransactionCountByHash', [hash]);
  }

  async ethGetBlockTransactionCountByNumber(blockNumber) {
    return this.request('eth_getBlockTransactionCountByNumber', [blockNumber]);
  }

  async ethGetUncleCountByBlockHash(hash) {
    return this.request('eth_getUncleCountByBlockHash', [hash]);
  }

  async ethGetUncleCountByBlockNumber(blockNumber) {
    return this.request('eth_getUncleCountByBlockNumber', [blockNumber]);
  }

  // ============================================
  // STATE METHODS
  // ============================================

  async ethGetBalance(address, block = 'latest') {
    return this.request('eth_getBalance', [address, block]);
  }

  async ethGetStorageAt(address, position, block = 'latest') {
    return this.request('eth_getStorageAt', [address, position, block]);
  }

  async ethGetCode(address, block = 'latest') {
    return this.request('eth_getCode', [address, block]);
  }

  async ethGetProof(address, storageKeys, block = 'latest') {
    return this.request('eth_getProof', [address, storageKeys, block]);
  }

  async ethCall(tx, block = 'latest') {
    return this.request('eth_call', [tx, block]);
  }

  async ethGetLogs(filter) {
    return this.request('eth_getLogs', [filter]);
  }

  // ============================================
  // FILTER METHODS
  // ============================================

  async ethNewFilter(filter) {
    return this.request('eth_newFilter', [filter]);
  }

  async ethNewBlockFilter() {
    return this.request('eth_newBlockFilter');
  }

  async ethNewPendingTransactionFilter() {
    return this.request('eth_newPendingTransactionFilter');
  }

  async ethGetFilterChanges(filterId) {
    return this.request('eth_getFilterChanges', [filterId]);
  }

  async ethGetFilterLogs(filterId) {
    return this.request('eth_getFilterLogs', [filterId]);
  }

  async ethUninstallFilter(filterId) {
    return this.request('eth_uninstallFilter', [filterId]);
  }

  async ethSubscribe(subscriptionType, filter) {
    const params = filter ? [subscriptionType, filter] : [subscriptionType];
    return this.request('eth_subscribe', params);
  }

  async ethUnsubscribe(subscriptionId) {
    return this.request('eth_unsubscribe', [subscriptionId]);
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  async web3ClientVersion() {
    return this.request('web3_clientVersion');
  }

  async web3Sha3(data) {
    return this.request('web3_sha3', [data]);
  }

  async netVersion() {
    return this.request('net_version');
  }

  async netListening() {
    return this.request('net_listening');
  }

  async netPeerCount() {
    return this.request('net_peerCount');
  }
}

// Export singleton instance
const provider = new EthereumProvider();

export { EthereumProvider, provider };
