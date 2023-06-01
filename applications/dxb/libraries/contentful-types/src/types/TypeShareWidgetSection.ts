import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeShareWidgetSectionFields {
  title: EntryFieldTypes.Symbol;
  message?: EntryFieldTypes.Symbol;
  clipboardSuccessMessage?: EntryFieldTypes.Symbol;
  clipboardErrorMessage?: EntryFieldTypes.Symbol;
  isLeftAligned?: EntryFieldTypes.Boolean;
  email?: EntryFieldTypes.Boolean;
  copy?: EntryFieldTypes.Boolean;
  linkedin?: EntryFieldTypes.Boolean;
  twitter?: EntryFieldTypes.Boolean;
  facebook?: EntryFieldTypes.Boolean;
  pinterest?: EntryFieldTypes.Boolean;
}

export type TypeShareWidgetSectionSkeleton = EntrySkeletonType<
  TypeShareWidgetSectionFields,
  "shareWidgetSection"
>;
export type TypeShareWidgetSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeShareWidgetSectionSkeleton, Modifiers, Locales>;
