import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeCalculatorRoofShapeSkeleton } from "./TypeCalculatorRoofShape";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";

export interface TypeWebToolCalculatorFields {
  name?: EntryFieldTypes.Symbol;
  roofShapes: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeCalculatorRoofShapeSkeleton>
  >;
  hubSpotFormId?: EntryFieldTypes.Symbol;
  needHelpSection: EntryFieldTypes.EntryLink<TypeTitleWithContentSkeleton>;
}

export type TypeWebToolCalculatorSkeleton = EntrySkeletonType<
  TypeWebToolCalculatorFields,
  "webToolCalculator"
>;
export type TypeWebToolCalculator<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeWebToolCalculatorSkeleton, Modifiers, Locales>;
