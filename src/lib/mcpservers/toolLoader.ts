/**
 * MCP Server Tool Loader
 *
 * This module loads tools from configured MCP servers and converts them
 * to LangChain-compatible tools using @langchain/mcp-adapters.
 */

import { DynamicStructuredTool } from '@langchain/core/tools';
import { getEnabledMCPServers, getConfiguredMCPServers } from '@/lib/config/serverRegistry';
import { MCPServerConfig } from '@/lib/config/types';
import { getMCPServerByKey, BaseMCPServer } from './index';
import { createMCPServerInstance } from './baseMCPServer';

/**
 * Load tools from all enabled MCP servers
 * @returns Array of LangChain-compatible tools from all enabled MCP servers
 */
export async function loadMCPServerTools(): Promise<DynamicStructuredTool[]> {
  const allServers = getConfiguredMCPServers();
  const enabledServers = getEnabledMCPServers();
  const disabledServers = allServers.filter(s => !s.enabled);

  console.log(`[loadMCPServerTools] Found ${allServers.length} total MCP servers (${enabledServers.length} enabled, ${disabledServers.length} disabled)`);

  if (disabledServers.length > 0) {
    console.log(`[loadMCPServerTools] Disabled servers: ${disabledServers.map(s => s.name).join(', ')}`);
  }

  if (enabledServers.length === 0) {
    console.log('[loadMCPServerTools] No enabled MCP servers found. Check environment variables and configuration.');
    return [];
  }

  const allTools: DynamicStructuredTool[] = [];

  for (const serverConfig of enabledServers) {
    try {
      console.log(`[loadMCPServerTools] Loading tools from MCP server: ${serverConfig.name} (${serverConfig.type})`);

      const ServerClass = getMCPServerByKey(serverConfig.type);

      if (!ServerClass) {
        console.warn(`[loadMCPServerTools] Unknown MCP server type: ${serverConfig.type}`);
        continue;
      }

      // Create an instance of the MCP server
      const serverInstance = createMCPServerInstance(
        ServerClass,
        serverConfig.id,
        serverConfig.name,
        serverConfig.config
      );

      // Connect to the server if not already connected
      if (!serverInstance.isConnected()) {
        await serverInstance.connect();
      }

      // Get tools from the server
      const tools = await serverInstance.getTools();

      console.log(`[loadMCPServerTools] Loaded ${tools.length} tools from ${serverConfig.name}`);

      allTools.push(...tools);
    } catch (error) {
      console.error(`[loadMCPServerTools] Failed to load tools from ${serverConfig.name}:`, error);
      // Continue loading other servers even if one fails
    }
  }

  console.log(`[loadMCPServerTools] Total tools loaded: ${allTools.length}`);

  return allTools;
}


/**
 * Get tools from a specific MCP server by ID
 * @param serverId The ID of the MCP server
 * @returns Array of tools from the specified server, or empty array if not found/enabled
 */
export async function getToolsFromMCPServer(serverId: string): Promise<DynamicStructuredTool[]> {
  const enabledServers = getEnabledMCPServers();
  const serverConfig = enabledServers.find(s => s.id === serverId);

  if (!serverConfig) {
    console.warn(`[getToolsFromMCPServer] MCP server not found or not enabled: ${serverId}`);
    return [];
  }

  try {
    const ServerClass = getMCPServerByKey(serverConfig.type);

    if (!ServerClass) {
      console.warn(`[getToolsFromMCPServer] Unknown MCP server type: ${serverConfig.type}`);
      return [];
    }

    const serverInstance = createMCPServerInstance(
      ServerClass,
      serverConfig.id,
      serverConfig.name,
      serverConfig.config
    );

    if (!serverInstance.isConnected()) {
      await serverInstance.connect();
    }

    return await serverInstance.getTools();
  } catch (error) {
    console.error(`[getToolsFromMCPServer] Failed to load tools from server ${serverId}:`, error);
    return [];
  }
}
