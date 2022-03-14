import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeBrandLandingPageSkeleton } from "./TypeBrandLandingPage";
import type { TypeCardCollectionSectionSkeleton } from "./TypeCardCollectionSection";
import type { TypeCarouselSectionSkeleton } from "./TypeCarouselSection";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeDocumentDownloadSectionSkeleton } from "./TypeDocumentDownloadSection";
import type { TypeDocumentLibraryPageSkeleton } from "./TypeDocumentLibraryPage";
import type { TypeFormSkeleton } from "./TypeForm";
import type { TypeHomePageSkeleton } from "./TypeHomePage";
import type { TypeImageGallerySectionSkeleton } from "./TypeImageGallerySection";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";
import type { TypeVillainSectionSkeleton } from "./TypeVillainSection";

export interface TypeLinkFields {
  name: EntryFieldTypes.Symbol;
  label: EntryFieldTypes.Symbol;
  isLabelHidden?: EntryFieldTypes.Boolean;
  type: EntryFieldTypes.Symbol<
    | "Asset"
    | "Calculator"
    | "Dialog"
    | "External"
    | "HubSpot CTA"
    | "Internal"
    | "Visualiser"
  >;
  icon?: EntryFieldTypes.Symbol<
    | "AeroDek"
    | "Awak"
    | "BMI"
    | "BMI_Academy_DE"
    | "BMI_Academy_EN"
    | "Braas"
    | "Bramac"
    | "Canopia"
    | "Cobert"
    | "Coverland"
    | "Esha"
    | "Everguard"
    | "Everlite"
    | "Facebook"
    | "Icopal"
    | "IcopalKatto"
    | "Instagram"
    | "Klober"
    | "LinkedIn"
    | "Mail"
    | "Monarflex"
    | "Monarplan"
    | "Monier"
    | "Necoflex"
    | "Ormax"
    | "Phone"
    | "PhoneMobile"
    | "Redland"
    | "RoofPro"
    | "RoofProServiceTeam"
    | "Sealoflex"
    | "Siplast"
    | "Sunscape"
    | "Twitter"
    | "User"
    | "Vedag"
    | "Villas"
    | "Wierer"
    | "Wolfin"
    | "XING"
    | "YouTube"
    | "Zanda"
  >;
  linkedPage?: EntryFieldTypes.EntryLink<
    | TypeBrandLandingPageSkeleton
    | TypeContactUsPageSkeleton
    | TypeDocumentLibraryPageSkeleton
    | TypeHomePageSkeleton
    | TypePageSkeleton
    | TypeProductListerPageSkeleton
  >;
  queryParams?: EntryFieldTypes.Symbol;
  url?: EntryFieldTypes.Symbol;
  asset?: EntryFieldTypes.AssetLink;
  parameters?: EntryFieldTypes.Object;
  dialogContent?: EntryFieldTypes.EntryLink<
    | TypeCardCollectionSectionSkeleton
    | TypeCarouselSectionSkeleton
    | TypeDocumentDownloadSectionSkeleton
    | TypeFormSkeleton
    | TypeImageGallerySectionSkeleton
    | TypeTitleWithContentSkeleton
    | TypeVillainSectionSkeleton
  >;
  hubSpotCTAID?: EntryFieldTypes.Symbol;
}

export type TypeLinkSkeleton = EntrySkeletonType<TypeLinkFields, "link">;
export type TypeLink<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeLinkSkeleton, Modifiers, Locales>;
