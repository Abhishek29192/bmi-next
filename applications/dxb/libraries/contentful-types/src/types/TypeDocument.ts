import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeAssetTypeSkeleton } from "./TypeAssetType";
import type { TypeImageSkeleton } from "./TypeImage";

export interface TypeDocumentFields {
  title: EntryFieldTypes.Symbol;
  asset: EntryFieldTypes.AssetLink;
  description?: EntryFieldTypes.RichText;
  assetType: EntryFieldTypes.EntryLink<TypeAssetTypeSkeleton>;
  brand?: EntryFieldTypes.Symbol<
    | "AeroDek"
    | "Awak"
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
  image?: EntryFieldTypes.AssetLink;
  featuredMedia?: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
  noIndex?: EntryFieldTypes.Boolean;
}

export type TypeDocumentSkeleton = EntrySkeletonType<
  TypeDocumentFields,
  "document"
>;
export type TypeDocument<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeDocumentSkeleton, Modifiers, Locales>;
