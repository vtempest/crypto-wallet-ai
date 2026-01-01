import configManager from './index';
import { ConfigModelProvider, MCPServerConfig } from './types';

export const getConfiguredModelProviders = (): ConfigModelProvider[] => {
  return configManager.getConfig('modelProviders', []);
};

export const getConfiguredModelProviderById = (
  id: string,
): ConfigModelProvider | undefined => {
  return getConfiguredModelProviders().find((p) => p.id === id) ?? undefined;
};

export const getSearxngURL = () =>
  configManager.getConfig('search.searxngURL', '');

export const getTavilyApiKey = () =>
  configManager.getConfig('search.tavilyApiKey', '');

export const getConfiguredMCPServers = (): MCPServerConfig[] => {
  return configManager.getConfig('mcpServers', []);
};

export const getConfiguredMCPServerById = (
  id: string,
): MCPServerConfig | undefined => {
  return getConfiguredMCPServers().find((s) => s.id === id) ?? undefined;
};

export const getEnabledMCPServers = (): MCPServerConfig[] => {
  return getConfiguredMCPServers().filter((s) => s.enabled);
};
