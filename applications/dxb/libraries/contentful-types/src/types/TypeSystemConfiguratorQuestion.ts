import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeSystemConfiguratorAnswerSkeleton } from "./TypeSystemConfiguratorAnswer";

export interface TypeSystemConfiguratorQuestionFields {
  label: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.RichText;
  answers: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeSystemConfiguratorAnswerSkeleton>
  >;
}

export type TypeSystemConfiguratorQuestionSkeleton = EntrySkeletonType<
  TypeSystemConfiguratorQuestionFields,
  "systemConfiguratorQuestion"
>;
export type TypeSystemConfiguratorQuestion<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSystemConfiguratorQuestionSkeleton, Modifiers, Locales>;
