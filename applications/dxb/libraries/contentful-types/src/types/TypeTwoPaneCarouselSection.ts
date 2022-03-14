import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypePageSkeleton } from "./TypePage";
import type { TypePromoSkeleton } from "./TypePromo";

export interface TypeTwoPaneCarouselSectionFields {
  title: EntryFieldTypes.Symbol;
  slides: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContactUsPageSkeleton | TypePageSkeleton | TypePromoSkeleton
    >
  >;
  link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
}

export type TypeTwoPaneCarouselSectionSkeleton = EntrySkeletonType<
  TypeTwoPaneCarouselSectionFields,
  "twoPaneCarouselSection"
>;
export type TypeTwoPaneCarouselSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTwoPaneCarouselSectionSkeleton, Modifiers, Locales>;
