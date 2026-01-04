# MCP Server Configuration Guide

## What are MCP Servers?

Model Context Protocol (MCP) servers extend the AI chatbot's capabilities by providing additional tools and integrations. The wallet chat AI can connect to MCP servers to access external services and APIs.

## Available MCP Servers

### Composio MCP Server

The Composio MCP server provides access to 100+ apps with managed OAuth and API integrations including GitHub, Slack, Gmail, and more.

**Configuration:**

```bash
# Set your Composio API key
export COMPOSIO_API_KEY=your_api_key_here

# Optional: Custom MCP server URL (default: https://mcp.composio.dev/sse)
export COMPOSIO_MCP_URL=https://mcp.composio.dev/sse
```

**Get an API Key:**
1. Visit [Composio](https://composio.dev)
2. Sign up for an account
3. Navigate to API settings
4. Generate a new API key

## How MCP Servers are Loaded

When the application starts, it:

1. **Scans for MCP server configurations** - Checks which MCP servers are registered
2. **Validates environment variables** - Ensures required configuration is present
3. **Enables/disables servers** - Only enables servers with complete configuration
4. **Loads tools** - Connects to enabled servers and loads their available tools

## Checking MCP Server Status

You can check the MCP server loading status in the application logs:

```
[ConfigManager] MCP server "Composio" is disabled due to missing required fields: apiKey
[loadMCPServerTools] Found 1 total MCP servers (0 enabled, 1 disabled)
[loadMCPServerTools] Disabled servers: Composio
```

When properly configured:

```
[loadMCPServerTools] Found 1 total MCP servers (1 enabled, 0 disabled)
[loadMCPServerTools] Loading tools from MCP server: Composio (composio)
[ComposioMCPServer] Connecting to Composio MCP server at https://mcp.composio.dev/sse
[ComposioMCPServer] Connected successfully. Loaded 15 tools
```

## Troubleshooting

### No MCP Servers Loading

**Symptom:** Logs show `Found 0 enabled MCP servers`

**Solution:**
1. Check that required environment variables are set
2. For Composio, ensure `COMPOSIO_API_KEY` is configured
3. Restart the application after setting environment variables

### MCP Server Disabled

**Symptom:** Logs show server is disabled due to missing fields

**Solution:**
1. Check the log message for which fields are missing
2. Set the required environment variables
3. Restart the application

### Connection Errors

**Symptom:** Server is enabled but tools fail to load

**Solution:**
1. Verify the API key is valid
2. Check network connectivity
3. Ensure the MCP server URL is correct
4. Check for rate limiting or quota issues

## Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `COMPOSIO_API_KEY` | Yes | - | Your Composio API key |
| `COMPOSIO_MCP_URL` | No | `https://mcp.composio.dev/sse` | Composio MCP server endpoint |

## Adding Custom MCP Servers

To add a new MCP server:

1. Create a new class extending `BaseMCPServer` in `src/lib/mcpservers/`
2. Implement the required methods:
   - `connect()` - Establish connection to the MCP server
   - `disconnect()` - Clean up resources
   - `getTools()` - Return available tools
   - `isConnected()` - Check connection status
   - `getServerConfigFields()` - Define configuration fields
   - `getServerMetadata()` - Provide server metadata

3. Register the server in `src/lib/mcpservers/index.ts`:

```typescript
import CustomMCPServer from './custom';

const mcpServers: Record<string, MCPServerConstructor<any>> = {
  composio: ComposioMCPServer,
  custom: CustomMCPServer, // Add your server here
};
```

See `src/lib/mcpservers/composio.ts` for a complete example.

## Security Notes

- **API Keys**: Never commit API keys to version control
- **Environment Variables**: Use environment variables or secure secret management
- **Server Trust**: Only connect to trusted MCP servers
- **Data Access**: Review what tools and data each MCP server can access

## More Information

- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Composio Documentation](https://docs.composio.dev)
- [LangChain MCP Adapters](https://js.langchain.com/docs/integrations/tools/mcp)
