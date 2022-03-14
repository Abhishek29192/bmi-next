import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypeLinkSkeleton } from "./TypeLink";

export interface TypeTeamMemberFields {
  name: EntryFieldTypes.Symbol;
  profilePicture?: EntryFieldTypes.AssetLink;
  profileImage: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
  jobTitle?: EntryFieldTypes.Symbol;
  links: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeLinkSkeleton>>;
}

export type TypeTeamMemberSkeleton = EntrySkeletonType<
  TypeTeamMemberFields,
  "teamMember"
>;
export type TypeTeamMember<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTeamMemberSkeleton, Modifiers, Locales>;
