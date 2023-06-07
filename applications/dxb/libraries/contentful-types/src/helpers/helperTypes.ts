import { Asset, Entry } from "contentful";

export type EntryPartial<E extends Entry> = Partial<Omit<E, "fields">> & {
  fields?: Partial<E["fields"]>;
};

export type AssetPartial<E extends Asset> = Partial<Omit<E, "fields">> & {
  fields?: Partial<E["fields"]>;
};
