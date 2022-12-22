export type GeneratedObjectWithUrl = {
  catalog: string | undefined;
  variantCode: string;
  url: string;
};
export type PubSubMessage = GeneratedObjectWithUrl[];
