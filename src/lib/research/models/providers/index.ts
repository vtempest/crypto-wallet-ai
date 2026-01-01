import { ModelProviderUISection } from '@/lib/config/types';
import { ProviderConstructor } from './baseProvider';
import OpenAIProvider from './openai';
import OllamaProvider from './ollama';
import AnthropicProvider from './anthropic';
import GeminiProvider from './gemini';
import GroqProvider from './groq';
import DeepSeekProvider from './deepseek';
import LMStudioProvider from './lmstudio';
import LemonadeProvider from './lemonade';

export const providers: Record<string, ProviderConstructor<any>> = {
  openai: OpenAIProvider,
  ollama: OllamaProvider,
  anthropic: AnthropicProvider,
  gemini: GeminiProvider,
  groq: GroqProvider,
  deepseek: DeepSeekProvider,
  lmstudio: LMStudioProvider,
  lemonade: LemonadeProvider,
};

export const getModelProvidersUIConfigSection =
  (): ModelProviderUISection[] => {
    return Object.entries(providers).map(([k, p]) => {
      const configFields = p.getProviderConfigFields();
      const metadata = p.getProviderMetadata();

      return {
        fields: configFields,
        key: k,
        name: metadata.name,
      };
    });
  };
