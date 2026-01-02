# Ethereum MCP Tools Integration with LangChain Chatbot

## Overview

This integration connects the Ethereum MCP (Model Context Protocol) server tools with the LangChain-powered chatbot, enabling the AI assistant to interact with Ethereum blockchain and perform wallet operations.

## Architecture

### Components

1. **MCP Server Tools** (`src/lib/ethereum-api/mcp-server/`)
   - Provides 46+ Ethereum JSON-RPC methods as MCP tools
   - Includes wallet operations, blockchain queries, and transaction management

2. **MCP Client** (`src/lib/ethereum-api/mcp-client.ts`)
   - HTTP client for calling MCP server tools
   - Handles request/response formatting and error handling

3. **LangChain Tool Adapters** (`src/lib/ethereum-api/langchain-tools.ts`)
   - Converts MCP tools into LangChain `DynamicStructuredTool` instances
   - Provides typed schemas using Zod for parameter validation
   - Includes helper functions for different tool categories

4. **Enhanced MetaSearchAgent** (`src/lib/research/search/metaSearchAgent.ts`)
   - Updated to support LangChain tools via agent executors
   - Uses `createToolCallingAgent` from `@langchain/classic/agents`
   - Streams tool execution events to the UI

5. **Ethereum Wallet Focus Mode** (`src/lib/research/search/index.ts`)
   - New focus mode: `ethereumWallet`
   - Pre-configured with common Ethereum tools
   - Specialized prompt for crypto wallet operations

## Features

### Available Ethereum Operations

The chatbot can now:

- **Account Management**
  - Request and list user accounts
  - Check ETH balances
  - Manage wallet permissions

- **Transactions**
  - Send ETH transactions
  - Estimate gas costs
  - Get transaction details and receipts
  - Track transaction status

- **Network Operations**
  - Get current chain ID
  - Switch between Ethereum networks
  - Add custom networks

- **Signing**
  - Sign messages (personal_sign)
  - Sign typed data (EIP-712)

- **Blockchain Queries**
  - Get block information
  - Query transaction history
  - Read smart contract data
  - Get event logs

- **Smart Contracts**
  - Call contract functions (read-only)
  - Get contract bytecode
  - Query storage slots

## Tool Categories

### 1. Common Ethereum Tools (13 tools)
Used by default in the `ethereumWallet` focus mode:
- ethRequestAccounts
- ethAccounts
- ethGetBalance
- ethSendTransaction
- ethGetTransactionByHash
- ethGetTransactionReceipt
- ethChainId
- ethBlockNumber
- ethGasPrice
- ethEstimateGas
- personalSign
- walletSwitchEthereumChain
- ethCall

### 2. Wallet Tools (10 tools)
For wallet-specific operations:
```typescript
import { generateWalletTools } from '@/lib/ethereum-api/langchain-tools';
const walletTools = generateWalletTools();
```

### 3. Blockchain Query Tools (12 tools)
For reading blockchain data:
```typescript
import { generateBlockchainQueryTools } from '@/lib/ethereum-api/langchain-tools';
const queryTools = generateBlockchainQueryTools();
```

### 4. All Tools (46 tools)
Complete set of all available Ethereum operations:
```typescript
import { generateEthereumTools } from '@/lib/ethereum-api/langchain-tools';
const allTools = generateEthereumTools();
```

## Usage

### Using the Ethereum Wallet Focus Mode

1. Start a chat session
2. Select **"Ethereum Wallet"** as the focus mode
3. Ask questions or request operations:

**Examples:**
```
"What's my ETH balance?"
"Send 0.1 ETH to 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb"
"What's the current gas price?"
"Get details for transaction 0x123..."
"Switch to Polygon network"
"Sign this message: Hello, Ethereum!"
```

### Security Features

The AI assistant:
- ✅ Explains operations before executing them
- ✅ Shows transaction details (amount, recipient, gas)
- ✅ Asks for user confirmation on sensitive operations
- ✅ Provides clear error messages
- ✅ Estimates costs before sending transactions

