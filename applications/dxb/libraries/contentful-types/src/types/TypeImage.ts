import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

type FocalPoint = {
  focalPoint: {
    x: number;
    y: number;
  };
};

export interface TypeImageFields {
  title: EntryFieldTypes.Symbol;
  image: EntryFieldTypes.AssetLink;
  type?: EntryFieldTypes.Symbol<"Decorative" | "Descriptive">;
  focalPoint?: EntryFieldTypes.Object<FocalPoint>;
  altText: EntryFieldTypes.Symbol;
  caption?: EntryFieldTypes.Text;
}

export type TypeImageSkeleton = EntrySkeletonType<TypeImageFields, "image">;
export type TypeImage<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeImageSkeleton, Modifiers, Locales>;
