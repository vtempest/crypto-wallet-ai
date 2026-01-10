# LangChain MCP Integration Guide

Complete guide for using LangChain MCP adapters with the Ethereum MCP server (mcp-use).

## Overview

This project integrates **LangChain MCP adapters** with the **mcp-use** Ethereum server, providing 49 Ethereum tools that can be used with LangChain agents.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LangChain Agent                              │
│  (ChatOpenAI, Anthropic, etc.)                                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│         LangChain MCP Adapters (@langchain/mcp-adapters)        │
│                   MultiServerMCPClient                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ SSE/HTTP Transport
┌──────────────────────────▼──────────────────────────────────────┐
│              Ethereum MCP Server (mcp-use)                      │
│  - 49 Ethereum tools                                            │
│  - HTTP/SSE endpoints                                           │
│  - Inspector UI                                                 │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│               Ethereum JSON-RPC Provider                        │
│  (via ethers.js or web3.js)                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Installation

All required dependencies are already installed:

```json
{
  "@langchain/mcp-adapters": "^1.1.1",
  "@langchain/langgraph": "^1.0.7",
  "@langchain/core": "^1.1.8",
  "@langchain/openai": "^1.2.0",
  "langchain": "^1.2.3",
  "mcp-use": "^1.11.2"
}
```

## Quick Start

### 1. Start the Ethereum MCP Server

```bash
# Start the mcp-use server
cd src/lib/ethereum-api/mcp-server
node src/index.js

# Server will start at:
# - MCP endpoint: http://localhost:3000/mcp
# - SSE endpoint: http://localhost:3000/sse
# - Inspector UI: http://localhost:3000/inspector
```

### 2. Use with LangChain (Basic Example)

```typescript
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

async function main() {
  // Initialize the LLM
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
  });

  // Configure MCP client to connect to Ethereum server
  const client = new MultiServerMCPClient({
    mcpServers: {
      ethereum: {
        transport: 'sse',
        url: 'http://localhost:3000/sse',
        headers: {
          'Accept': 'text/event-stream',
        },
        reconnect: {
          enabled: true,
          maxAttempts: 3,
          delayMs: 2000,
        },
      },
    },
    defaultToolTimeout: 30000, // 30 seconds for Ethereum operations
    useStandardContentBlocks: true,
  });

  // Get all tools from the Ethereum MCP server
  const tools = await client.getTools();
  console.log(`Loaded ${tools.length} Ethereum tools`);

  // Create LangChain agent with the tools
  const agent = createReactAgent({
    llm: model,
    tools: tools,
  });

  // Use the agent
  const result = await agent.invoke({
    messages: [
      {
        role: 'user',
        content: 'What is the current block number on Ethereum?',
      },
    ],
  });

  console.log(result.messages[result.messages.length - 1].content);

  // Cleanup
  await client.close();
}

main().catch(console.error);
```

### 3. Use with Existing MCP Infrastructure

The Ethereum MCP server is already integrated with the existing MCP infrastructure:

```typescript
import { getEnabledMCPServers } from '@/lib/config/serverRegistry';
import { loadMCPServerTools } from '@/lib/mcpservers/toolLoader';

// Load all enabled MCP server tools (including Ethereum)
const tools = await loadMCPServerTools();

// Or load specific server tools
const ethereumTools = await getToolsFromMCPServer('ethereum');
```

## Available Ethereum Tools (49 total)

### Wallet Operations (9 tools)
- `walletAddEthereumChain` - Add a new Ethereum chain
- `walletSwitchEthereumChain` - Switch to a different chain
- `walletWatchAsset` - Add a token to watch list
- `walletRequestPermissions` - Request wallet permissions
- `walletGetPermissions` - Get current permissions
- `walletRevokePermissions` - Revoke permissions
- `walletSendCalls` - Send batched calls (EIP-5792)
- `walletGetCallsStatus` - Get status of batched calls
- `walletGetCapabilities` - Get wallet capabilities

### Account Operations (2 tools)
- `ethRequestAccounts` - Request account access
- `ethAccounts` - Get available accounts

