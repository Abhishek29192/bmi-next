import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeContactUsPageSkeleton } from "./TypeContactUsPage";
import type { TypePageSkeleton } from "./TypePage";
import type { TypePromoSkeleton } from "./TypePromo";

export interface TypeVillainSectionFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.Text;
  isReversed: EntryFieldTypes.Boolean;
  villains: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContactUsPageSkeleton | TypePageSkeleton | TypePromoSkeleton
    >
  >;
}

export type TypeVillainSectionSkeleton = EntrySkeletonType<
  TypeVillainSectionFields,
  "villainSection"
>;
export type TypeVillainSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeVillainSectionSkeleton, Modifiers, Locales>;
