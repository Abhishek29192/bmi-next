import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create About lead block cta on SDP";

const field = "sdpSidebarItems";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: Sidebar Items")
    .type("Array")
    .required(false)
    .validations([{ size: { max: 1 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });
  resources.changeFieldControl(
    "pdpSidebarItems",
    "builtin",
    "entryLinksEditor"
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
