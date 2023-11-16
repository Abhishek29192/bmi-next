import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeCardCollectionSectionSkeleton } from "./TypeCardCollectionSection";
import type { TypeCarouselSectionSkeleton } from "./TypeCarouselSection";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeDocumentLibraryPageSkeleton } from "./TypeDocumentLibraryPage";
import type { TypeHomePageSkeleton } from "./TypeHomePage";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";
import type { TypeSeoContentSkeleton } from "./TypeSeoContent";
import type { TypeSignupBlockSkeleton } from "./TypeSignupBlock";
import type { TypeTagSkeleton } from "./TypeTag";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";
import type { TypeVillainSectionSkeleton } from "./TypeVillainSection";

export interface TypeBrandLandingPageFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  subtitle: EntryFieldTypes.Symbol;
  description: EntryFieldTypes.Text;
  cta?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  brandLogo: EntryFieldTypes.Symbol<
    | "AeroDek"
    | "Awak"
    | "BMIAcademyDE"
    | "BMIAcademyEN"
    | "Braas"
    | "Bramac"
    | "Canopia"
    | "Cementegola"
    | "Chova"
    | "Cobert"
    | "Coverland"
    | "Esha"
    | "Everguard"
    | "Everlite"
    | "Icopal"
    | "IcopalKatto"
    | "IcopalVedag"
    | "Klober"
    | "Monarflex"
    | "Monarplan"
    | "Monier"
    | "Necoflex"
    | "Ormax"
    | "Redland"
    | "RoofPro"
    | "RoofProServiceTeam"
    | "Sealoflex"
    | "SereniCoperture"
    | "Siplast"
    | "Sunscape"
    | "Vedag"
    | "Villas"
    | "Wierer"
    | "Wolfin"
    | "Zanda"
  >;
  featuredImage?: EntryFieldTypes.AssetLink;
  featuredMedia: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
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
  sections: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeCardCollectionSectionSkeleton
      | TypeCarouselSectionSkeleton
      | TypeSignupBlockSkeleton
      | TypeTitleWithContentSkeleton
      | TypeVillainSectionSkeleton
    >
  >;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeTagSkeleton>>;
  seo?: EntryFieldTypes.EntryLink<TypeSeoContentSkeleton>;
  parentPage?: EntryFieldTypes.EntryLink<
    | TypeBrandLandingPageSkeleton
    | TypeContactUsPageSkeleton
    | TypeDocumentLibraryPageSkeleton
    | TypeHomePageSkeleton
    | TypePageSkeleton
    | TypeProductListerPageSkeleton
  >;
  breadcrumbTitle?: EntryFieldTypes.Symbol;
  signupBlock?: EntryFieldTypes.EntryLink<TypeSignupBlockSkeleton>;
}

export type TypeBrandLandingPageSkeleton = EntrySkeletonType<
  TypeBrandLandingPageFields,
  "brandLandingPage"
>;
export type TypeBrandLandingPage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeBrandLandingPageSkeleton, Modifiers, Locales>;
