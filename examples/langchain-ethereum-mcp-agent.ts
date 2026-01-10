/**
 * LangChain Ethereum MCP Agent Example
 *
 * This example demonstrates how to use the Ethereum MCP server
 * with LangChain agents to interact with Ethereum blockchain.
 *
 * Prerequisites:
 * 1. Start the Ethereum MCP server: node src/lib/ethereum-api/mcp-server/src/index.js
 * 2. Set environment variables: OPENAI_API_KEY or ANTHROPIC_API_KEY
 *
 * Run: npx tsx examples/langchain-ethereum-mcp-agent.ts
 */

import 'dotenv/config';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

/**
 * Example 1: Basic Ethereum Agent
 */
async function basicEthereumAgent() {
  console.log('\n🚀 Example 1: Basic Ethereum Agent\n');
  console.log('━'.repeat(60));

  // Choose your LLM
  const model = process.env.OPENAI_API_KEY
    ? new ChatOpenAI({ model: 'gpt-4o', temperature: 0 })
    : new ChatAnthropic({ model: 'claude-3-5-sonnet-20241022' });

  // Connect to Ethereum MCP server
  const client = new MultiServerMCPClient({
    mcpServers: {
      ethereum: {
        transport: 'sse',
        url: 'http://localhost:3000/sse',
        headers: {
          Accept: 'text/event-stream',
        },
        reconnect: {
          enabled: true,
          maxAttempts: 3,
          delayMs: 2000,
        },
      },
    },
    defaultToolTimeout: 30000,
    useStandardContentBlocks: true,
  });

  try {
    // Get all tools
    const tools = await client.getTools();
    console.log(`✅ Loaded ${tools.length} Ethereum tools\n`);

    // Create agent
    const agent = createReactAgent({
      llm: model,
      tools: tools,
    });

    // Example queries
    const queries = [
      'What is the current Ethereum block number?',
      'What is the current gas price in gwei?',
      'Get the ETH balance of 0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    ];

    for (const query of queries) {
      console.log(`\n📝 Query: ${query}`);
      console.log('─'.repeat(60));

      const result = await agent.invoke({
        messages: [{ role: 'user', content: query }],
      });

      const response = result.messages[result.messages.length - 1].content;
      console.log(`💬 Response: ${response}\n`);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

/**
 * Example 2: Multi-Step Transaction Flow
 */
async function multiStepTransactionFlow() {
  console.log('\n🚀 Example 2: Multi-Step Transaction Flow\n');
  console.log('━'.repeat(60));

  const model = process.env.OPENAI_API_KEY
    ? new ChatOpenAI({ model: 'gpt-4o', temperature: 0 })
    : new ChatAnthropic({ model: 'claude-3-5-sonnet-20241022' });

  const client = new MultiServerMCPClient({
    mcpServers: {
      ethereum: {
        transport: 'sse',
        url: 'http://localhost:3000/sse',
      },
    },
  });

  try {
    const tools = await client.getTools();
    const agent = createReactAgent({ llm: model, tools });

    const query = `
      Please help me with the following:
      1. Get the current Ethereum chain ID
      2. Check what the current gas price is
      3. Get the latest block number

      Provide a summary of the current network conditions.
    `;

    console.log(`\n📝 Query: ${query}`);
    console.log('─'.repeat(60));

    const result = await agent.invoke({
      messages: [{ role: 'user', content: query }],
    });

    const response = result.messages[result.messages.length - 1].content;
    console.log(`💬 Response: ${response}\n`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

/**
 * Example 3: Using Specific Tools Directly
 */
async function usingSpecificTools() {
  console.log('\n🚀 Example 3: Using Specific Tools Directly\n');
  console.log('━'.repeat(60));

  const client = new MultiServerMCPClient({
    mcpServers: {
      ethereum: {
        transport: 'sse',
        url: 'http://localhost:3000/sse',
      },
    },
  });

  try {
    const tools = await client.getTools();

    // Find specific tools
    const blockNumberTool = tools.find((t) => t.name === 'ethBlockNumber');
    const gasPriceTool = tools.find((t) => t.name === 'ethGasPrice');
    const chainIdTool = tools.find((t) => t.name === 'ethChainId');

    if (blockNumberTool && gasPriceTool && chainIdTool) {
      console.log('\n📊 Calling tools directly:\n');

      // Call block number
      const blockResult = await blockNumberTool.invoke({});
      console.log(`📦 Block Number: ${blockResult}`);

      // Call gas price
      const gasResult = await gasPriceTool.invoke({});
      console.log(`⛽ Gas Price: ${gasResult}`);

      // Call chain ID
      const chainResult = await chainIdTool.invoke({});
      console.log(`🔗 Chain ID: ${chainResult}\n`);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

/**
 * Example 4: With Tool Hooks and Logging
 */
async function withToolHooks() {
  console.log('\n🚀 Example 4: With Tool Hooks and Logging\n');
  console.log('━'.repeat(60));

  const model = process.env.OPENAI_API_KEY
    ? new ChatOpenAI({ model: 'gpt-4o', temperature: 0 })
    : new ChatAnthropic({ model: 'claude-3-5-sonnet-20241022' });

  const client = new MultiServerMCPClient({
    mcpServers: {
      ethereum: {
        transport: 'sse',
        url: 'http://localhost:3000/sse',
      },
    },
    // Before tool call hook
    beforeToolCall: ({ serverName, name, args }) => {
      console.log(`\n🔧 [BEFORE] Tool: ${name}`);
      console.log(`   Server: ${serverName}`);
      console.log(`   Args: ${JSON.stringify(args, null, 2)}`);
      return {
        args: { ...args, _timestamp: Date.now() },
        headers: { 'X-Request-ID': crypto.randomUUID() },
      };
    },
    // After tool call hook
    afterToolCall: (res) => {
      console.log(`\n✅ [AFTER] Tool: ${res.name}`);
      console.log(`   Status: Success`);
      return res;
    },
  });

  try {
    const tools = await client.getTools();
    const agent = createReactAgent({ llm: model, tools });

    const result = await agent.invoke({
      messages: [
        {
          role: 'user',
          content: 'What is the current Ethereum block number?',
        },
      ],
    });

    const response = result.messages[result.messages.length - 1].content;
    console.log(`\n💬 Final Response: ${response}\n`);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

/**
 * Example 5: Error Handling and Retry Logic
 */
async function withErrorHandling() {
  console.log('\n🚀 Example 5: Error Handling and Retry Logic\n');
  console.log('━'.repeat(60));

  const client = new MultiServerMCPClient({
    mcpServers: {
      ethereum: {
        transport: 'sse',
        url: 'http://localhost:3000/sse',
        reconnect: {
          enabled: true,
          maxAttempts: 5,
          delayMs: 1000,
        },
      },
    },
    defaultToolTimeout: 10000,
  });

  try {
    const tools = await client.getTools();
    console.log(`✅ Connected with ${tools.length} tools`);

    // Try to get a tool
    const balanceTool = tools.find((t) => t.name === 'ethGetBalance');

    if (balanceTool) {
      try {
        // Call with valid address
        const result = await balanceTool.invoke({
          address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          block: 'latest',
        });
        console.log(`💰 Balance Result: ${result}`);
      } catch (error: any) {
        console.error(`⚠️ Tool Error: ${error.message}`);
      }
    }
  } catch (error: any) {
    console.error('❌ Connection Error:', error.message);
    console.log('\n💡 Tip: Make sure the Ethereum MCP server is running at http://localhost:3000');
  } finally {
    await client.close();
  }
}

/**
 * Main function to run all examples
 */
async function main() {
  console.log('\n');
  console.log('═'.repeat(60));
  console.log('  LangChain Ethereum MCP Agent Examples');
  console.log('═'.repeat(60));

  // Check if server is running
  try {
    const response = await fetch('http://localhost:3000/mcp');
    if (!response.ok) {
      throw new Error('Server not responding');
    }
  } catch (error) {
    console.error('\n❌ Error: Ethereum MCP server is not running!');
    console.log('\n💡 Start the server with:');
    console.log('   cd src/lib/ethereum-api/mcp-server');
    console.log('   node src/index.js\n');
    process.exit(1);
  }

  try {
    // Run examples
    await basicEthereumAgent();
    await multiStepTransactionFlow();
    await usingSpecificTools();
    await withToolHooks();
    await withErrorHandling();

    console.log('\n✅ All examples completed successfully!\n');
  } catch (error: any) {
    console.error('\n❌ Error running examples:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export {
  basicEthereumAgent,
  multiStepTransactionFlow,
  usingSpecificTools,
  withToolHooks,
  withErrorHandling,
};
