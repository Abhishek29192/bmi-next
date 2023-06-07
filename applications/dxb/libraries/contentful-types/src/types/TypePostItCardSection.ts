import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

export interface TypePostItCardSectionFields {
  title: EntryFieldTypes.Symbol;
  hasUnderline?: EntryFieldTypes.Boolean;
  description: EntryFieldTypes.Text;
  link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  linkType?: EntryFieldTypes.Symbol<"button" | "link">;
}

export type TypePostItCardSectionSkeleton = EntrySkeletonType<
  TypePostItCardSectionFields,
  "postItCardSection"
>;
export type TypePostItCardSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypePostItCardSectionSkeleton, Modifiers, Locales>;
