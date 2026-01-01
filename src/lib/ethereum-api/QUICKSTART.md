# Quick Start Guide - Ethereum MCP Integration

## 🚀 Getting Started in 3 Steps

### Step 1: Start the MCP Server

```bash
# Navigate to the MCP server directory
cd src/lib/ethereum-api/mcp-server

# Install dependencies (first time only)
npm install

# Start the server
npm start
```

You should see:
```
🚀 api-mcp-server MCP Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Server:    http://localhost:3000
🔍 Inspector: http://localhost:3000/inspector
📡 MCP:       http://localhost:3000/mcp
🔄 SSE:       http://localhost:3000/sse

🛠️  Tools Available: 49
```

### Step 2: Verify Integration

The Ethereum tools are automatically integrated into your chatbot! Open the app and the tools will be available.

### Step 3: Try It Out!

Ask your chatbot Ethereum questions:

**Example queries:**
- "What's the current Ethereum block number?"
- "Get the ETH balance for 0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
- "What's the current gas price?"
- "Get the chain ID"
- "Show me transaction details for 0x..."

## 🎯 How It Works

```
User Question
     ↓
LangChain Agent (decides which tools to use)
     ↓
Ethereum Tools (converted from MCP)
     ↓
MCP Client (HTTP requests)
     ↓
MCP Server (port 3000)
     ↓
Ethereum Network
     ↓
Response back to user
```

## 🛠️ Available Tool Categories

### 1. Wallet Operations
- Request accounts
- Get account list
- Send transactions
- Sign messages
- Switch networks

### 2. Blockchain Queries
- Get balances
- Get block info
- Get transaction details
- Get gas prices
- Query logs

### 3. Smart Contracts
- Call contract functions
- Get contract code
- Estimate gas
- Read storage

## 📝 Example Conversations

### Get Balance
**User**: "What's the ETH balance of vitalik.eth?"

**AI**: *Uses `ethGetBalance` tool*

"The address 0x... has a balance of 2.5 ETH"

### Check Transaction
**User**: "Get details for transaction 0xabc123..."

**AI**: *Uses `ethGetTransactionByHash` tool*

"This transaction was sent from 0x... to 0x... transferring 1 ETH. It was confirmed in block 12345678 with gas price 20 gwei."

### Current Network Info
**User**: "What network am I connected to?"

**AI**: *Uses `ethChainId` tool*

"You're connected to Ethereum Mainnet (Chain ID: 1)"

## 🔧 Configuration

### Default Settings
The integration uses these defaults:
- MCP Server URL: `http://localhost:3000`
- Common tools enabled (13 most useful tools)
- Automatic tool selection by AI

### Customize Tools

Edit `src/lib/research/agents/agent-tools.js`:

```javascript
// Use different tool sets:

// All 49 tools
import { generateEthereumTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateEthereumTools();

// Common tools (default - 13 tools)
import { generateCommonEthereumTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateCommonEthereumTools();

// Wallet-only tools
import { generateWalletTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateWalletTools();

// Query-only tools
import { generateBlockchainQueryTools } from '../../ethereum-api/langchain-tools';
const ETHEREUM_TOOLS = generateBlockchainQueryTools();
```

## 🐛 Troubleshooting

### MCP Server Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill any process using port 3000
kill -9 <PID>

# Restart server
npm start
```

### Tools Not Working
1. Verify MCP server is running: `curl http://localhost:3000/inspector`
2. Check console for errors
3. Restart both MCP server and Next.js app

### "Cannot connect to MCP server"
- Make sure MCP server is running on port 3000
- Check firewall settings
- Try accessing http://localhost:3000/inspector in browser

## 📚 Learn More

- [Full Documentation](./README.md)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [LangChain Tools](https://js.langchain.com/docs/modules/agents/tools/)
- [Ethereum JSON-RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/)

## 💡 Tips

1. **The AI decides which tools to use** - You don't need to specify tool names
2. **Tools work best with specific questions** - Instead of "Tell me about Ethereum", ask "What's the current block number?"
3. **Multiple tools can be chained** - The AI can use several tools to answer complex questions
4. **Wallet operations require user approval** - Transactions and signatures need user confirmation

## 🎉 You're All Set!

The Ethereum tools are now integrated with your chatbot. Start asking Ethereum questions and watch the AI use the right tools automatically!
