import type { MigrationFunction } from "contentful-migration";

export const description = "Edit EmbeddedScriptSection content type name";

export const up: MigrationFunction = (migration) => {
  migration
    .editContentType("embeddedScriptSection")
    .name("Embedded Script Section");
};

export const down: MigrationFunction = (migration) => {
  migration
    .editContentType("embeddedScriptSection")
    .name("Embedded Script Page");
};
