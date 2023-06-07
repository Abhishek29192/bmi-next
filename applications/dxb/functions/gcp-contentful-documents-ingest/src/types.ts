import type { TypeDocument } from "@bmi/contentful-types";
import type { Entry, EntrySkeletonType, EntrySys } from "contentful";

export type ContentfulDocument = TypeDocument<
  "WITH_ALL_LOCALES" | "WITHOUT_LINK_RESOLUTION",
  string
>;

export type DeletedEntry = Omit<
  Entry<EntrySkeletonType<Record<string, never>, string>>,
  "sys" | "fields"
> & {
  sys: Omit<EntrySys, "type"> & {
    type: "DeletedEntry";
  };
};
