import {
  Config,
  ConfigModelProvider,
  MCPServerConfig,
  UIConfigSections,
} from './types';
import { hashObj } from '../serverUtils';
import { getModelProvidersUIConfigSection } from '../research/models/providers';
import { getMCPServersUIConfigSection } from '../mcpservers';

class ConfigManager {
  configVersion = 1;
  currentConfig: Config = {
    version: this.configVersion,
    setupComplete: process.env.SETUP_COMPLETE === 'true' || false,
    preferences: {},
    personalization: {},
    modelProviders: [],
    mcpServers: [],
    search: {
      searxngURL: '',
      tavilyApiKey: '',
    },
  };
  uiConfigSections: UIConfigSections = {
    preferences: [
      {
        name: 'Theme',
        key: 'theme',
        type: 'select',
        options: [
          {
            name: 'Light',
            value: 'light',
          },
          {
            name: 'Dark',
            value: 'dark',
          },
        ],
        required: false,
        description: 'Choose between light and dark layouts for the app.',
        default: 'dark',
        scope: 'client',
      },
      {
        name: 'Measurement Unit',
        key: 'measureUnit',
        type: 'select',
        options: [
          {
            name: 'Imperial',
            value: 'Imperial',
          },
          {
            name: 'Metric',
            value: 'Metric',
          },
        ],
        required: false,
        description: 'Choose between Metric  and Imperial measurement unit.',
        default: 'Metric',
        scope: 'client',
      },
      {
        name: 'Auto video & image search',
        key: 'autoMediaSearch',
        type: 'switch',
        required: false,
        description: 'Automatically search for relevant images and videos.',
        default: true,
        scope: 'client',
      },
      {
        name: 'Show weather widget',
        key: 'showWeatherWidget',
        type: 'switch',
        required: false,
        description: 'Display the weather card on the home screen.',
        default: true,
        scope: 'client',
      },
      {
        name: 'Show news widget',
        key: 'showNewsWidget',
        type: 'switch',
        required: false,
        description: 'Display the recent news card on the home screen.',
        default: true,
        scope: 'client',
      },
    ],
    personalization: [
      {
        name: 'System Instructions',
        key: 'systemInstructions',
        type: 'textarea',
        required: false,
        description: 'Add custom behavior or tone for the model.',
        placeholder:
          'e.g., "Respond in a friendly and concise tone" or "Use British English and format answers as bullet points."',
        scope: 'client',
      },
    ],
    modelProviders: [],
    mcpServers: [],
    search: [
      {
        name: 'SearXNG URL',
        key: 'searxngURL',
        type: 'string',
        required: false,
        description: 'The URL of your SearXNG instance',
        placeholder: 'http://localhost:4000',
        default: '',
        scope: 'server',
        env: 'SEARXNG_API_URL',
      },
      {
        name: 'Tavily API Key',
        key: 'tavilyApiKey',
        type: 'password',
        required: false,
        description:
          'Your Tavily API key for enhanced search capabilities. Get one at https://tavily.com',
        placeholder: 'tvly-...',
        default: '',
        scope: 'server',
        env: 'TAVILY_API_KEY',
      },
    ],
  };

  constructor() {
    this.initialize();
  }

  private initialize() {
    this.initializeFromEnv();
    this.loadPreferencesFromEnv();
  }

  private loadPreferencesFromEnv() {
    // Load preferences from environment variables
    if (process.env.THEME) {
      this.currentConfig.preferences.theme = process.env.THEME;
    }
    if (process.env.MEASURE_UNIT) {
      this.currentConfig.preferences.measureUnit = process.env.MEASURE_UNIT;
    }
    if (process.env.AUTO_MEDIA_SEARCH) {
      this.currentConfig.preferences.autoMediaSearch = process.env.AUTO_MEDIA_SEARCH === 'true';
    }
    if (process.env.SHOW_WEATHER_WIDGET) {
      this.currentConfig.preferences.showWeatherWidget = process.env.SHOW_WEATHER_WIDGET === 'true';
    }
    if (process.env.SHOW_NEWS_WIDGET) {
      this.currentConfig.preferences.showNewsWidget = process.env.SHOW_NEWS_WIDGET === 'true';
    }

    // Load personalization from environment variables
    if (process.env.SYSTEM_INSTRUCTIONS) {
      this.currentConfig.personalization.systemInstructions = process.env.SYSTEM_INSTRUCTIONS;
    }
  }

