import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeNavigationItemFields {
  title: EntryFieldTypes.Symbol;
  type: EntryFieldTypes.Symbol<"Heading" | "Separator">;
  value?: EntryFieldTypes.Symbol;
}

export type TypeNavigationItemSkeleton = EntrySkeletonType<
  TypeNavigationItemFields,
  "navigationItem"
>;
export type TypeNavigationItem<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeNavigationItemSkeleton, Modifiers, Locales>;
