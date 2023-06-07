import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeSeoContentFields {
  title: EntryFieldTypes.Symbol;
  metaTitle?: EntryFieldTypes.Symbol;
  metaDescription?: EntryFieldTypes.Symbol;
  noIndex?: EntryFieldTypes.Boolean;
}

export type TypeSeoContentSkeleton = EntrySkeletonType<
  TypeSeoContentFields,
  "seoContent"
>;
export type TypeSeoContent<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSeoContentSkeleton, Modifiers, Locales>;
