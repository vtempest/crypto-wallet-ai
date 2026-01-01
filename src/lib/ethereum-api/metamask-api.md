
[Metamask JSON-RPC API DOCS](https://docs.metamask.io/wallet/concepts/wallet-api#json-rpc-api)

## How to Access the MetaMask API

MetaMask injects a global JavaScript object `window.ethereum` into web pages. You can make API calls using the `request()` method:

```javascript
// Basic pattern for all API calls
const result = await window.ethereum.request({
  method: 'method_name',
  params: [/* parameters */]
});
```

For **EIP-6963 compliant** detection (recommended for multi-wallet support), you can use the provider object discovered through `window.dispatchEvent`.

---

## Complete List of JSON-RPC Methods

### **Wallet Methods** (MetaMask-specific)

| Method | Description |
|--------|-------------|
| `wallet_addEthereumChain` | Add a new network to MetaMask |
| `wallet_switchEthereumChain` | Switch to a different network |
| `wallet_watchAsset` | Prompt user to track a token |
| `wallet_requestPermissions` | Request permissions from user |
| `wallet_getPermissions` | Get current permissions |
| `wallet_revokePermissions` | Revoke granted permissions |
| `wallet_registerOnboarding` | Register dapp for onboarding |
| `wallet_scanQRCode` | Scan QR code (mobile only) |
| `wallet_sendCalls` | Send batched calls |
| `wallet_getCallsStatus` | Get status of batched calls |
| `wallet_getCapabilities` | Get wallet capabilities |

### **Account & Transaction Methods**

| Method | Description |
|--------|-------------|
| `eth_requestAccounts` | **Request user to connect accounts** (restricted) |
| `eth_accounts` | Get list of connected accounts |
| `eth_sendTransaction` | Send a transaction |
| `eth_sendRawTransaction` | Send a signed raw transaction |
| `eth_getTransactionByHash` | Get transaction by hash |
| `eth_getTransactionReceipt` | Get transaction receipt |
| `eth_getTransactionCount` | Get account nonce |
| `eth_getTransactionByBlockHashAndIndex` | Get transaction by block hash and index |
| `eth_getTransactionByBlockNumberAndIndex` | Get transaction by block number and index |
| `eth_estimateGas` | Estimate gas for a transaction |

### **Signing Methods**

| Method | Description |
|--------|-------------|
| `personal_sign` | Sign a message |
| `eth_signTypedData_v4` | Sign typed structured data (EIP-712) |
| `eth_decrypt` | Decrypt encrypted data (deprecated) |
| `eth_getEncryptionPublicKey` | Get encryption public key (deprecated) |

### **Chain & Network Methods**

| Method | Description |
|--------|-------------|
| `eth_chainId` | Get current chain ID |
| `eth_blockNumber` | Get latest block number |
| `eth_syncing` | Check sync status |
| `eth_coinbase` | Get coinbase address |
| `eth_gasPrice` | Get current gas price |
| `eth_feeHistory` | Get fee history |

### **Block Methods**

| Method | Description |
|--------|-------------|
| `eth_getBlockByHash` | Get block by hash |
| `eth_getBlockByNumber` | Get block by number |
| `eth_getBlockTransactionCountByHash` | Get block tx count by hash |
| `eth_getBlockTransactionCountByNumber` | Get block tx count by number |
| `eth_getUncleCountByBlockHash` | Get uncle count by block hash |
| `eth_getUncleCountByBlockNumber` | Get uncle count by block number |

### **State Methods**

| Method | Description |
|--------|-------------|
| `eth_getBalance` | Get account balance |
| `eth_getStorageAt` | Get storage at position |
| `eth_getCode` | Get contract bytecode |
| `eth_getProof` | Get account/storage proof |
| `eth_call` | Execute read-only call |
| `eth_getLogs` | Get event logs |

### **Filter Methods**

| Method | Description |
|--------|-------------|
| `eth_newFilter` | Create new event filter |
| `eth_newBlockFilter` | Create block filter |
| `eth_newPendingTransactionFilter` | Create pending tx filter |
| `eth_getFilterChanges` | Get filter updates |
| `eth_getFilterLogs` | Get all filter logs |
| `eth_uninstallFilter` | Remove a filter |

### **Subscription Methods**

| Method | Description |
|--------|-------------|
| `eth_subscribe` | Subscribe to events |
| `eth_unsubscribe` | Unsubscribe from events |

### **Utility Methods**

| Method | Description |
|--------|-------------|
| `web3_clientVersion` | Get client version |

---

## Provider Events

Listen to these events on the provider:

```javascript
// Account changes
window.ethereum.on('accountsChanged', (accounts) => { /* handle */ });

// Network/chain changes
window.ethereum.on('chainChanged', (chainId) => { /* handle */ });

// Connection established
window.ethereum.on('connect', (connectInfo) => { /* handle */ });

// Disconnection
window.ethereum.on('disconnect', (error) => { /* handle */ });

// Messages (e.g., subscription updates)
window.ethereum.on('message', (message) => { /* handle */ });
```

---

## Common Usage Examples

```javascript
// Connect to MetaMask
const accounts = await window.ethereum.request({ 
  method: 'eth_requestAccounts' 
});

// Get current chain
const chainId = await window.ethereum.request({ 
  method: 'eth_chainId' 
});

// Send transaction
const txHash = await window.ethereum.request({
  method: 'eth_sendTransaction',
  params: [{
    from: '0x...', 
    to: '0x...', 
    value: '0x...'
  }]
});

// Sign a message
const signature = await window.ethereum.request({
  method: 'personal_sign',
  params: ['Hello World', '0xYourAddress']
});
```

For the full interactive reference, visit the [MetaMask JSON-RPC API documentation](https://docs.metamask.io/wallet/reference/json-rpc-methods/).