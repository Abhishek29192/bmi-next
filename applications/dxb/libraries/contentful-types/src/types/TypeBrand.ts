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
    | "BMIAcademyDE"
    | "BMIAcademyEN"
    | "Braas"
    | "Bramac"
    | "Canopia"
    | "Cementegola"
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
  subtitle?: EntryFieldTypes.Symbol;
  path?: EntryFieldTypes.Symbol;
}

export type TypeBrandSkeleton = EntrySkeletonType<TypeBrandFields, "brand">;
export type TypeBrand<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeBrandSkeleton, Modifiers, Locales>;
