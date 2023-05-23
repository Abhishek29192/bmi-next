import type { MigrationFunction } from "contentful-migration";

export const description = "Edit the title field for the Lead Block Section";

export const up: MigrationFunction = (migration) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  leadBlockSection.editField("title").required(true);

  leadBlockSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "This is only used for Contentful"
  });
};

export const down: MigrationFunction = (migration) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  leadBlockSection.editField("title").required(false);

  leadBlockSection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
};
