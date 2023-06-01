import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeSystemConfiguratorResultFields {
  label: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  recommendedSystems: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
}

export type TypeSystemConfiguratorResultSkeleton = EntrySkeletonType<
  TypeSystemConfiguratorResultFields,
  "systemConfiguratorResult"
>;
export type TypeSystemConfiguratorResult<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSystemConfiguratorResultSkeleton, Modifiers, Locales>;
