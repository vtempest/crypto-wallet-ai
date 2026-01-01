# api-mcp-server

MCP server auto-generated from OpenAPI specification using the [mcp-use](https://mcp-use.com) framework.

## Features

- 🛠️ **49 API Tools** - All operations from the OpenAPI spec
- 🔍 **Built-in Inspector** - Test tools at `/inspector`
- 📡 **Streamable HTTP** - Modern MCP transport
- 🔐 **Authentication Support** - Bearer tokens & custom headers
- 🎨 **UI Widgets** - Compatible with ChatGPT and MCP-UI

## Quick Start

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API credentials

# Start the server
npm start

# Or with hot reload
npm run dev
```

Then open http://localhost:3000/inspector to test your tools!

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment (development/production) | development |
| `API_BASE_URL` | Base URL for API requests | http://localhost:3000/api/v1 |
| `API_KEY` | Bearer token for Authorization header | - |
| `API_AUTH_HEADER` | Custom auth header (format: `Header:value`) | - |
| `MCP_URL` | Public MCP server URL (for widgets) | http://localhost:3000 |
| `ALLOWED_ORIGINS` | Allowed origins in production (comma-separated) | - |

## Connect to Claude Desktop

Add to your Claude Desktop configuration:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "api-mcp-server": {
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## Connect to ChatGPT

This server supports the OpenAI Apps SDK. Configure your ChatGPT integration to use:

```
http://localhost:3000/mcp
```

## Available Tools

| Tool | Method | Path | Description |
|------|--------|------|-------------|
| `walletAddEthereumChain` | POST | /wallet/addEthereumChain | Add Ethereum Chain |
| `walletSwitchEthereumChain` | POST | /wallet/switchEthereumChain | Switch Ethereum Chain |
| `walletWatchAsset` | POST | /wallet/watchAsset | Watch Asset |
| `walletRequestPermissions` | POST | /wallet/requestPermissions | Request Permissions |
| `walletGetPermissions` | GET | /wallet/getPermissions | Get Permissions |
| `walletRevokePermissions` | POST | /wallet/revokePermissions | Revoke Permissions |
| `walletSendCalls` | POST | /wallet/sendCalls | Send Batched Calls |
| `walletGetCallsStatus` | POST | /wallet/getCallsStatus | Get Calls Status |
| `walletGetCapabilities` | GET | /wallet/getCapabilities | Get Wallet Capabilities |
| `ethRequestAccounts` | POST | /eth/requestAccounts | Request Accounts |
| `ethAccounts` | GET | /eth/accounts | Get Accounts |
| `ethSendTransaction` | POST | /eth/sendTransaction | Send Transaction |
| `ethSendRawTransaction` | POST | /eth/sendRawTransaction | Send Raw Transaction |
| `ethGetTransactionByHash` | GET | /eth/getTransactionByHash | Get Transaction by Hash |
| `ethGetTransactionReceipt` | GET | /eth/getTransactionReceipt | Get Transaction Receipt |
| `ethGetTransactionCount` | GET | /eth/getTransactionCount | Get Transaction Count |
| `ethEstimateGas` | POST | /eth/estimateGas | Estimate Gas |
| `personalSign` | POST | /eth/personalSign | Personal Sign |
| `ethSignTypedDataV4` | POST | /eth/signTypedDataV4 | Sign Typed Data V4 |
| `ethDecrypt` | POST | /eth/decrypt | Decrypt (Deprecated) |
| `ethGetEncryptionPublicKey` | POST | /eth/getEncryptionPublicKey | Get Encryption Public Key (Deprecated) |
| `ethChainId` | GET | /eth/chainId | Get Chain ID |
| `ethBlockNumber` | GET | /eth/blockNumber | Get Block Number |
| `ethSyncing` | GET | /eth/syncing | Get Syncing Status |
| `ethCoinbase` | GET | /eth/coinbase | Get Coinbase |
| `ethGasPrice` | GET | /eth/gasPrice | Get Gas Price |
| `ethFeeHistory` | GET | /eth/feeHistory | Get Fee History |
| `ethGetBlockByHash` | GET | /eth/getBlockByHash | Get Block by Hash |
| `ethGetBlockByNumber` | GET | /eth/getBlockByNumber | Get Block by Number |
| `ethGetBlockTransactionCountByHash` | GET | /eth/getBlockTransactionCountByHash | Get Block Transaction Count by Hash |
| `ethGetBlockTransactionCountByNumber` | GET | /eth/getBlockTransactionCountByNumber | Get Block Transaction Count by Number |
| `ethGetUncleCountByBlockHash` | GET | /eth/getUncleCountByBlockHash | Get Uncle Count by Block Hash |
| `ethGetUncleCountByBlockNumber` | GET | /eth/getUncleCountByBlockNumber | Get Uncle Count by Block Number |
| `ethGetBalance` | GET | /eth/getBalance | Get Balance |
| `ethGetStorageAt` | GET | /eth/getStorageAt | Get Storage At |
| `ethGetCode` | GET | /eth/getCode | Get Code |
| `ethGetProof` | GET | /eth/getProof | Get Proof |
| `ethCall` | POST | /eth/call | Call |
| `ethGetLogs` | POST | /eth/getLogs | Get Logs |
| `ethNewFilter` | POST | /eth/newFilter | New Filter |
| `ethNewBlockFilter` | POST | /eth/newBlockFilter | New Block Filter |
| `ethNewPendingTransactionFilter` | POST | /eth/newPendingTransactionFilter | New Pending Transaction Filter |
| `ethGetFilterChanges` | GET | /eth/getFilterChanges | Get Filter Changes |
| `ethGetFilterLogs` | GET | /eth/getFilterLogs | Get Filter Logs |
| `ethUninstallFilter` | DELETE | /eth/uninstallFilter | Uninstall Filter |
| `ethSubscribe` | POST | /eth/subscribe | Subscribe |
| `ethUnsubscribe` | POST | /eth/unsubscribe | Unsubscribe |
| `web3ClientVersion` | GET | /web3/clientVersion | Get Client Version |
| `jsonRpc` | POST | /jsonrpc | Generic JSON-RPC |

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /inspector` | Interactive tool testing UI |
| `POST /mcp` | MCP protocol endpoint |
| `GET /sse` | Server-Sent Events endpoint |
| `GET /health` | Health check endpoint |

## Project Structure

```
api-mcp-server/
├── .env              # Environment configuration
├── .env.example      # Example environment file
├── package.json      # Dependencies
├── README.md         # This file
└── src/
    ├── index.js        # Main server with MCP tool registrations
    ├── http-client.js  # HTTP utilities for API calls
    └── tools-config.js # Tool configurations from OpenAPI spec
```

## How It Works

Each tool is registered using the proper MCP format:

```javascript
server.tool(
  {
    name: 'getPetById',
    description: 'Find pet by ID',
    schema: z.object({
      petId: z.number().int().describe('ID of pet to return'),
    }),
  },
  async (params) => {
    // Fetch data from the API
    const result = await executeRequest(toolConfig, params, apiConfig);

    // Return MCP content (text or object)
    return result.ok ? object(result.data) : text(`Error: ${result.status}`);
  }
);
```

## Production Deployment

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "start"]
```

### PM2

```bash
pm2 start src/index.js --name api-mcp-server
```

## Source

- **OpenAPI Spec**: `ethereum-openapi.yaml`
- **Generated**: 2026-01-01T20:46:53.473Z
- **Framework**: [mcp-use](https://mcp-use.com)

## License

MIT
