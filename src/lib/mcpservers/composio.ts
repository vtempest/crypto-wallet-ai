import { UIConfigField } from '@/lib/config/types';
import BaseMCPServer, { MCPServerMetadata } from './baseMCPServer';
import { MCPTool } from './types';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';

type ComposioConfig = {
  apiKey: string;
  url?: string;
  apps?: string[];
};

class ComposioMCPServer extends BaseMCPServer<ComposioConfig> {
  private connected: boolean = false;
  private mcpClient: MultiServerMCPClient | null = null;
  private tools: DynamicStructuredTool[] = [];

  async connect(): Promise<void> {
    try {
      // Initialize connection to Composio MCP server
      const url = this.config.url || 'https://mcp.composio.dev/sse';

      console.log(`[ComposioMCPServer] Connecting to Composio MCP server at ${url}`);

      // Initialize MCP client using @langchain/mcp-adapters
      // Using MultiServerMCPClient with SSE transport for Composio
      this.mcpClient = new MultiServerMCPClient({
        throwOnLoadError: false, // Don't throw if a tool fails to load
        prefixToolNameWithServerName: false,
        useStandardContentBlocks: true,
        onConnectionError: 'ignore',
        mcpServers: {
          composio: {
            transport: 'sse',
            url: url,
            headers: {
              'X-API-Key': this.config.apiKey,
            },
            reconnect: {
              enabled: true,
              maxAttempts: 3,
              delayMs: 2000,
            },
          },
        },
      });

      // Load tools from the server
      this.tools = await this.mcpClient.getTools();

      this.connected = true;

      console.log(`[ComposioMCPServer] Connected successfully. Loaded ${this.tools.length} tools`);
    } catch (error) {
      console.error('[ComposioMCPServer] Failed to connect to Composio MCP server:', error);
      this.connected = false;
      this.tools = [];
      // Don't throw - allow the chatbot to work without this server
    }
  }

  async disconnect(): Promise<void> {
    if (this.mcpClient) {
      await this.mcpClient.close();
      this.mcpClient = null;
    }
    this.connected = false;
    this.tools = [];
  }

  async getTools(): Promise<DynamicStructuredTool[]> {
    if (!this.connected) {
      await this.connect();
    }

    return this.tools;
  }

  isConnected(): boolean {
    return this.connected;
  }

  static getServerConfigFields(): UIConfigField[] {
    return [
      {
        name: 'API Key',
        key: 'apiKey',
        type: 'password',
        required: true,
        description: 'Your Composio API key',
        scope: 'server',
        placeholder: 'Enter your Composio API key',
        env: 'COMPOSIO_API_KEY',
      },
      {
        name: 'MCP Server URL',
        key: 'url',
        type: 'string',
        required: false,
        description: 'Composio MCP server URL (default: https://mcp.composio.dev/sse)',
        scope: 'server',
        placeholder: 'https://mcp.composio.dev/sse',
        default: 'https://mcp.composio.dev/sse',
        env: 'COMPOSIO_MCP_URL',
      },
      {
        name: 'Apps',
        key: 'apps',
        type: 'textarea',
        required: false,
        description: 'Comma-separated list of apps to enable (e.g., github,slack,gmail)',
        scope: 'server',
        placeholder: 'github,slack,gmail',
      },
    ];
  }

  static getServerMetadata(): MCPServerMetadata {
    return {
      name: 'Composio',
      key: 'composio',
      description: 'Connect to 100+ apps via Composio MCP server with managed OAuth and API integrations',
      icon: '🔗',
    };
  }

  static parseAndValidate(raw: any): ComposioConfig {
    if (!raw || typeof raw !== 'object') {
      throw new Error('Invalid config: must be an object');
    }

    const { apiKey, url, apps } = raw;

    if (!apiKey || typeof apiKey !== 'string') {
      throw new Error('Invalid config: apiKey is required and must be a string');
    }

    const config: ComposioConfig = {
      apiKey,
      url: url || 'https://mcp.composio.dev/sse',
    };

    if (apps) {
      if (typeof apps === 'string') {
        config.apps = apps.split(',').map((app) => app.trim());
      } else if (Array.isArray(apps)) {
        config.apps = apps;
      }
    }

    return config;
  }
}

export default ComposioMCPServer;
