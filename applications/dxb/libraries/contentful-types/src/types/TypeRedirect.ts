import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeRedirectFields {
  from: EntryFieldTypes.Symbol;
  to: EntryFieldTypes.Symbol;
  isPermanent: EntryFieldTypes.Boolean;
}

export type TypeRedirectSkeleton = EntrySkeletonType<
  TypeRedirectFields,
  "redirect"
>;
export type TypeRedirect<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeRedirectSkeleton, Modifiers, Locales>;
