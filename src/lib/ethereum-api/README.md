# Ethereum MCP Integration for LangChain

This module integrates the Ethereum MCP (Model Context Protocol) server with the LangChain chatbot, allowing the AI agent to interact with Ethereum blockchain and wallets.

## Architecture

```
┌─────────────────────┐
│   LangChain Agent   │
│   (Chatbot)         │
└──────────┬──────────┘
           │
           │ Uses tools
           ▼
┌─────────────────────┐
│ langchain-tools.ts  │
│ (Tool Converter)    │
└──────────┬──────────┘
           │
           │ Calls
           ▼
┌─────────────────────┐
│   mcp-client.ts     │
│   (MCP Client)      │
└──────────┬──────────┘
           │
           │ HTTP Requests
           ▼
┌─────────────────────┐
│   MCP Server        │
│   (port 3000)       │
└──────────┬──────────┘
           │
           │ JSON-RPC
           ▼
┌─────────────────────┐
│  Ethereum Network   │
│  (via RPC)          │
└─────────────────────┘
```

## Files

- **mcp-server/**: The Ethereum MCP server
  - `src/index.js`: Main server entry point with 49 Ethereum tools
  - `src/tools-config.js`: Configuration for all tools
  - `src/http-client.js`: HTTP client for making requests

- **mcp-client.ts**: Client to connect to MCP server from Node.js
- **langchain-tools.ts**: Converts MCP tools to LangChain-compatible tools
- **README.md**: This file

## Setup

### 1. Start the MCP Server

```bash
cd src/lib/ethereum-api/mcp-server
npm install
npm start
```

The server will start on `http://localhost:3000` with:
- Inspector UI: `http://localhost:3000/inspector`
- MCP endpoint: `http://localhost:3000/mcp`

### 2. Configure Environment Variables

Create a `.env` file in the project root directory:

```env
# Blockchain RPC Endpoints
ETHEREUM_RPC_URL=https://rpc.ankr.com/multichain/YOUR_API_KEY
POLYGON_RPC_URL=https://rpc.ankr.com/polygon/YOUR_API_KEY (optional)
OPTIMISM_RPC_URL=https://rpc.ankr.com/optimism/YOUR_API_KEY (optional)
ARBITRUM_RPC_URL=https://rpc.ankr.com/arbitrum/YOUR_API_KEY (optional)
```

**Getting an Ankr API Key:**
1. Visit [https://www.ankr.com/rpc/](https://www.ankr.com/rpc/)
2. Sign up for a free account
3. Copy your RPC endpoint URL
4. Add it to your `.env` file

The Ethereum tools will use these RPC endpoints to interact with the blockchain. If not specified, they will fall back to public RPC endpoints (which may have rate limits).

For the MCP server, create a `.env` file in the `mcp-server` directory:

```env
PORT=3000
API_BASE_URL=http://localhost:3000/api/v1
NODE_ENV=development
```

### 3. Verify Tools Are Loaded

The tools are automatically loaded when the chatbot starts. You can verify by checking the console logs when the app starts.

## Usage

### Available Tools

The integration provides 49 Ethereum tools organized into categories:

#### Wallet Operations
- `ethRequestAccounts` - Request access to user accounts
- `ethAccounts` - Get connected accounts
- `ethSendTransaction` - Send transactions
- `personalSign` - Sign messages
- `ethSignTypedDataV4` - Sign structured data (EIP-712)
- `walletSwitchEthereumChain` - Switch networks
- `walletAddEthereumChain` - Add new networks

#### Blockchain Queries
- `ethGetBalance` - Get ETH balance
- `ethChainId` - Get current chain ID
- `ethBlockNumber` - Get latest block number
- `ethGasPrice` - Get current gas price
- `ethGetTransactionByHash` - Get transaction details
- `ethGetTransactionReceipt` - Get transaction receipt
- `ethGetBlockByNumber` - Get block details
- `ethGetLogs` - Query event logs

#### Smart Contract Interaction
- `ethCall` - Call contract functions (read-only)
- `ethEstimateGas` - Estimate gas for transactions
- `ethGetCode` - Get contract bytecode
- `ethGetStorageAt` - Read contract storage

### Example Queries

Users can now ask the chatbot Ethereum-related questions:

```
"What's the ETH balance of 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?"

"Send 0.1 ETH to 0x123..."

"What's the current gas price?"

"Get the transaction details for hash 0xabc..."

"Switch to Polygon network"

"Sign this message: Hello Ethereum"
```

### Customizing Available Tools

You can choose which tools to expose to the agent:

```typescript
// In agent-tools.js

// Option 1: Use all tools
import { generateEthereumTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateEthereumTools();

// Option 2: Use common tools only (default)
import { generateCommonEthereumTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateCommonEthereumTools();

// Option 3: Use wallet-specific tools only
import { generateWalletTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateWalletTools();

// Option 4: Use blockchain query tools only
import { generateBlockchainQueryTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateBlockchainQueryTools();
```

## How It Works

1. **User sends a message** to the chatbot
2. **LangChain agent** analyzes the message and determines if Ethereum tools are needed
3. **Tool converter** (`langchain-tools.ts`) provides the tool interface to LangChain
4. **MCP client** (`mcp-client.ts`) makes HTTP requests to the MCP server
5. **MCP server** processes the request and interacts with Ethereum
6. **Response** flows back through the stack to the user

## Tool Schema Example

Each tool is automatically converted to LangChain format with proper schemas:

```javascript
{
  name: "ethGetBalance",
  description: "Get Balance. Use this to check the ETH balance of an address",
  schema: z.object({
    address: z.string().describe('Ethereum address (0x...)'),
    block: z.string().optional().describe('Block number or "latest"')
  }),
  func: async (params) => {
    // Calls MCP server
    const result = await mcpClient.callTool('ethGetBalance', params);
    return result.data;
  }
}
```

## Development

### Adding New Tools

1. Update the MCP server in `mcp-server/src/index.js`
2. Add tool configuration in `mcp-server/src/tools-config.js`
3. The tools will automatically be available to LangChain

### Debugging

Enable debug logging:

```javascript
// In mcp-client.ts
console.log('Calling tool:', toolName, 'with params:', params);
```

Check MCP server logs:
```bash
cd mcp-server
npm run dev  # Runs with nodemon for auto-reload
```

## Security Considerations

- The MCP server should only be accessible from localhost in production
- API keys should be stored securely in environment variables
- User transactions require explicit approval through wallet
- Never expose private keys or mnemonics

## Troubleshooting

### MCP Server Not Running
```bash
# Check if server is running
curl http://localhost:3000/inspector

# Restart server
cd mcp-server && npm start
```

### Tools Not Loading
```javascript
// Check tools are imported correctly
import { generateCommonEthereumTools } from '../../ethereum-api/langchain-tools';
const tools = generateCommonEthereumTools();
console.log('Loaded tools:', tools.map(t => t.name));
```

### Connection Errors
- Verify MCP server URL in `mcp-client.ts`
- Check firewall settings
- Ensure port 3000 is available

## References

- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [LangChain Tools Documentation](https://js.langchain.com/docs/modules/agents/tools/)
- [Ethereum JSON-RPC API](https://ethereum.org/en/developers/docs/apis/json-rpc/)
