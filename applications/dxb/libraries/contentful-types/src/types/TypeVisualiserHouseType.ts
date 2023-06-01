import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeVisualiserHouseTypeFields {
  name: EntryFieldTypes.Symbol;
  previewImage: EntryFieldTypes.AssetLink;
  houseModel: EntryFieldTypes.AssetLink;
}

export type TypeVisualiserHouseTypeSkeleton = EntrySkeletonType<
  TypeVisualiserHouseTypeFields,
  "visualiserHouseType"
>;
export type TypeVisualiserHouseType<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeVisualiserHouseTypeSkeleton, Modifiers, Locales>;
