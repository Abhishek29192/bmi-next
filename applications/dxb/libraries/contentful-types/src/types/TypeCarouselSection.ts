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
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";

export interface TypeCarouselSectionFields {
  name: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  variant: EntryFieldTypes.Symbol<"horizontal" | "vertical">;
  slides: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContactUsPageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
      | TypePromoSkeleton
    >
  >;
  link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
}

export type TypeCarouselSectionSkeleton = EntrySkeletonType<
  TypeCarouselSectionFields,
  "carouselSection"
>;
export type TypeCarouselSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeCarouselSectionSkeleton, Modifiers, Locales>;