### Transaction Operations (5 tools)
- `ethSendTransaction` - Send a transaction
- `ethSendRawTransaction` - Send a raw signed transaction
- `ethGetTransactionByHash` - Get transaction details
- `ethGetTransactionReceipt` - Get transaction receipt
- `ethGetTransactionCount` - Get nonce for an address

### Signing Operations (4 tools)
- `personalSign` - Personal message signing
- `ethSignTypedDataV4` - Typed data signing (EIP-712)
- `ethDecrypt` - Decrypt message (deprecated)
- `ethGetEncryptionPublicKey` - Get encryption public key (deprecated)

### State Queries (6 tools)
- `ethGetBalance` - Get ETH balance
- `ethGetCode` - Get contract bytecode
- `ethGetStorageAt` - Get storage slot value
- `ethGetProof` - Get Merkle proof
- `ethCall` - Execute a read-only call
- `ethEstimateGas` - Estimate gas for a transaction

### Block Queries (9 tools)
- `ethBlockNumber` - Get latest block number
- `ethGetBlockByHash` - Get block by hash
- `ethGetBlockByNumber` - Get block by number
- `ethGetBlockTransactionCountByHash` - Get transaction count in block
- `ethGetBlockTransactionCountByNumber` - Get transaction count in block
- `ethGetUncleCountByBlockHash` - Get uncle count
- `ethGetUncleCountByBlockNumber` - Get uncle count
- `ethFeeHistory` - Get historical gas fees
- `ethSyncing` - Get sync status

### Network Info (4 tools)
- `ethChainId` - Get current chain ID
- `ethCoinbase` - Get coinbase address
- `ethGasPrice` - Get current gas price
- `web3ClientVersion` - Get client version

### Filters & Subscriptions (7 tools)
- `ethNewFilter` - Create a new filter
- `ethNewBlockFilter` - Create block filter
- `ethNewPendingTransactionFilter` - Create pending tx filter
- `ethGetFilterChanges` - Get filter changes
- `ethGetFilterLogs` - Get filter logs
- `ethUninstallFilter` - Remove a filter
- `ethGetLogs` - Get logs matching filter

### Subscriptions (2 tools)
- `ethSubscribe` - Subscribe to events
- `ethUnsubscribe` - Unsubscribe from events

### Generic RPC (1 tool)
- `jsonRpc` - Execute any JSON-RPC method

## Advanced Usage Examples

### Example 1: Check Wallet Balance

```typescript
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

const model = new ChatAnthropic({
  model: 'claude-3-5-sonnet-20241022',
});

const client = new MultiServerMCPClient({
  mcpServers: {
    ethereum: {
      transport: 'sse',
      url: 'http://localhost:3000/sse',
    },
  },
});

const tools = await client.getTools();
const agent = createReactAgent({ llm: model, tools });

const result = await agent.invoke({
  messages: [
    {
      role: 'user',
      content: 'What is the ETH balance of 0x742d35Cc6634C0532925a3b844Bc454e4438f44e?',
    },
  ],
});

console.log(result.messages[result.messages.length - 1].content);
```

### Example 2: Send Transaction with Gas Estimation

```typescript
const result = await agent.invoke({
  messages: [
    {
      role: 'user',
      content: `Estimate gas for sending 0.1 ETH from 0x123... to 0x456...
                and then send the transaction if gas is below 21000.`,
    },
  ],
});
```

### Example 3: Custom LangGraph Workflow

```typescript
import { StateGraph, MessagesAnnotation, START } from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';

const workflow = new StateGraph(MessagesAnnotation)
  .addNode('agent', async (state) => {
    const response = await model.bindTools(tools).invoke(state.messages);
    return { messages: [response] };
  })
  .addNode('tools', new ToolNode(tools))
  .addEdge(START, 'agent')
  .addConditionalEdges('agent', (state) => {
    const lastMessage = state.messages[state.messages.length - 1];
    if ('tool_calls' in lastMessage && lastMessage.tool_calls?.length) {
      return 'tools';
    }
    return '__end__';
  })
  .addEdge('tools', 'agent');

const app = workflow.compile();

const result = await app.invoke({
  messages: [
    {
      role: 'user',
      content: 'Get the latest block number and check the gas price',
    },
  ],
});
```

