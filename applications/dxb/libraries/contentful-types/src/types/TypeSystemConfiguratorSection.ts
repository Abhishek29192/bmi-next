import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeSystemConfiguratorQuestionSkeleton } from "./TypeSystemConfiguratorQuestion";

export interface TypeSystemConfiguratorSectionFields {
  label: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  question: EntryFieldTypes.EntryLink<TypeSystemConfiguratorQuestionSkeleton>;
}

export type TypeSystemConfiguratorSectionSkeleton = EntrySkeletonType<
  TypeSystemConfiguratorSectionFields,
  "systemConfiguratorSection"
>;
export type TypeSystemConfiguratorSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSystemConfiguratorSectionSkeleton, Modifiers, Locales>;
