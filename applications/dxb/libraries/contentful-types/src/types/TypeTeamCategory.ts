import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeTeamMemberSkeleton } from "./TypeTeamMember";

export interface TypeTeamCategoryFields {
  name: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  teamMembers?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeTeamMemberSkeleton>
  >;
}

export type TypeTeamCategorySkeleton = EntrySkeletonType<
  TypeTeamCategoryFields,
  "teamCategory"
>;
export type TypeTeamCategory<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTeamCategorySkeleton, Modifiers, Locales>;
