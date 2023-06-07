import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeMigrationFields {
  state: EntryFieldTypes.Object;
  contentTypeId: EntryFieldTypes.Symbol;
}

export type TypeMigrationSkeleton = EntrySkeletonType<
  TypeMigrationFields,
  "migration"
>;
export type TypeMigration<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeMigrationSkeleton, Modifiers, Locales>;
