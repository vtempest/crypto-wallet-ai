type Model = {
  name: string;
  key: string;
};

type ModelList = {
  chat: Model[];
};

type ProviderMetadata = {
  name: string;
  key: string;
};

type MinimalProvider = {
  id: string;
  name: string;
  chatModels: Model[];
};

type ModelWithProvider = {
  key?: string;
  providerId?: string;
};

export type {
  Model,
  ModelList,
  ProviderMetadata,
  MinimalProvider,
  ModelWithProvider,
};
