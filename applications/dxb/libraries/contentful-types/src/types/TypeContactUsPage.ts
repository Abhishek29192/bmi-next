import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeBrandLandingPageSkeleton } from "./TypeBrandLandingPage";
import type { TypeCardCollectionSectionSkeleton } from "./TypeCardCollectionSection";
import type { TypeContactDetailsSkeleton } from "./TypeContactDetails";
import type { TypeContentTopicSkeleton } from "./TypeContentTopic";
import type { TypeDocumentLibraryPageSkeleton } from "./TypeDocumentLibraryPage";
import type { TypeHomePageSkeleton } from "./TypeHomePage";
import type { TypeIframeSkeleton } from "./TypeIframe";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypePromoSkeleton } from "./TypePromo";
import type { TypeSeoContentSkeleton } from "./TypeSeoContent";
import type { TypeServiceLocatorSectionSkeleton } from "./TypeServiceLocatorSection";
import type { TypeSignupBlockSkeleton } from "./TypeSignupBlock";
import type { TypeTabsOrAccordionSectionSkeleton } from "./TypeTabsOrAccordionSection";
import type { TypeTagSkeleton } from "./TypeTag";
import type { TypeVideoSkeleton } from "./TypeVideo";

export interface TypeContactUsPageFields {
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  subtitle?: EntryFieldTypes.Symbol;
  featuredImage?: EntryFieldTypes.AssetLink;
  featuredMedia: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
  featuredVideo?: EntryFieldTypes.EntryLink<TypeVideoSkeleton>;
  queriesTitle?: EntryFieldTypes.Symbol;
  queriesSubtitle?: EntryFieldTypes.Symbol;
  contentTopics?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeContentTopicSkeleton>
  >;
  sections?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeCardCollectionSectionSkeleton
      | TypeServiceLocatorSectionSkeleton
      | TypeSignupBlockSkeleton
      | TypeTabsOrAccordionSectionSkeleton
    >
  >;
  locationsTitle?: EntryFieldTypes.Symbol;
  locations?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeContactDetailsSkeleton>
  >;
  iframe?: EntryFieldTypes.EntryLink<TypeIframeSkeleton>;
  nextBestActions?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypePageSkeleton | TypeProductListerPageSkeleton | TypePromoSkeleton
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

export type TypeContactUsPageSkeleton = EntrySkeletonType<
  TypeContactUsPageFields,
  "contactUsPage"
>;
export type TypeContactUsPage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeContactUsPageSkeleton, Modifiers, Locales>;