  private initializeFromEnv() {
    /* providers section*/
    const providerConfigSections = getModelProvidersUIConfigSection();

    this.uiConfigSections.modelProviders = providerConfigSections;

    /* MCP servers section */
    const mcpServerConfigSections = getMCPServersUIConfigSection();

    this.uiConfigSections.mcpServers = mcpServerConfigSections;

    const newProviders: ConfigModelProvider[] = [];

    providerConfigSections.forEach((provider) => {
      const tempConfig: Record<string, any> = {};
      const required: string[] = [];

      provider.fields.forEach((field) => {
        tempConfig[field.key] =
          process.env[field.env!] ||
          field.default ||
          ''; /* Env var must exist for providers */

        if (field.required) required.push(field.key);
      });

      let configured = true;

      required.forEach((r) => {
        if (!tempConfig[r]) {
          configured = false;
        }
      });

      if (configured) {
        const hash = hashObj(tempConfig);

        // Use hash as ID for deterministic provider IDs
        const exists = this.currentConfig.modelProviders.find(
          (p) => p.hash === hash,
        );

        if (!exists) {
          const newProvider: ConfigModelProvider = {
            id: hash,
            name: `${provider.name}`,
            type: provider.key,
            chatModels: [],
            config: tempConfig,
            hash: hash,
          };

          newProviders.push(newProvider);
        }
      }
    });

    if (newProviders.length > 0) {
      this.currentConfig.modelProviders.push(...newProviders);
    }

    /* MCP servers initialization */
    const newMCPServers: MCPServerConfig[] = [];

    mcpServerConfigSections.forEach((server) => {
      const tempConfig: Record<string, any> = {};
      const required: string[] = [];

      server.fields.forEach((field) => {
        tempConfig[field.key] =
          process.env[field.env!] ||
          field.default ||
          ''; /* Env var must exist for MCP servers */

        if (field.required) required.push(field.key);
      });

      let configured = true;

      required.forEach((r) => {
        if (!tempConfig[r]) {
          configured = false;
        }
      });

      if (configured) {
        const hash = hashObj(tempConfig);

        // Use hash as ID for deterministic MCP server IDs
        const exists = this.currentConfig.mcpServers.find(
          (s) => s.hash === hash,
        );

        if (!exists) {
          const newMCPServer: MCPServerConfig = {
            id: hash,
            name: `${server.name}`,
            type: server.key,
            config: tempConfig,
            enabled: true,
            hash: hash,
          };

          newMCPServers.push(newMCPServer);
        }
      }
    });

    if (newMCPServers.length > 0) {
      this.currentConfig.mcpServers.push(...newMCPServers);
    }

    /* search section */
    let searchChanged = false;
    this.uiConfigSections.search.forEach((f) => {
      if (f.env && !this.currentConfig.search[f.key]) {
        this.currentConfig.search[f.key] =
          process.env[f.env] ?? f.default ?? '';
        searchChanged = true;
      }
    });

    // Configuration is now stored in memory only, sourced from environment variables
  }

  public getConfig(key: string, defaultValue?: any): any {
    const nested = key.split('.');
    let obj: any = this.currentConfig;

    for (let i = 0; i < nested.length; i++) {
      const part = nested[i];
      if (obj == null) return defaultValue;

      obj = obj[part];
    }

    return obj === undefined ? defaultValue : obj;
  }

  public updateConfig(key: string, val: any) {
    const parts = key.split('.');
    if (parts.length === 0) return;

    let target: any = this.currentConfig;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (target[part] === null || typeof target[part] !== 'object') {
        target[part] = {};
      }

      target = target[part];
    }

    const finalKey = parts[parts.length - 1];
    target[finalKey] = val;

    // Configuration changes are kept in memory only
  }

  public addModelProvider(type: string, name: string, config: any) {
    const hash = hashObj(config);

    const newModelProvider: ConfigModelProvider = {
      id: hash,
      name,
      type,
      config,
      chatModels: [],
      hash: hash,
    };

    this.currentConfig.modelProviders.push(newModelProvider);

    return newModelProvider;
  }

  public removeModelProvider(id: string) {
    const index = this.currentConfig.modelProviders.findIndex(
      (p) => p.id === id,
    );

    if (index === -1) return;

    this.currentConfig.modelProviders =
      this.currentConfig.modelProviders.filter((p) => p.id !== id);
  }

  public async updateModelProvider(id: string, name: string, config: any) {
    const provider = this.currentConfig.modelProviders.find((p) => {
      return p.id === id;
    });

    if (!provider) throw new Error('Provider not found');

    provider.name = name;
    provider.config = config;

    return provider;
  }

  public addProviderModel(
    providerId: string,
    type: 'chat',
    model: any,
  ) {
    const provider = this.currentConfig.modelProviders.find(
      (p) => p.id === providerId,
    );

    if (!provider) throw new Error('Invalid provider id');

    delete model.type;

    provider.chatModels.push(model);

    return model;
  }

  public removeProviderModel(
    providerId: string,
    type: 'chat',
    modelKey: string,
  ) {
    const provider = this.currentConfig.modelProviders.find(
      (p) => p.id === providerId,
    );

    if (!provider) throw new Error('Invalid provider id');

    provider.chatModels = provider.chatModels.filter(
      (m) => m.key !== modelKey,
    );
  }

  public addMCPServer(type: string, name: string, config: any) {
    const hash = hashObj(config);

    const newMCPServer: MCPServerConfig = {
      id: hash,
      name,
      type,
      config,
      enabled: true,
      hash: hash,
    };

    this.currentConfig.mcpServers.push(newMCPServer);

    return newMCPServer;
  }

  public removeMCPServer(id: string) {
    const index = this.currentConfig.mcpServers.findIndex((s) => s.id === id);

    if (index === -1) return;

    this.currentConfig.mcpServers = this.currentConfig.mcpServers.filter(
      (s) => s.id !== id,
    );
  }

  public async updateMCPServer(id: string, name: string, config: any) {
    const server = this.currentConfig.mcpServers.find((s) => {
      return s.id === id;
    });

    if (!server) throw new Error('MCP Server not found');

    server.name = name;
    server.config = config;

    return server;
  }

  public toggleMCPServer(id: string, enabled: boolean) {
    const server = this.currentConfig.mcpServers.find((s) => s.id === id);

    if (!server) throw new Error('MCP Server not found');

    server.enabled = enabled;

    return server;
  }

  public isSetupComplete() {
    return this.currentConfig.setupComplete;
  }

  public markSetupComplete() {
    if (!this.currentConfig.setupComplete) {
      this.currentConfig.setupComplete = true;
    }
  }

  public getUIConfigSections(): UIConfigSections {
    return this.uiConfigSections;
  }

  public getCurrentConfig(): Config {
    return JSON.parse(JSON.stringify(this.currentConfig));
  }
}

const configManager = new ConfigManager();

export default configManager;
