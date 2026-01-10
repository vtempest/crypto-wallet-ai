import { MCPServerUISection } from '@/lib/config/types';
import ComposioMCPServer from './composio';
import { EthereumMCPServer } from './ethereum';
import BaseMCPServer, { MCPServerConstructor } from './baseMCPServer';

const mcpServers: Record<string, MCPServerConstructor<any>> = {
  composio: ComposioMCPServer,
  ethereum: EthereumMCPServer,
};

export const getMCPServersUIConfigSection = (): MCPServerUISection[] => {
  return Object.values(mcpServers).map((server) => {
    const metadata = server.getServerMetadata();
    return {
      name: metadata.name,
      key: metadata.key,
      fields: server.getServerConfigFields(),
    };
  });
};

export const getMCPServerByKey = (
  key: string,
): MCPServerConstructor<any> | undefined => {
  return mcpServers[key];
};

export { mcpServers, BaseMCPServer, ComposioMCPServer, EthereumMCPServer };
export default mcpServers;
