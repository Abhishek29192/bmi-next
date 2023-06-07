import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeDocumentSkeleton } from "./TypeDocument";

export interface TypeDocumentDownloadSectionFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  documents: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeDocumentSkeleton>
  >;
}

export type TypeDocumentDownloadSectionSkeleton = EntrySkeletonType<
  TypeDocumentDownloadSectionFields,
  "documentDownloadSection"
>;
export type TypeDocumentDownloadSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeDocumentDownloadSectionSkeleton, Modifiers, Locales>;
