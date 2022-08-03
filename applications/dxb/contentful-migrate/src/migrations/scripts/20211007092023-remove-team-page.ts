import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Remove Team Page from Cards Section";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const contentType = migration.editContentType("cardCollectionSection");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    contentType.id,
    "cards"
  );

  const linkContentTypeValidations = (validation?.linkContentType || []).filter(
    (entry) => entry !== "teamPage"
  );
  contentType.editField("cards").items({
    type: "Link",
    linkType: "Entry",
    validations:
      linkContentTypeValidations.length > 0
        ? [
            {
              linkContentType: linkContentTypeValidations
            }
          ]
        : []
  });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const contentType = migration.editContentType("cardCollectionSection");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    contentType.id,
    "cards"
  );

  contentType.editField("cards").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: [...(validation?.linkContentType || []), "teamPage"] }
    ]
  });
};
