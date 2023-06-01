import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeServiceLocatorSectionFields {
  type: EntryFieldTypes.Symbol<"Branch" | "Merchant" | "Roofer">;
  showDefaultResultList?: EntryFieldTypes.Boolean;
  title: EntryFieldTypes.Symbol;
  label?: EntryFieldTypes.Symbol;
  body?: EntryFieldTypes.RichText;
  centre?: EntryFieldTypes.Location;
  zoom?: EntryFieldTypes.Integer;
}

export type TypeServiceLocatorSectionSkeleton = EntrySkeletonType<
  TypeServiceLocatorSectionFields,
  "serviceLocatorSection"
>;
export type TypeServiceLocatorSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeServiceLocatorSectionSkeleton, Modifiers, Locales>;
