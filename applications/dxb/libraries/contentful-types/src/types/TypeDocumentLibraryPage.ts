import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeAssetTypeSkeleton } from "./TypeAssetType";
import type { TypeBrandLandingPageSkeleton } from "./TypeBrandLandingPage";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypeHomePageSkeleton } from "./TypeHomePage";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypeSeoContentSkeleton } from "./TypeSeoContent";
import type { TypeSignupBlockSkeleton } from "./TypeSignupBlock";
import type { TypeTagSkeleton } from "./TypeTag";

export interface TypeDocumentLibraryPageFields {
  name: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  slug: EntryFieldTypes.Symbol;
  subtitle?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  source: EntryFieldTypes.Symbol<"ALL" | "CMS" | "PIM">;
  assetTypes?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeAssetTypeSkeleton>
  >;
  categoryCodes?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  allowFilterBy?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
  resultsType: EntryFieldTypes.Symbol<
    "Card Collection" | "Simple Archive" | "Simple" | "Technical"
  >;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeTagSkeleton>>;
  pimCodes?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
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

export type TypeDocumentLibraryPageSkeleton = EntrySkeletonType<
  TypeDocumentLibraryPageFields,
  "documentLibraryPage"
>;
export type TypeDocumentLibraryPage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeDocumentLibraryPageSkeleton, Modifiers, Locales>;
