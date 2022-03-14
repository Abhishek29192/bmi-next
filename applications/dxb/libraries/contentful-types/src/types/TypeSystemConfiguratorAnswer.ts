import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeSystemConfiguratorQuestionSkeleton } from "./TypeSystemConfiguratorQuestion";
import type { TypeSystemConfiguratorResultSkeleton } from "./TypeSystemConfiguratorResult";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";

export interface TypeSystemConfiguratorAnswerFields {
  label: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  nextStep: EntryFieldTypes.EntryLink<
    | TypeSystemConfiguratorQuestionSkeleton
    | TypeSystemConfiguratorResultSkeleton
    | TypeTitleWithContentSkeleton
  >;
}

export type TypeSystemConfiguratorAnswerSkeleton = EntrySkeletonType<
  TypeSystemConfiguratorAnswerFields,
  "systemConfiguratorAnswer"
>;
export type TypeSystemConfiguratorAnswer<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSystemConfiguratorAnswerSkeleton, Modifiers, Locales>;