## Implementation Details

### Tool Schema Generation

Each MCP tool is converted to a LangChain tool with proper type validation:

```typescript
// Example: ethGetBalance tool
{
  name: "ethGetBalance",
  description: "Get Balance. Use this to check the ETH balance of an address",
  schema: z.object({
    address: z.string().describe("Ethereum address (0x...)"),
    block: z.string().optional().describe("Block number or 'latest'")
  }),
  func: async (params) => {
    // Calls MCP server via HTTP
    const result = await mcpClient.callTool("ethGetBalance", params);
    return JSON.stringify(result.data);
  }
}
```

### Agent Executor Flow

When tools are available:

1. User sends message → `ethereumWallet` handler
2. MetaSearchAgent creates `AgentExecutor` with tools
3. LLM decides which tools to call based on user intent
4. Tools are executed via MCP client
5. Results are streamed back to user
6. LLM formats final response with tool results

### Event Streaming

The integration streams the following events to the UI:

- `on_chat_model_stream`: AI response text
- `on_tool_start`: Tool execution notification
- `on_tool_end`: Tool result
- `on_chain_end`: Completion

## Configuration

### MCP Server URL

Configure the MCP server URL in the MCP client:

```typescript
// src/lib/ethereum-api/mcp-client.ts
const client = new EthereumMCPClient({
  serverUrl: process.env.ETHEREUM_MCP_URL || 'http://localhost:3000'
});
```

### Custom Tool Selection

To use a different set of tools:

```typescript
// src/lib/research/search/index.ts
import { generateWalletTools } from '@/lib/ethereum-api/langchain-tools';

ethereumWallet: new MetaSearchAgent({
  // ... other config
  tools: generateWalletTools(), // Use only wallet tools
})
```

## Error Handling

The integration handles errors at multiple levels:

1. **MCP Client**: Network and HTTP errors
2. **Tool Execution**: Parameter validation and RPC errors
3. **Agent**: Tool calling errors and fallbacks
4. **UI**: Friendly error messages to users

## Testing

To test the integration:

1. Start the MCP server:
```bash
cd src/lib/ethereum-api/mcp-server
npm start
```

2. Start the Next.js app:
```bash
npm run dev
```

3. Select "Ethereum Wallet" focus mode
4. Try example queries listed above

## Future Enhancements

Potential improvements:

- [ ] Add transaction simulation before sending
- [ ] Implement batch transaction support
- [ ] Add ENS name resolution
- [ ] Support for ERC-20 token operations
- [ ] NFT (ERC-721/1155) interactions
- [ ] DeFi protocol integrations
- [ ] Multi-chain support (Polygon, Arbitrum, etc.)
- [ ] Transaction history analysis
- [ ] Gas optimization suggestions

## Dependencies

- `@langchain/core`: ^1.1.8
- `@langchain/classic`: ^1.0.7 (via @langchain/community)
- `@langchain/openai`: ^1.2.0
- `zod`: ^4.3.4

## Files Modified

1. `src/lib/research/search/metaSearchAgent.ts` - Added tool support
2. `src/lib/ethereum-api/langchain-tools.ts` - Added DynamicStructuredTool wrappers
3. `src/lib/research/prompts/index.ts` - Added ethereumWalletPrompt
4. `src/lib/research/search/index.ts` - Added ethereumWallet focus mode

## Troubleshooting

### Tools not working
- Ensure MCP server is running on the correct port
- Check `ETHEREUM_MCP_URL` environment variable
- Verify wallet is connected in the browser

### Type errors
- Run `npm install --legacy-peer-deps` for dependency conflicts
- Clear `.next` cache: `rm -rf .next`

### Build errors
- Ensure all imports use `@langchain/classic/agents`
- Check TypeScript compilation: `npm run build`

## License

Same as parent project.
