import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeTeamCategorySkeleton } from "./TypeTeamCategory";

export interface TypeTeamSectionFields {
  name: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  teamCategories: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeTeamCategorySkeleton>
  >;
  backgroundColor?: EntryFieldTypes.Symbol<"Alabaster" | "White">;
}

export type TypeTeamSectionSkeleton = EntrySkeletonType<
  TypeTeamSectionFields,
  "teamSection"
>;
export type TypeTeamSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTeamSectionSkeleton, Modifiers, Locales>;
