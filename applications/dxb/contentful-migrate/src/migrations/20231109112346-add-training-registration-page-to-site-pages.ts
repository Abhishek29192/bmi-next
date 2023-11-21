import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description =
  "Add training registration page to pages validation for page content type";

const newEntryType = "trainingRegistrationPage";

export const up: MigrationFunction = async (
  migration,
  context?: MigrationContext
) => {
  const site = migration.editContentType("site");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    site.id,
    "pages"
  );

  site.editField("pages").items({
    type: "Link",
    validations: [
      {
        linkContentType: [...(validation?.linkContentType || []), newEntryType]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = async (
  migration,
  context?: MigrationContext
) => {
  const site = migration.editContentType("site");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    site.id,
    "pages"
  );

  site.editField("pages").items({
    type: "Link",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entryType) => entryType !== newEntryType
        )
      }
    ],
    linkType: "Entry"
  });
};
