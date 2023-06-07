import type {
  ChainModifiers,
  Entry,
  EntryFieldTypes,
  EntrySkeletonType,
  LocaleCode
} from "contentful";
import type { TypeTitleWithContentSkeleton } from "./TypeTitleWithContent";

export interface TypeTabsOrAccordionSectionFields {
  name: EntryFieldTypes.Symbol;
  title?: EntryFieldTypes.Symbol;
  description?: EntryFieldTypes.Text;
  items: EntryFieldTypes.Array<
    EntryFieldTypes.EntryLink<TypeTitleWithContentSkeleton>
  >;
  type: EntryFieldTypes.Symbol<"Accordion" | "Tabs">;
}

export type TypeTabsOrAccordionSectionSkeleton = EntrySkeletonType<
  TypeTabsOrAccordionSectionFields,
  "tabsOrAccordionSection"
>;
export type TypeTabsOrAccordionSection<
  Modifiers extends ChainModifiers,
  Locales extends LocaleCode
> = Entry<TypeTabsOrAccordionSectionSkeleton, Modifiers, Locales>;
