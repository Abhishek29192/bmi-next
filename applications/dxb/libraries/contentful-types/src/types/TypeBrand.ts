import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeBrandFields {
  title: EntryFieldTypes.Symbol;
  brandLogo: EntryFieldTypes.Symbol<
    | "AeroDek"
    | "Awak"
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
  subtitle?: EntryFieldTypes.Symbol;
  path?: EntryFieldTypes.Symbol;
}

export type TypeBrandSkeleton = EntrySkeletonType<TypeBrandFields, "brand">;
export type TypeBrand<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeBrandSkeleton, Modifiers, Locales>;
