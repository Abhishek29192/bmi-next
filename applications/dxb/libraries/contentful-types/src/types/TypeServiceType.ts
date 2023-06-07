import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeServiceTypeFields {
  name: EntryFieldTypes.Symbol;
}

export type TypeServiceTypeSkeleton = EntrySkeletonType<
  TypeServiceTypeFields,
  "serviceType"
>;
export type TypeServiceType<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeServiceTypeSkeleton, Modifiers, Locales>;
