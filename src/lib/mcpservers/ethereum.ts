/**
 * Ethereum MCP Server - LangChain Adapter
 *
 * This adapter wraps the mcp-use Ethereum server and provides
 * LangChain-compatible tools for Ethereum operations.
 */

import { BaseMCPServer } from './baseMCPServer';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import type { MCPServerMetadata, UIConfigField } from '../config/types';
import { z } from 'zod';

/**
 * Configuration for the Ethereum MCP Server
 */
export interface EthereumMCPServerConfig {
  /** URL of the Ethereum MCP server (default: http://localhost:3000) */
  url?: string;
  /** Port for the MCP server (default: 3000) */
  port?: number;
  /** Enable inspector UI (default: false) */
  enableInspector?: boolean;
}

/**
 * Ethereum MCP Server using mcp-use
 *
 * Provides 49 Ethereum tools including:
 * - Wallet operations (add chain, switch chain, watch asset, permissions)
 * - Account operations (request accounts, get accounts)
 * - Transaction operations (send, get receipt, estimate gas)
 * - Signing operations (personal sign, typed data v4)
 * - Block and state queries (get balance, block number, chain ID)
 * - Filters and subscriptions
 */
export class EthereumMCPServer extends BaseMCPServer<EthereumMCPServerConfig> {
  private client: MultiServerMCPClient | null = null;
  private tools: DynamicStructuredTool[] = [];
  private isActive = false;

  /**
   * Get server metadata
   */
  static override getServerMetadata(): MCPServerMetadata {
    return {
      name: 'Ethereum MCP',
      key: 'ethereum',
      description: '49 Ethereum tools powered by mcp-use - wallet operations, transactions, signing, and blockchain queries',
      icon: '⟠', // Ethereum symbol
    };
  }

  /**
   * Get configuration fields for UI
   */
  static override getServerConfigFields(): UIConfigField[] {
    return [
      {
        name: 'url',
        label: 'Server URL',
        type: 'string',
        required: false,
        placeholder: 'http://localhost:3000',
        description: 'URL of the Ethereum MCP server',
      },
      {
        name: 'port',
        label: 'Server Port',
        type: 'string',
        required: false,
        placeholder: '3000',
        description: 'Port for the MCP server',
      },
      {
        name: 'enableInspector',
        label: 'Enable Inspector',
        type: 'switch',
        required: false,
        description: 'Enable the Inspector UI at /inspector',
      },
    ];
  }

  /**
   * Parse and validate configuration
   */
  static override parseAndValidate(raw: any): EthereumMCPServerConfig {
    const config: EthereumMCPServerConfig = {
      url: raw.url || 'http://localhost:3000',
      port: raw.port ? parseInt(String(raw.port), 10) : 3000,
      enableInspector: raw.enableInspector === true || raw.enableInspector === 'true',
    };

    return config;
  }

  /**
   * Connect to the Ethereum MCP server
   */
  async connect(): Promise<void> {
    try {
      const serverUrl = this.config.url || `http://localhost:${this.config.port || 3000}`;

      // Initialize MultiServerMCPClient
      this.client = new MultiServerMCPClient({
        mcpServers: {
          ethereum: {
            transport: 'sse', // Use SSE (Server-Sent Events) transport
            url: `${serverUrl}/sse`,
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
        defaultToolTimeout: 30000, // 30 second timeout for Ethereum operations
        useStandardContentBlocks: true,
      });

      // Get tools from the MCP server
      this.tools = await this.client.getTools();
      this.isActive = true;

      console.log(`✅ Ethereum MCP Server connected with ${this.tools.length} tools`);
    } catch (error: any) {
      console.error('❌ Failed to connect to Ethereum MCP Server:', error.message);
      this.isActive = false;
      throw new Error(`Failed to connect to Ethereum MCP Server: ${error.message}`);
    }
  }

  /**
   * Disconnect from the Ethereum MCP server
   */
  async disconnect(): Promise<void> {
    try {
      if (this.client) {
        await this.client.close();
        this.client = null;
      }
      this.tools = [];
      this.isActive = false;
      console.log('✅ Ethereum MCP Server disconnected');
    } catch (error: any) {
      console.error('⚠️ Error disconnecting from Ethereum MCP Server:', error.message);
      throw error;
    }
  }

  /**
   * Get available tools
   */
  async getTools(): Promise<DynamicStructuredTool[]> {
    if (!this.isActive || this.tools.length === 0) {
      await this.connect();
    }
    return this.tools;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.isActive;
  }
}
