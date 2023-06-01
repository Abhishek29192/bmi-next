import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeFormSkeleton } from "./TypeForm";

export interface TypeSignupBlockFields {
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.Text;
  signupLabel: EntryFieldTypes.Symbol;
  signupDialogContent: EntryFieldTypes.EntryLink<TypeFormSkeleton>;
}

export type TypeSignupBlockSkeleton = EntrySkeletonType<
  TypeSignupBlockFields,
  "signupBlock"
>;
export type TypeSignupBlock<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeSignupBlockSkeleton, Modifiers, Locales>;
