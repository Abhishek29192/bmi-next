import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeContactDetailsSkeleton } from "./TypeContactDetails";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";

export interface TypeContentTopicFields {
  icon: EntryFieldTypes.Symbol<
    | "build"
    | "findReplace"
    | "help"
    | "info"
    | "localShipping"
    | "reportProblem"
    | "shoppingCart"
    | "verifiedUser"
  >;
  title: EntryFieldTypes.Symbol;
  bodyTitle?: EntryFieldTypes.Symbol;
  bodyList?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeTitleWithContentSkeleton>
  >;
  footerTitle?: EntryFieldTypes.Symbol;
  footerList?: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<
      TypeContactDetailsSkeleton | TypeTitleWithContentSkeleton
    >
  >;
}

export type TypeContentTopicSkeleton = EntrySkeletonType<
  TypeContentTopicFields,
  "contentTopic"
>;
export type TypeContentTopic<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeContentTopicSkeleton, Modifiers, Locales>;
