import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeAssetTypeFields {
  name: EntryFieldTypes.Symbol;
  code: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  pimCode?: EntryFieldTypes.Symbol;
}

export type TypeAssetTypeSkeleton = EntrySkeletonType<
  TypeAssetTypeFields,
  "assetType"
>;
export type TypeAssetType<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeAssetTypeSkeleton, Modifiers, Locales>;
