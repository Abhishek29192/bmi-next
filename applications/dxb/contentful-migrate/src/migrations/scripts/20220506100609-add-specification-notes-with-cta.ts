import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add specification notes with CTA content type";

export const up: MigrationFunction = (migration: Migration) => {
  const specificationNotes = migration
    .createContentType("specificationNotes")
    .name("Specification Notes With CTA")
    .displayField("name")
    .description("");

  specificationNotes
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  specificationNotes.createField("title").name("Title").type("Symbol");
  specificationNotes
    .createField("description")
    .name("Description")
    .type("RichText");
  specificationNotes
    .createField("cta")
    .name("CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  const resources = migration.editContentType("resources");
  resources
    .createField("sdpSpecificationNotesCta")
    .name("System Details Page: Specification Notes With CTA")
    .type("Link")
    .validations([{ linkContentType: ["specificationNotes"] }])
    .linkType("Entry");
};

export const down: MigrationFunction = (migration: Migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("sdpSpecificationNotesCta");
  migration.deleteContentType("specificationNotes");
};
