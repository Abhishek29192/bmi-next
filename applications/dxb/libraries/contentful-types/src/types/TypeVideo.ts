import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeImageSkeleton } from "./TypeImage";

export interface TypeVideoFields {
  title: EntryFieldTypes.Symbol;
  label: EntryFieldTypes.Symbol;
  subtitle?: EntryFieldTypes.Symbol;
  youtubeId: EntryFieldTypes.Symbol;
  previewImage?: EntryFieldTypes.AssetLink;
  previewMedia?: EntryFieldTypes.EntryLink<TypeImageSkeleton>;
}

export type TypeVideoSkeleton = EntrySkeletonType<TypeVideoFields, "video">;
export type TypeVideo<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeVideoSkeleton, Modifiers, Locales>;
