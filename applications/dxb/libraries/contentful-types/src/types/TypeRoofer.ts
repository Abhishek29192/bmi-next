import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypeServiceTypeSkeleton } from "./TypeServiceType";

export interface TypeRooferFields {
  entryType: EntryFieldTypes.Symbol<"Branch" | "Merchant" | "Roofer">;
  name: EntryFieldTypes.Symbol;
  location: EntryFieldTypes.Location;
  address: EntryFieldTypes.Symbol;
  phone?: EntryFieldTypes.Symbol;
  email?: EntryFieldTypes.Symbol;
  website?: EntryFieldTypes.Symbol;
  facebook?: EntryFieldTypes.Symbol;
  twitter?: EntryFieldTypes.Symbol;
  instagram?: EntryFieldTypes.Symbol;
  linkedIn?: EntryFieldTypes.Symbol;
  websiteLinkAsLabel?: EntryFieldTypes.Boolean;
  fax?: EntryFieldTypes.Symbol;
  companyLogo?: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
  type?: EntryFieldTypes.Array<
    EntryFieldTypes.Symbol<
      | "7° Dachdecker"
      | "Bauwerksabdichtung"
      | "Flachdachsysteme"
      | "Flat roof"
      | "Händler"
      | "Pitched roof - Bitumen roofs"
      | "Pitched roof - Roof coaters"
      | "Pitched roof - Tile roofs"
      | "Pitched roof"
      | "Steildachsysteme"
      | "TopDach Partner"
      | "Verarbeiter"
      | "Verkehrsbauwerke"
    >
  >;
  branchType?: EntryFieldTypes.Array<
    EntryFieldTypes.Symbol<
      | "Country offices"
      | "Headquarters"
      | "Manufacturing and export"
      | "Technical centre & BMI academy"
    >
  >;
  merchantType?: EntryFieldTypes.Array<
    EntryFieldTypes.Symbol<
      | "BMI Icopal Flat roof Systems"
      | "BMI Redland Pitched roof systems"
      | "Distributeurs Monier"
      | "Distributeurs Siplast"
      | "Dépôts de proximité Siplast"
    >
  >;
  serviceTypes?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeServiceTypeSkeleton>
  >;
  certification?: EntryFieldTypes.Symbol<"Elite" | "Expert" | "Partner">;
  summary?: EntryFieldTypes.Symbol;
}

export type TypeRooferSkeleton = EntrySkeletonType<TypeRooferFields, "roofer">;
export type TypeRoofer<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeRooferSkeleton, Modifiers, Locales>;
