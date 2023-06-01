import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeBrandSkeleton } from "./TypeBrand";
import type { TypeCardCollectionSectionSkeleton } from "./TypeCardCollectionSection";
import type { TypeCarouselSectionSkeleton } from "./TypeCarouselSection";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeIframeSkeleton } from "./TypeIframe";
import type { TypeLeadBlockSectionSkeleton } from "./TypeLeadBlockSection";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";
import type { TypeSeoContentSkeleton } from "./TypeSeoContent";
import type { TypeServiceLocatorSectionSkeleton } from "./TypeServiceLocatorSection";
import type { TypeSignupBlockSkeleton } from "./TypeSignupBlock";
import type { TypeTagSkeleton } from "./TypeTag";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";
import type { TypeVideoSectionSkeleton } from "./TypeVideoSection";
import type { TypeVillainSectionSkeleton } from "./TypeVillainSection";

export interface TypeHomePageFields {
  title: EntryFieldTypes.Symbol;
  slides: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContactUsPageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
      | TypePromoSkeleton
    >
  >;
  overlapCards?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeContactUsPageSkeleton | TypePageSkeleton>
  >;
  spaBrands?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeBrandSkeleton>
  >;
  sections?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeCardCollectionSectionSkeleton
      | TypeCarouselSectionSkeleton
      | TypeIframeSkeleton
      | TypeLeadBlockSectionSkeleton
      | TypePromoSkeleton
      | TypeServiceLocatorSectionSkeleton
      | TypeSignupBlockSkeleton
      | TypeTitleWithContentSkeleton
      | TypeVideoSectionSkeleton
      | TypeVillainSectionSkeleton
    >
  >;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeTagSkeleton>>;
  seo?: EntryFieldTypes.EntryLink<TypeSeoContentSkeleton>;
  signupBlock?: EntryFieldTypes.EntryLink<TypeSignupBlockSkeleton>;
}

export type TypeHomePageSkeleton = EntrySkeletonType<
  TypeHomePageFields,
  "homePage"
>;
export type TypeHomePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeHomePageSkeleton, Modifiers, Locales>;
