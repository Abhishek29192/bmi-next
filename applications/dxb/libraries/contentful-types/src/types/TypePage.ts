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
import type { TypeIframeSkeleton } from "./TypeIframe";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypeImageGallerySectionSkeleton } from "./TypeImageGallerySection";
import type { TypeLeadBlockSectionSkeleton } from "./TypeLeadBlockSection";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypeLinkColumnsSectionSkeleton } from "./TypeLinkColumnsSection";
import type { TypeNavigationSkeleton } from "./TypeNavigation";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";
import type { TypeSampleBasketSkeleton } from "./TypeSampleBasket";
import type { TypeSeoContentSkeleton } from "./TypeSeoContent";
import type { TypeServiceLocatorSectionSkeleton } from "./TypeServiceLocatorSection";
import type { TypeShareWidgetSectionSkeleton } from "./TypeShareWidgetSection";
import type { TypeSignupBlockSkeleton } from "./TypeSignupBlock";
import type { TypeSystemConfiguratorSectionSkeleton } from "./TypeSystemConfiguratorSection";
import type { TypeTabsOrAccordionSectionSkeleton } from "./TypeTabsOrAccordionSection";
import type { TypeTagSkeleton } from "./TypeTag";
import type { TypeTeamSectionSkeleton } from "./TypeTeamSection";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";
import type { TypeVideoSkeleton } from "./TypeVideo";
import type { TypeVideoSectionSkeleton } from "./TypeVideoSection";
import type { TypeVillainSectionSkeleton } from "./TypeVillainSection";

export interface TypePageFields {
  name: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  featuredImage?: EntryFieldTypes.AssetLink;
  featuredMedia?: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
  featuredVideo?: EntryFieldTypes.EntryLink<TypeVideoSkeleton>;
  brandLogo?: EntryFieldTypes.Symbol<
    | "AeroDek"
    | "Awak"
    | "BMIAcademyDE"
    | "BMIAcademyEN"
    | "Braas"
    | "Bramac"
    | "Canopia"
    | "Cobert"
    | "Coverland"
    | "Esha"
    | "Everguard"
    | "Everlite"
    | "Icopal"
    | "IcopalKatto"
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
    | "Siplast"
    | "Sunscape"
    | "Vedag"
    | "Villas"
    | "Wierer"
    | "Wolfin"
    | "Zanda"
  >;
  subtitle?: EntryFieldTypes.Text;
  heroType: EntryFieldTypes.Symbol<
    "Hierarchy" | "Level 1" | "Level 2" | "Level 3" | "Spotlight"
  >;
  cta?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  shareWidget?: EntryFieldTypes.EntryLink<TypeShareWidgetSectionSkeleton>;
  leadBlock?: EntryFieldTypes.EntryLink<TypeLeadBlockSectionSkeleton>;
  date?: EntryFieldTypes.Date;
  sections?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeCardCollectionSectionSkeleton
      | TypeCarouselSectionSkeleton
      | TypeDocumentDownloadSectionSkeleton
      | TypeFormSkeleton
      | TypeIframeSkeleton
      | TypeImageGallerySectionSkeleton
      | TypeNavigationSkeleton
      | TypePromoSkeleton
      | TypeSampleBasketSkeleton
      | TypeServiceLocatorSectionSkeleton
      | TypeShareWidgetSectionSkeleton
      | TypeSignupBlockSkeleton
      | TypeSystemConfiguratorSectionSkeleton
      | TypeTabsOrAccordionSectionSkeleton
      | TypeTeamSectionSkeleton
      | TypeTitleWithContentSkeleton
      | TypeVideoSectionSkeleton
      | TypeVillainSectionSkeleton
    >
  >;
  linkColumns?: EntryFieldTypes.EntryLink<TypeLinkColumnsSectionSkeleton>;
  nextBestActions?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContactUsPageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
      | TypePromoSkeleton
    >
  >;
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
  subtitleShortText?: EntryFieldTypes.Symbol;
  breadcrumbTitle?: EntryFieldTypes.Symbol;
  signupBlock?: EntryFieldTypes.EntryLink<TypeSignupBlockSkeleton>;
}

export type TypePageSkeleton = EntrySkeletonType<TypePageFields, "page">;
export type TypePage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypePageSkeleton, Modifiers, Locales>;
