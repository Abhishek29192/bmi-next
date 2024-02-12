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
import type { TypeNavigationSkeleton } from "./TypeNavigation";
import type { TypePageSkeleton } from "./TypePage";
import type { TypeProductListerPageSkeleton } from "./TypeProductListerPage";
import type { TypeRedirectSkeleton } from "./TypeRedirect";
import type { TypeResourcesSkeleton } from "./TypeResources";
import type { TypeVisualiserHouseTypeSkeleton } from "./TypeVisualiserHouseType";
import type { TypeWebToolCalculatorSkeleton } from "./TypeWebToolCalculator";

export interface TypeSiteFields {
  countryCode: EntryFieldTypes.Symbol;
  menuUtilities?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
  menuNavigation: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
  homePage: EntryFieldTypes.EntryLink<TypeHomePageSkeleton>;
  pages?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      | TypeBrandLandingPageSkeleton
      | TypeContactUsPageSkeleton
      | TypeDocumentLibraryPageSkeleton
      | TypeHomePageSkeleton
      | TypePageSkeleton
      | TypeProductListerPageSkeleton
    >
  >;
  footerMainNavigation?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
  footerSecondaryNavigation?: EntryFieldTypes.EntryLink<TypeNavigationSkeleton>;
  resources?: EntryFieldTypes.EntryLink<TypeResourcesSkeleton>;
  pitchedRoofCalculatorConfig?: EntryFieldTypes.EntryLink<TypeWebToolCalculatorSkeleton>;
  visualiserHouseTypes?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeVisualiserHouseTypeSkeleton>
  >;
  redirects?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeRedirectSkeleton>
  >;
}

export type TypeSiteSkeleton = EntrySkeletonType<TypeSiteFields, "site">;
export type TypeSite<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSiteSkeleton, Modifiers, Locales>;
