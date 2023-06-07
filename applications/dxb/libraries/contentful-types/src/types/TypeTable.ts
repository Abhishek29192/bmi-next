import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeTableFields {
  title: EntryFieldTypes.Text;
  data?: EntryFieldTypes.Object;
}

export type TypeTableSkeleton = EntrySkeletonType<TypeTableFields, "table">;
export type TypeTable<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTableSkeleton, Modifiers, Locales>;
