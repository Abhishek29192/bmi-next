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
import type { TypeHomePageSkeleton } from "./TypeHomePage";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypeNavigationSkeleton } from "./TypeNavigation";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeSeoContentSkeleton } from "./TypeSeoContent";
import type { TypeSignupBlockSkeleton } from "./TypeSignupBlock";
import type { TypeTagSkeleton } from "./TypeTag";
import type { TypeVideoSkeleton } from "./TypeVideo";

export interface TypeProductListerPageFields {
  name: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  categoryCode?: EntryFieldTypes.Symbol;
  categoryCodes: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  allowFilterBy?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  brandLogo?: EntryFieldTypes.Symbol<
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
  featuredMedia?: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
  featuredVideo?: EntryFieldTypes.EntryLink<TypeVideoSkeleton>;
  subtitle?: EntryFieldTypes.Symbol;
  heroType: EntryFieldTypes.Symbol<
    "Hierarchy" | "Level 1" | "Level 2" | "Level 3" | "Spotlight"
  >;
  cta?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  content: EntryFieldTypes.RichText;
  features?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  featuresLink?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  exploreBar?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeTagSkeleton>>;
  parentPage?: EntryFieldTypes.EntryLink<
    | TypeBrandLandingPageSkeleton
    | TypeContactUsPageSkeleton
    | TypeDocumentLibraryPageSkeleton
    | TypeHomePageSkeleton
    | TypePageSkeleton
    | TypeProductListerPageSkeleton
  >;
  seo?: EntryFieldTypes.EntryLink<TypeSeoContentSkeleton>;
  breadcrumbTitle?: EntryFieldTypes.Symbol;
  signupBlock?: EntryFieldTypes.EntryLink<TypeSignupBlockSkeleton>;
}

export type TypeProductListerPageSkeleton = EntrySkeletonType<
  TypeProductListerPageFields,
  "productListerPage"
>;
export type TypeProductListerPage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeProductListerPageSkeleton, Modifiers, Locales>;
