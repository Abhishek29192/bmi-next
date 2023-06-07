import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeLinkSkeleton } from "./TypeLink";

export interface TypeFormFields {
  name: EntryFieldTypes.Symbol;
  title: EntryFieldTypes.Symbol;
  showTitle?: EntryFieldTypes.Boolean;
  description?: EntryFieldTypes.RichText;
  source: EntryFieldTypes.Symbol<"Contentful" | "HubSpot">;
  recipients?: EntryFieldTypes.Symbol;
  inputs?: EntryFieldTypes.Object;
  submitText?: EntryFieldTypes.Symbol;
  successRedirect?: EntryFieldTypes.EntryLink<TypeLinkSkeleton>;
  hubSpotFormGuid?: EntryFieldTypes.Symbol;
  emailSubjectFormat?: EntryFieldTypes.Symbol;
}

export type TypeFormSkeleton = EntrySkeletonType<TypeFormFields, "form">;
export type TypeForm<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeFormSkeleton, Modifiers, Locales>;
