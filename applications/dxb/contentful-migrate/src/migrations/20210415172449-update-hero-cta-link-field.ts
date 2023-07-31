import type { MigrationFunction } from "contentful-migration";

export const description = "update hero CTA link field";

export const up: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This CTA will only be visible on Level 1 and Spotlight heroes"
  });
};

export const down: MigrationFunction = (migration) => {
  const page = migration.editContentType("page");
  page.changeFieldControl("cta", "builtin", "entryLinkEditor", {
    helpText: "This CTA will only be visible on Level 1 heroes"
  });
};
