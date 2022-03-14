import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypeNavigationSkeleton } from "./TypeNavigation";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";
import type { TypeResourceSkeleton } from "./TypeResource";
import type { TypeShareWidgetSectionSkeleton } from "./TypeShareWidgetSection";
import type { TypeSignupBlockSkeleton } from "./TypeSignupBlock";
import type { TypeSpecificationNotesSkeleton } from "./TypeSpecificationNotes";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";

export interface TypeResourcesFields {
  title: EntryFieldTypes.Symbol;
  microCopy?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeResourceSkeleton>
  >;
  pdpSidebarItems: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeTitleWithContentSkeleton>
  >;
  pdpCardsTitle?: EntryFieldTypes.Symbol;
  pdpCards?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContactUsPageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
      | TypePromoSkeleton
    >
  >;
  pdpExploreBar?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
  pdpShareWidget?: EntryFieldTypes.EntryLink<TypeShareWidgetSectionSkeleton>;
  errorFourOFour?: EntryFieldTypes.EntryLink<TypePromoSkeleton>;
  errorGeneral?: EntryFieldTypes.EntryLink<TypePromoSkeleton>;
  searchPageSearchTips?: EntryFieldTypes.EntryLink<TypeTitleWithContentSkeleton>;
  searchPageSidebarItems?: EntryFieldTypes.EntryLink<TypeTitleWithContentSkeleton>;
  searchPageNextBestActions?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeContactUsPageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
      | TypePromoSkeleton
    >
  >;
  searchPageExploreBar?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
  welcomeDialogTitle?: EntryFieldTypes.Symbol;
  welcomeDialogBrands?: EntryFieldTypes.Array<
    EntryFieldTypes.Symbol<
      | "AeroDek"
      | "Awak"
      | "Braas"
      | "Bramac"
      | "Cobert"
      | "Coverland"
      | "Esha"
      | "Everguard"
      | "Everlite"
      | "Icopal"
      | "Monarflex"
      | "Monarplan"
      | "Monier"
      | "Necoflex"
      | "Ormax"
      | "Redland"
      | "Sealoflex"
      | "Siplast"
      | "Sunscape"
      | "Vedag"
      | "Villas"
      | "Wierer"
      | "Wolfin"
      | "Zanda"
    >
  >;
  welcomeDialogBody?: EntryFieldTypes.RichText;
  productDocumentNameMap?: EntryFieldTypes.Symbol<
    "Document name" | "Product name + asset type"
  >;
  visualiserShareWidget?: EntryFieldTypes.EntryLink<TypeShareWidgetSectionSkeleton>;
  sdpShareWidget?: EntryFieldTypes.EntryLink<TypeShareWidgetSectionSkeleton>;
  countryNavigationIntroduction: EntryFieldTypes.RichText;
  sdpLeadBlockCta?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  sdpSidebarItems?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeTitleWithContentSkeleton>
  >;
  sdpBimDescription?: EntryFieldTypes.RichText;
  maximumSamples?: EntryFieldTypes.Number;
  sampleBasketLink?: EntryFieldTypes.EntryLink<TypePageSkeleton>;
  keyAssetTypes?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  pdpFixingToolTitle?: EntryFieldTypes.Symbol;
  pdpFixingToolDescription?: EntryFieldTypes.RichText;
  pdpSpecificationTitle?: EntryFieldTypes.Symbol;
  pdpSpecificationDescription?: EntryFieldTypes.RichText;
  documentDisplayFormat: EntryFieldTypes.Symbol<"Asset name" | "Asset type">;
  pdpSignupBlock?: EntryFieldTypes.EntryLink<TypeSignupBlockSkeleton>;
  sdpSpecificationNotesCta?: EntryFieldTypes.EntryLink<TypeSpecificationNotesSkeleton>;
  ieDialogTitle?: EntryFieldTypes.Symbol;
  ieDialogBody?: EntryFieldTypes.RichText;
  ieDialogActionLabel?: EntryFieldTypes.Symbol;
  ieDialogActionLink?: EntryFieldTypes.Symbol;
}

export type TypeResourcesSkeleton = EntrySkeletonType<
  TypeResourcesFields,
  "resources"
>;
export type TypeResources<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeResourcesSkeleton, Modifiers, Locales>;
