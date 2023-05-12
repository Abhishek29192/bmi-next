import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeImageSkeleton } from "./TypeImage";
import type { TypeVideoSkeleton } from "./TypeVideo";

export interface TypeImageGallerySectionFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.Text;
  images?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
  longDescription?: EntryFieldTypes.RichText;
  medias: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeImageSkeleton | TypeVideoSkeleton>
  >;
}

export type TypeImageGallerySectionSkeleton = EntrySkeletonType<
  TypeImageGallerySectionFields,
  "imageGallerySection"
>;
export type TypeImageGallerySection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeImageGallerySectionSkeleton, Modifiers, Locales>;
