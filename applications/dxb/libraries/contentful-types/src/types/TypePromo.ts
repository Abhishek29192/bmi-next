import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypeLinkSkeleton } from "./TypeLink";
import type { TypeTagSkeleton } from "./TypeTag";
import type { TypeVideoSkeleton } from "./TypeVideo";

export interface TypePromoFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
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
  body?: EntryFieldTypes.RichText;
  cta?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  tags?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeTagSkeleton>>;
  backgroundColor?: EntryFieldTypes.Symbol<"Alabaster" | "White">;
}

export type TypePromoSkeleton = EntrySkeletonType<TypePromoFields, "promo">;
export type TypePromo<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypePromoSkeleton, Modifiers, Locales>;
