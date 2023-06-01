import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add document download section to sections validation for page content type";

export const up: MigrationFunction = async (migration, context) => {
  const page = migration.editContentType("page");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          ...(validation?.linkContentType || []),
          "documentDownloadSection"
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = async (migration, context) => {
  const page = migration.editContentType("page");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "sections"
  );

  page.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entryType) => entryType !== "documentDownloadSection"
        )
      }
    ],
    linkType: "Entry"
  });
};
