# MCP Servers Setup Guide

## Quick Start

This guide will help you enable MCP servers in your crypto wallet AI application.

## What Happened?

You're seeing this error in your logs:
```
[loadMCPServerTools] Found 1 total MCP servers (0 enabled, 1 disabled)
[loadMCPServerTools] Disabled servers: Composio
[loadMCPServerTools] No enabled MCP servers found. Check environment variables and configuration.
```

And possibly this error:
```
Error: 400 tool call validation failed: attempted to call tool 'brave_search' which was not in request.tools
```

## Why It Happens

1. **MCP Server Disabled**: The Composio MCP server requires a valid API key to work. The `.env` file has been created with a placeholder value, which is detected and rejected by the validation.

2. **Missing Tools**: Because no MCP servers are enabled, no tools are loaded, which can cause the AI model to fail when it tries to use tools that don't exist.

## How to Fix It

### Step 1: Get a Composio API Key

1. Visit [Composio](https://composio.dev)
2. Sign up for a free account
3. Navigate to API Settings or Dashboard
4. Generate a new API key
5. Copy the API key (it should look something like: `comp_xxxxxxxxxxxxx`)

### Step 2: Update Your .env File

Open the `.env` file in your project root and replace the placeholder:

```bash
# Replace this placeholder:
COMPOSIO_API_KEY=your_composio_api_key_here

# With your actual API key:
COMPOSIO_API_KEY=comp_xxxxxxxxxxxxx
```

### Step 3: Restart Your Application

```bash
# Stop your current dev server (Ctrl+C)
# Then restart it:
npm run dev
```

### Step 4: Verify It's Working

Check your logs. You should see:

```
[ConfigManager] MCP server "Composio" is enabled and will attempt to connect
[loadMCPServerTools] Found 1 total MCP servers (1 enabled, 0 disabled)
[loadMCPServerTools] Loading tools from MCP server: Composio (composio)
[ComposioMCPServer] Connecting to Composio MCP server at https://mcp.composio.dev/sse
[ComposioMCPServer] Connected successfully. Loaded 15 tools
[createSearchHandlers] Loaded 15 tools from MCP servers
```

## Troubleshooting

### Still Seeing "Placeholder Values Detected"

If you see:
```
[ConfigManager] MCP server "Composio" is disabled - placeholder values detected in: apiKey
```

This means your API key still contains placeholder text like:
- `your_composio_api_key_here`
- `your-api-key-here`
- Any value containing `your_` or `_here`

**Solution**: Replace it with your actual API key from Composio.

### Connection Errors After Enabling

If the server is enabled but you see connection errors:

```
[ComposioMCPServer] Failed to connect to Composio MCP server: [error details]
```

**Possible causes:**
1. **Invalid API key**: Double-check you copied the entire key correctly
2. **Network issues**: Check your internet connection
3. **Rate limiting**: You may have exceeded API limits
4. **Server downtime**: Check [Composio status](https://status.composio.dev) (if available)

### About the brave_search Error

The error:
```
Error: 400 tool call validation failed: attempted to call tool 'brave_search' which was not in request.tools
```

This happens when:
1. The AI model tries to use a tool that doesn't exist in the available tools list
2. MCP servers are disabled, so no MCP tools are loaded
3. The model has no web search tools available

**Solution**: Enable MCP servers as described above. Once Composio is properly configured, it will provide search and other tools to the AI model.

## What MCP Servers Provide

**Composio MCP Server** gives your AI access to:
- 100+ app integrations (GitHub, Slack, Gmail, etc.)
- Web search capabilities
- API integrations with managed OAuth
- And many more tools

## Alternative: Disable MCP Server Validation (Not Recommended)

If you want to run without MCP servers temporarily, you can comment out the API key requirement:

```bash
# In .env file, comment out or remove:
# COMPOSIO_API_KEY=your_composio_api_key_here
```

The server will be disabled, and the application will work with reduced functionality (no MCP tools available).

## Need Help?

- Check the full [MCP Configuration Guide](./MCP_CONFIGURATION.md)
- Review the [.env.example](./.env.example) file for all configuration options
- Open an issue on GitHub if you're still having problems

## Security Reminder

⚠️ **Never commit your .env file to version control!**

The `.env` file is already in `.gitignore` to prevent this, but always double-check before committing.
