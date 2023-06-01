import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeIframeFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  summary?: EntryFieldTypes.RichText;
  url: EntryFieldTypes.Symbol;
  height: EntryFieldTypes.Symbol;
  allowCookieClasses?: EntryFieldTypes.Array<
    EntryFieldTypes.Symbol<
      | "Analytics"
      | "Functional"
      | "Performance"
      | "Social Media"
      | "Strictly Necessary"
      | "Targeting"
    >
  >;
}

export type TypeIframeSkeleton = EntrySkeletonType<TypeIframeFields, "iframe">;
export type TypeIframe<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeIframeSkeleton, Modifiers, Locales>;
