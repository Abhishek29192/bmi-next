import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeBrandLandingPageSkeleton } from "./TypeBrandLandingPage";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeDocumentLibraryPageSkeleton } from "./TypeDocumentLibraryPage";
import type { TypeFormSkeleton } from "./TypeForm";
import type { TypeHomePageSkeleton } from "./TypeHomePage";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";

export interface TypeSampleBasketFields {
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  checkoutFormSection?: EntryFieldTypes.EntryLink<TypeFormSkeleton>;
  emptyBasketMessage: EntryFieldTypes.RichText;
  browseProductsCTALabel: EntryFieldTypes.Symbol;
  browseProductsCTA: EntryFieldTypes.EntryLink<
    | TypeBrandLandingPageSkeleton
    | TypeContactUsPageSkeleton
    | TypeDocumentLibraryPageSkeleton
    | TypeHomePageSkeleton
    | TypePageSkeleton
    | TypeProductListerPageSkeleton
  >;
}

export type TypeSampleBasketSkeleton = EntrySkeletonType<
  TypeSampleBasketFields,
  "sampleBasket"
>;
export type TypeSampleBasket<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSampleBasketSkeleton, Modifiers, Locales>;
