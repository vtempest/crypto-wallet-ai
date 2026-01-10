# Examples

This directory contains example code demonstrating various features of the crypto-wallet-ai project.

## LangChain MCP Integration

### Prerequisites

1. **Start the Ethereum MCP Server**
   ```bash
   cd src/lib/ethereum-api/mcp-server
   node src/index.js
   ```

2. **Set Environment Variables**
   ```bash
   # Choose one:
   export OPENAI_API_KEY=your_openai_api_key
   # or
   export ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

### Running the Examples

#### Basic Usage
```bash
npx tsx examples/langchain-ethereum-mcp-agent.ts
```

This will run all 5 examples:
1. **Basic Ethereum Agent** - Simple queries to the Ethereum blockchain
2. **Multi-Step Transaction Flow** - Complex multi-step blockchain operations
3. **Using Specific Tools Directly** - Direct tool invocation without agents
4. **With Tool Hooks and Logging** - Advanced logging and monitoring
5. **Error Handling and Retry Logic** - Robust error handling patterns

#### Run Individual Examples

You can also import and run specific examples:

```typescript
import { basicEthereumAgent, withToolHooks } from './examples/langchain-ethereum-mcp-agent';

// Run just the basic example
await basicEthereumAgent();

// Run with tool hooks
await withToolHooks();
```

### Available Examples

#### 1. Basic Ethereum Agent
Simple agent that can answer questions about Ethereum:
- Current block number
- Gas prices
- Account balances

#### 2. Multi-Step Transaction Flow
Demonstrates complex multi-step operations:
- Chain ID retrieval
- Gas price estimation
- Network condition analysis

#### 3. Using Specific Tools Directly
Shows how to use individual tools without an agent:
```typescript
const blockNumberTool = tools.find(t => t.name === 'ethBlockNumber');
const result = await blockNumberTool.invoke({});
```

#### 4. With Tool Hooks and Logging
Advanced example with before/after hooks:
```typescript
beforeToolCall: ({ serverName, name, args }) => {
  console.log(`Calling ${name} on ${serverName}`);
  return { args, headers: { 'X-Request-ID': uuid() } };
},
afterToolCall: (res) => {
  console.log(`Tool ${res.name} completed`);
  return res;
}
```

#### 5. Error Handling and Retry Logic
Production-ready error handling:
- Connection retry logic
- Timeout configuration
- Graceful error recovery

## Ethereum MCP Server Tools

The Ethereum MCP server provides 49 tools across these categories:

### Wallet Operations (9)
- Add/switch Ethereum chains
- Watch assets
- Manage permissions
- Batch transactions

### Account Operations (2)
- Request accounts
- Get accounts

### Transaction Operations (5)
- Send transactions
- Get transaction details
- Estimate gas

### Signing Operations (4)
- Personal sign
- Typed data v4
- Encryption

### State Queries (6)
- Get balance
- Get contract code
- Storage queries
- Merkle proofs

### Block Queries (9)
- Block number
- Block details
- Fee history
- Sync status

### Network Info (4)
- Chain ID
- Gas price
- Client version

### Filters & Subscriptions (10)
- Create filters
- Get logs
- Subscribe to events

### Generic RPC (1)
- Execute any JSON-RPC method

## Troubleshooting

### Server Not Running
```
❌ Error: Ethereum MCP server is not running!

💡 Start the server with:
   cd src/lib/ethereum-api/mcp-server
   node src/index.js
```

### Connection Issues
- Check that port 3000 is available
- Verify firewall settings
- Try HTTP transport instead of SSE

### API Key Issues
```bash
# Make sure you have set one of:
export OPENAI_API_KEY=your_key
# or
export ANTHROPIC_API_KEY=your_key
```

## Next Steps

1. Explore the [full documentation](../docs/langchain-mcp-integration.md)
2. Customize the examples for your use case
3. Build your own agents with custom tools
4. Integrate with your frontend application

## Resources

- [LangChain Documentation](https://js.langchain.com/)
- [MCP Specification](https://spec.modelcontextprotocol.io/)
- [mcp-use Documentation](https://mcp-use.com/)
