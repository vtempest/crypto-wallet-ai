# Wallet Chat AI

![logo](public/aiwallet-logo.png)



**Manage your crypto wallet through natural conversations with AI**

Talk to your Crypto wallet using natural language. Ask questions, check balances, send transactions, in a way anyone can understand.

## What is This?

Wallet Chat AI combines:
- 🤖 **AI Chatbot** - Natural language interface powered by LangChain
- 🦊 **Ethereum Integration** - Full MetaMask-compatible wallet operations
- 🔗 **MCP Server** - 49 Ethereum tools exposed via Model Context Protocol
- 💬 **Conversational UX** - Ask questions in plain English instead of using complex CLI commands

### Example Conversations

```
You: "What's my ETH balance?"
AI: *checks your wallet* "Your balance is 2.5 ETH (about $4,250 USD)"

You: "Send 0.1 ETH to vitalik.eth"
AI: *prepares transaction* "I'll send 0.1 ETH to vitalik.eth (0x...). Gas will be about 3 gwei. Confirm?"

You: "What's the current gas price?"
AI: *queries network* "Current gas price is 15 gwei (fast: 20 gwei, slow: 10 gwei)"

You: "Check transaction 0xabc123..."
AI: *looks up transaction* "This transaction sent 1 ETH, confirmed in block 18234567,
     used 21000 gas at 18 gwei"
```

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Configure Environment Variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env

   # Edit .env and add your configuration
   # At minimum, set BETTER_AUTH_SECRET (generate with: openssl rand -base64 32)
   ```

   **Optional - Enable MCP Servers:**
   - To enable Composio (100+ app integrations), add `COMPOSIO_API_KEY` to .env
   - Get your API key at https://composio.dev
   - See [MCP Configuration Guide](MCP_CONFIGURATION.md) for details

3. **Setup Database** (REQUIRED)
   ```bash
   npm run db:push
   ```
   This creates all required tables for authentication and wallet management.

4. **Start the MCP Server** (Optional - for Ethereum tools)
   ```bash
   cd src/lib/ethereum-api/mcp-server
   npm install
   npm start
   ```

5. **Start the Next.js App**
   ```bash
   npm run dev
   ```

6. **Start Chatting!**
   - Open http://localhost:3000
   - Sign in with Google or MetaMask
   - Ask Ethereum questions in natural language
   - The AI automatically uses the right tools

📖 **See [Database Setup Guide](DATABASE_SETUP.md) for database configuration**
📖 **See [MCP Configuration Guide](MCP_CONFIGURATION.md) for enabling external integrations**
📖 **See [Quick Start Guide](src/lib/ethereum-api/QUICKSTART.md) for Ethereum tools setup**

---

## MetaMask Ethereum JSON-RPC API

A comprehensive REST API backend that wraps MetaMask's Ethereum JSON-RPC methods. This project provides both an OpenAPI specification and a Node.js backend implementation with intelligent LangChain integration.

## Features

- 🔗 Full support for standard Ethereum JSON-RPC methods
- 🦊 MetaMask-specific wallet methods
- 📚 OpenAPI 3.0 specification with Swagger UI
- 🚀 Express.js backend with modular routing
- 🔒 Rate limiting and security headers
- 📝 Generic JSON-RPC endpoint for any method
- 🔄 Batch request support

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

```bash
# Clone or download the project
cd metamask-api

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Edit .env with your Ethereum node URL (Infura, Alchemy, etc.)
# ETH_NODE_URL=https://mainnet.infura.io/v3/YOUR_API_KEY

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

### Access the API

- **API Server**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **Available Methods**: http://localhost:3000/api/v1/methods

## API Structure

### Endpoints Overview

| Category | Base Path | Description |
|----------|-----------|-------------|
| Wallet | `/api/v1/wallet` | MetaMask-specific methods |
| Accounts | `/api/v1/eth` | Account and transaction methods |
| Signing | `/api/v1/eth` | Message signing methods |
| Chain | `/api/v1/eth` | Network information |
| Blocks | `/api/v1/eth` | Block queries |
| State | `/api/v1/eth` | Blockchain state |
| Filters | `/api/v1/eth` | Event subscriptions |
| Utility | `/api/v1/web3` | Utility methods |
| JSON-RPC | `/api/v1/jsonrpc` | Generic RPC endpoint |

## Usage Examples

### Using REST Endpoints

