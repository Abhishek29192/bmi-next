import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeTitleWithContentFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  content: EntryFieldTypes.RichText;
}

export type TypeTitleWithContentSkeleton = EntrySkeletonType<
  TypeTitleWithContentFields,
  "titleWithContent"
>;
export type TypeTitleWithContent<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTitleWithContentSkeleton, Modifiers, Locales>;
