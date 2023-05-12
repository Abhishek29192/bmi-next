import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

export interface TypeSpecificationNotesFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  cta?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
}

export type TypeSpecificationNotesSkeleton = EntrySkeletonType<
  TypeSpecificationNotesFields,
  "specificationNotes"
>;
export type TypeSpecificationNotes<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSpecificationNotesSkeleton, Modifiers, Locales>;
