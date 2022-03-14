import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeDocumentLibraryPageSkeleton } from "./TypeDocumentLibraryPage";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypeNavigationItemSkeleton } from "./TypeNavigationItem";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";

export interface TypeNavigationFields {
  title: EntryFieldTypes.Symbol;
  label: EntryFieldTypes.Symbol;
  links: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeLinkSkeleton | TypeNavigationItemSkeleton | TypeNavigationSkeleton
    >
  >;
  link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  promo?: EntryFieldTypes.EntryLink<
    | TypeContactUsPageSkeleton
    | TypeDocumentLibraryPageSkeleton
    | TypePageSkeleton
    | TypeProductListerPageSkeleton
    | TypePromoSkeleton
  >;
  promos?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContactUsPageSkeleton
      | TypeDocumentLibraryPageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
      | TypePromoSkeleton
    >
  >;
}

export type TypeNavigationSkeleton = EntrySkeletonType<
  TypeNavigationFields,
  "navigation"
>;
export type TypeNavigation<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeNavigationSkeleton, Modifiers, Locales>;
