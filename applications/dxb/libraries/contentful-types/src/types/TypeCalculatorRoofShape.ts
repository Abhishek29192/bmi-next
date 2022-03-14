import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";

export interface TypeCalculatorRoofShapeFields {
  name: EntryFieldTypes.Symbol;
  roofShapeId: EntryFieldTypes.Symbol;
  media: EntryFieldTypes.AssetLink;
}

export type TypeCalculatorRoofShapeSkeleton = EntrySkeletonType<
  TypeCalculatorRoofShapeFields,
  "calculatorRoofShape"
>;
export type TypeCalculatorRoofShape<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeCalculatorRoofShapeSkeleton, Modifiers, Locales>;
