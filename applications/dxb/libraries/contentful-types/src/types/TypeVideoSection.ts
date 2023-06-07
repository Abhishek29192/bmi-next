import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeVideoSkeleton } from "./TypeVideo";

export interface TypeVideoSectionFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  video?: EntryFieldTypes.EntryLink<TypeVideoSkeleton>;
}

export type TypeVideoSectionSkeleton = EntrySkeletonType<
  TypeVideoSectionFields,
  "videoSection"
>;
export type TypeVideoSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeVideoSectionSkeleton, Modifiers, Locales>;
