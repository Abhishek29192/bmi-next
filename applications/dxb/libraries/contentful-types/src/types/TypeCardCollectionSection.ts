import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeDocumentLibraryPageSkeleton } from "./TypeDocumentLibraryPage";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";

export interface TypeCardCollectionSectionFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  cardType: EntryFieldTypes.Symbol<
    "Highlight Card" | "Story Card" | "Text Card"
  >;
  cardLabel?: EntryFieldTypes.Symbol;
  cards: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeDocumentLibraryPageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
      | TypePromoSkeleton
    >
  >;
  sortOrder?: EntryFieldTypes.Symbol<
    "Date (Newest first)" | "Date (Oldest first)" | "Default (Contentful)"
  >;
  groupCards?: EntryFieldTypes.Boolean;
  link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  justifyCenter?: EntryFieldTypes.Boolean;
  displaySingleRow?: EntryFieldTypes.Boolean;
}

export type TypeCardCollectionSectionSkeleton = EntrySkeletonType<
  TypeCardCollectionSectionFields,
  "cardCollectionSection"
>;
export type TypeCardCollectionSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeCardCollectionSectionSkeleton, Modifiers, Locales>;
