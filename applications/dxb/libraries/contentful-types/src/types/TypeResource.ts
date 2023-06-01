import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeResourceFields {
  key: EntryFieldTypes.Symbol;
  value: EntryFieldTypes.Symbol;
}

export type TypeResourceSkeleton = EntrySkeletonType<
  TypeResourceFields,
  "resource"
>;
export type TypeResource<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeResourceSkeleton, Modifiers, Locales>;
