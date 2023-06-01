import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeContactDetailsFields {
  title: EntryFieldTypes.Symbol;
  address?: EntryFieldTypes.Symbol;
  email?: EntryFieldTypes.Symbol;
  phoneNumber?: EntryFieldTypes.Symbol;
  otherInformation?: EntryFieldTypes.RichText;
}

export type TypeContactDetailsSkeleton = EntrySkeletonType<
  TypeContactDetailsFields,
  "contactDetails"
>;
export type TypeContactDetails<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeContactDetailsSkeleton, Modifiers, Locales>;