### Example 4: Using with Different Transports

#### SSE Transport (Recommended)
```typescript
const client = new MultiServerMCPClient({
  mcpServers: {
    ethereum: {
      transport: 'sse',
      url: 'http://localhost:3000/sse',
    },
  },
});
```

#### HTTP Transport
```typescript
const client = new MultiServerMCPClient({
  mcpServers: {
    ethereum: {
      transport: 'http',
      url: 'http://localhost:3000/mcp',
    },
  },
});
```

### Example 5: Tool Hooks (Before/After)

```typescript
const client = new MultiServerMCPClient({
  mcpServers: {
    ethereum: {
      transport: 'sse',
      url: 'http://localhost:3000/sse',
    },
  },
  // Log before tool execution
  beforeToolCall: ({ serverName, name, args }) => {
    console.log(`🔧 Calling ${name} on ${serverName}`, args);
    return {
      args: { ...args, timestamp: Date.now() },
      headers: { 'X-Request-ID': crypto.randomUUID() },
    };
  },
  // Log after tool execution
  afterToolCall: (res) => {
    console.log(`✅ Tool ${res.name} completed`);
    return res;
  },
});
```

## Configuration

### Environment Variables

Create a `.env` file with:

```bash
# Ethereum MCP Server
ETHEREUM_MCP_URL=http://localhost:3000
ETHEREUM_MCP_PORT=3000
ETHEREUM_MCP_ENABLE_INSPECTOR=true

# Ethereum RPC endpoint (used by the MCP server)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY

# LLM API Keys
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

### MCP Server Configuration

The Ethereum MCP server can be configured in the UI at `/settings` or programmatically:

```typescript
import { ConfigManager } from '@/lib/config';

// Add Ethereum MCP server
ConfigManager.addMCPServer('ethereum', 'My Ethereum MCP', {
  url: 'http://localhost:3000',
  port: 3000,
  enableInspector: true,
});

// Enable the server
ConfigManager.toggleMCPServer('ethereum-id', true);
```

## Inspector UI

The mcp-use server includes a built-in Inspector UI for testing tools:

```
http://localhost:3000/inspector
```

Features:
- Browse all 49 available tools
- Test tool execution with custom parameters
- View request/response payloads
- Real-time tool testing

## Troubleshooting

### Connection Issues

1. **Server not starting:**
   ```bash
   # Check if port 3000 is available
   lsof -i :3000

   # Start with a different port
   PORT=3001 node src/lib/ethereum-api/mcp-server/src/index.js
   ```

2. **SSE connection errors:**
   - Ensure the server is running
   - Check firewall settings
   - Use HTTP transport as fallback

3. **Tool execution timeouts:**
   ```typescript
   const client = new MultiServerMCPClient({
     defaultToolTimeout: 60000, // Increase to 60 seconds
   });
   ```

### Tool Errors

1. **Missing Ethereum provider:**
   - Set `ETHEREUM_RPC_URL` environment variable
   - Use a provider like Alchemy, Infura, or Ankr

2. **Invalid parameters:**
   - Check tool schemas in Inspector UI
   - Validate addresses and hex values

## Next Steps

1. **Add more MCP servers**: Create custom MCP servers for other blockchain networks
2. **Implement caching**: Add Redis caching for frequently accessed blockchain data
3. **Add authentication**: Implement API key authentication for production
4. **Monitoring**: Add logging and metrics for tool usage

## Resources

- [LangChain MCP Adapters Docs](https://js.langchain.com/docs/integrations/tools/mcp)
- [mcp-use Documentation](https://mcp-use.com)
- [Model Context Protocol Spec](https://spec.modelcontextprotocol.io)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)

## License

This integration is part of the crypto-wallet-ai project.
