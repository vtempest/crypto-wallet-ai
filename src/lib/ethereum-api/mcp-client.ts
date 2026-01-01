/**
 * MCP Client for Ethereum API
 *
 * This client connects to the Ethereum MCP server and provides
 * a way to call Ethereum tools from the LangChain agent.
 */

import { toolConfigs, toolConfigMap } from './mcp-server/src/tools-config.js';

interface MCPConfig {
  baseUrl?: string;
  serverUrl?: string;
}

interface MCPCallParams {
  toolName: string;
  params: Record<string, any>;
}

interface MCPCallResult {
  ok: boolean;
  data: any;
  error?: string;
}

/**
 * MCP Client for calling Ethereum tools via HTTP
 */
export class EthereumMCPClient {
  private serverUrl: string;

  constructor(config: MCPConfig = {}) {
    // Default to localhost MCP server
    this.serverUrl = config.serverUrl || 'http://localhost:3000';
  }

  /**
   * Call a tool on the MCP server
   */
  async callTool(toolName: string, params: Record<string, any> = {}): Promise<MCPCallResult> {
    try {
      const toolConfig = toolConfigMap.get(toolName);

      if (!toolConfig) {
        return {
          ok: false,
          data: null,
          error: `Tool "${toolName}" not found in configuration`
        };
      }

      // Build the request URL
      const url = `${this.serverUrl}${toolConfig.pathTemplate}`;

      // Build query parameters if needed
      const queryParams = new URLSearchParams();
      if (toolConfig.executionParameters && toolConfig.executionParameters.length > 0) {
        toolConfig.executionParameters.forEach((param: any) => {
          if (param.in === 'query' && params[param.name] !== undefined) {
            queryParams.append(param.name, String(params[param.name]));
          }
        });
      }

      const fullUrl = queryParams.toString()
        ? `${url}?${queryParams.toString()}`
        : url;

      // Prepare request options
      const requestOptions: RequestInit = {
        method: toolConfig.method.toUpperCase(),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Add request body for POST/PUT requests
      if (toolConfig.method.toLowerCase() !== 'get' && params.requestBody) {
        requestOptions.body = JSON.stringify(params.requestBody);
      }

      // Make the request
      const response = await fetch(fullUrl, requestOptions);
      const data = await response.json();

      return {
        ok: response.ok,
        data: data,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`
      };
    } catch (error: any) {
      return {
        ok: false,
        data: null,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Get all available tool names
   */
  getAvailableTools(): string[] {
    return Array.from(toolConfigMap.keys());
  }

  /**
   * Get tool configuration by name
   */
  getToolConfig(toolName: string) {
    return toolConfigMap.get(toolName);
  }
}

/**
 * Singleton instance
 */
let clientInstance: EthereumMCPClient | null = null;

/**
 * Get or create the MCP client instance
 */
export function getEthereumMCPClient(config?: MCPConfig): EthereumMCPClient {
  if (!clientInstance) {
    clientInstance = new EthereumMCPClient(config);
  }
  return clientInstance;
}

/**
 * Reset the client instance (useful for testing)
 */
export function resetEthereumMCPClient(): void {
  clientInstance = null;
}