```bash
# Get current chain ID
curl http://localhost:3000/api/v1/eth/chainId

# Get latest block number
curl http://localhost:3000/api/v1/eth/blockNumber

# Get account balance
curl "http://localhost:3000/api/v1/eth/getBalance?address=0x742d35Cc6634C0532925a3b844Bc9e7595f5bEb1"

# Get gas price
curl http://localhost:3000/api/v1/eth/gasPrice

# Get block by number
curl "http://localhost:3000/api/v1/eth/getBlockByNumber?blockNumber=latest&fullTransactions=false"

# Send transaction (requires unlocked account)
curl -X POST http://localhost:3000/api/v1/eth/sendTransaction \
  -H "Content-Type: application/json" \
  -d '{
    "from": "0x...",
    "to": "0x...",
    "value": "0xde0b6b3a7640000"
  }'

# Sign a message
curl -X POST http://localhost:3000/api/v1/eth/personalSign \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello, World!",
    "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f5bEb1"
  }'

# Get event logs
curl -X POST http://localhost:3000/api/v1/eth/getLogs \
  -H "Content-Type: application/json" \
  -d '{
    "fromBlock": "0x0",
    "toBlock": "latest",
    "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7"
  }'
```

### Using Generic JSON-RPC Endpoint

```bash
# Call any method through the generic endpoint
curl -X POST http://localhost:3000/api/v1/jsonrpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "eth_getBalance",
    "params": ["0x742d35Cc6634C0532925a3b844Bc9e7595f5bEb1", "latest"],
    "id": 1
  }'

# Batch requests
curl -X POST http://localhost:3000/api/v1/jsonrpc/batch \
  -H "Content-Type: application/json" \
  -d '[
    {"jsonrpc": "2.0", "method": "eth_chainId", "params": [], "id": 1},
    {"jsonrpc": "2.0", "method": "eth_blockNumber", "params": [], "id": 2},
    {"jsonrpc": "2.0", "method": "eth_gasPrice", "params": [], "id": 3}
  ]'
```

### Using in JavaScript/TypeScript

```javascript
// Using fetch
const response = await fetch('http://localhost:3000/api/v1/eth/getBalance?address=0x742d35Cc6634C0532925a3b844Bc9e7595f5bEb1');
const data = await response.json();
console.log('Balance:', data.result);

// Using JSON-RPC
const rpcResponse = await fetch('http://localhost:3000/api/v1/jsonrpc', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: ['0x742d35Cc6634C0532925a3b844Bc9e7595f5bEb1', 'latest'],
    id: 1
  })
});
const rpcData = await rpcResponse.json();
console.log('Balance:', rpcData.result);
```

## Complete Method Reference

### Wallet Methods (MetaMask-specific)

| Method | Endpoint | HTTP |
|--------|----------|------|
| wallet_addEthereumChain | /wallet/addEthereumChain | POST |
| wallet_switchEthereumChain | /wallet/switchEthereumChain | POST |
| wallet_watchAsset | /wallet/watchAsset | POST |
| wallet_requestPermissions | /wallet/requestPermissions | POST |
| wallet_getPermissions | /wallet/getPermissions | GET |
| wallet_revokePermissions | /wallet/revokePermissions | POST |
| wallet_sendCalls | /wallet/sendCalls | POST |
| wallet_getCallsStatus | /wallet/getCallsStatus | POST |
| wallet_getCapabilities | /wallet/getCapabilities | GET |

### Account Methods

| Method | Endpoint | HTTP |
|--------|----------|------|
| eth_requestAccounts | /eth/requestAccounts | POST |
| eth_accounts | /eth/accounts | GET |
| eth_sendTransaction | /eth/sendTransaction | POST |
| eth_sendRawTransaction | /eth/sendRawTransaction | POST |
| eth_getTransactionByHash | /eth/getTransactionByHash | GET |
| eth_getTransactionReceipt | /eth/getTransactionReceipt | GET |
| eth_getTransactionCount | /eth/getTransactionCount | GET |
| eth_estimateGas | /eth/estimateGas | POST |

### Signing Methods

| Method | Endpoint | HTTP |
|--------|----------|------|
| personal_sign | /eth/personalSign | POST |
| eth_signTypedData_v4 | /eth/signTypedDataV4 | POST |
| eth_decrypt | /eth/decrypt | POST |
| eth_getEncryptionPublicKey | /eth/getEncryptionPublicKey | POST |

### Chain Methods

