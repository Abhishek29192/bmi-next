import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

export interface TypeLeadBlockSectionFields {
  title: EntryFieldTypes.Symbol;
  text: EntryFieldTypes.RichText;
  link?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  postItCard?: EntryFieldTypes.RichText;
}

export type TypeLeadBlockSectionSkeleton = EntrySkeletonType<
  TypeLeadBlockSectionFields,
  "leadBlockSection"
>;
export type TypeLeadBlockSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeLeadBlockSectionSkeleton, Modifiers, Locales>;
