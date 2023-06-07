import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeTagFields {
  title: EntryFieldTypes.Symbol;
  type: EntryFieldTypes.Symbol<"Group" | "Page type">;
}

export type TypeTagSkeleton = EntrySkeletonType<TypeTagFields, "tag">;
export type TypeTag<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTagSkeleton, Modifiers, Locales>;