| Method | Endpoint | HTTP |
|--------|----------|------|
| eth_chainId | /eth/chainId | GET |
| eth_blockNumber | /eth/blockNumber | GET |
| eth_syncing | /eth/syncing | GET |
| eth_coinbase | /eth/coinbase | GET |
| eth_gasPrice | /eth/gasPrice | GET |
| eth_feeHistory | /eth/feeHistory | GET |

### Block Methods

| Method | Endpoint | HTTP |
|--------|----------|------|
| eth_getBlockByHash | /eth/getBlockByHash | GET |
| eth_getBlockByNumber | /eth/getBlockByNumber | GET |
| eth_getBlockTransactionCountByHash | /eth/getBlockTransactionCountByHash | GET |
| eth_getBlockTransactionCountByNumber | /eth/getBlockTransactionCountByNumber | GET |
| eth_getUncleCountByBlockHash | /eth/getUncleCountByBlockHash | GET |
| eth_getUncleCountByBlockNumber | /eth/getUncleCountByBlockNumber | GET |

### State Methods

| Method | Endpoint | HTTP |
|--------|----------|------|
| eth_getBalance | /eth/getBalance | GET |
| eth_getStorageAt | /eth/getStorageAt | GET |
| eth_getCode | /eth/getCode | GET |
| eth_getProof | /eth/getProof | GET |
| eth_call | /eth/call | POST |
| eth_getLogs | /eth/getLogs | POST |

### Filter Methods

| Method | Endpoint | HTTP |
|--------|----------|------|
| eth_newFilter | /eth/newFilter | POST |
| eth_newBlockFilter | /eth/newBlockFilter | POST |
| eth_newPendingTransactionFilter | /eth/newPendingTransactionFilter | POST |
| eth_getFilterChanges | /eth/getFilterChanges | GET |
| eth_getFilterLogs | /eth/getFilterLogs | GET |
| eth_uninstallFilter | /eth/uninstallFilter | DELETE |
| eth_subscribe | /eth/subscribe | POST |
| eth_unsubscribe | /eth/unsubscribe | POST |

### Utility Methods

| Method | Endpoint | HTTP |
|--------|----------|------|
| web3_clientVersion | /web3/clientVersion | GET |

## Project Structure

```
metamask-api/
├── openapi.yaml           # OpenAPI 3.0 specification
├── package.json           # Node.js dependencies
├── .env.example           # Environment configuration template
├── README.md              # This file
└── src/
    ├── server.js          # Express server entry point
    ├── services/
    │   └── ethereumProvider.js  # Ethereum JSON-RPC client
    └── routes/
        ├── wallet.js      # Wallet routes
        ├── accounts.js    # Account routes
        ├── signing.js     # Signing routes
        ├── chain.js       # Chain routes
        ├── blocks.js      # Block routes
        ├── state.js       # State routes
        ├── filters.js     # Filter routes
        ├── utility.js     # Utility routes
        └── jsonrpc.js     # Generic JSON-RPC endpoint
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| NODE_ENV | Environment (development/production) | development |
| ETH_NODE_URL | Ethereum node RPC URL | https://eth.llamarpc.com |
| CORS_ORIGIN | CORS allowed origins | * |
| DEFAULT_ACCOUNTS | Comma-separated account addresses | - |

### Supported Ethereum Nodes

- **Infura**: `https://mainnet.infura.io/v3/YOUR_API_KEY`
- **Alchemy**: `https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY`
- **QuickNode**: `https://YOUR_ENDPOINT.quiknode.pro/YOUR_TOKEN/`
- **Local Geth/Erigon**: `http://localhost:8545`
- **Public Endpoints**: `https://eth.llamarpc.com`

## Error Handling

All errors follow the JSON-RPC error format:

```json
{
  "error": {
    "code": -32602,
    "message": "Invalid params",
    "data": {}
  }
}
```

### Common Error Codes

| Code | Message | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON |
| -32600 | Invalid Request | Invalid JSON-RPC request |
| -32601 | Method not found | Method does not exist |
| -32602 | Invalid params | Invalid method parameters |
| -32603 | Internal error | Internal JSON-RPC error |
| -32000 | Server error | Node connection error |
| 4001 | User rejected | User rejected the request |
| 4902 | Chain not added | Requested chain not added |

## Browser Integration

For browser-based dapps, use MetaMask directly:

```javascript
// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
  // Request accounts
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts'
  });
  
  // Send transaction
  const txHash = await window.ethereum.request({
    method: 'eth_sendTransaction',
    params: [{
      from: accounts[0],
      to: '0x...',
      value: '0xde0b6b3a7640000'
    }]
  });
}
```
