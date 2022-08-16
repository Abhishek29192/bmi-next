import { getInFieldValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Add Dialog type";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    context!.makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    type: "Symbol",
    validations: [
      { in: [...((inFieldValidation || []) as string[]), "Dialog"] }
    ]
  });

  link
    .createField("dialogContent")
    .name("Dialog content")
    .type("Link")
    .validations([
      {
        linkContentType: [
          "cardCollectionSection",
          "carouselSection",
          "documentDownloadSection",
          "imageGallerySection",
          "villainSection",
          "titleWithContent",
          "form"
        ]
      }
    ])
    .linkType("Entry");

  link.changeFieldControl("dialogContent", "builtin", "entryLinkEditor", {
    helpText: "This is the section that will open up inside the dialog."
  });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    context!.makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    type: "Symbol",
    validations: [
      {
        in: (inFieldValidation?.filter((item) => item !== "Dialog") ||
          []) as string[]
      }
    ]
  });

  link.deleteField("dialogContent");
};
