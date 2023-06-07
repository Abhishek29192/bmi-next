import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeNavigationSkeleton } from "./TypeNavigation";

export interface TypeLinkColumnsSectionFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  columns: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeNavigationSkeleton>
  >;
}

export type TypeLinkColumnsSectionSkeleton = EntrySkeletonType<
  TypeLinkColumnsSectionFields,
  "linkColumnsSection"
>;
export type TypeLinkColumnsSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeLinkColumnsSectionSkeleton, Modifiers, Locales>;
