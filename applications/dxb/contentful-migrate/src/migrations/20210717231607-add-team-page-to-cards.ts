import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Team Page to Cards Section";

export const up: MigrationFunction = async (migration, context) => {
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

export const down: MigrationFunction = async (migration, context) => {
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
      {
        linkContentType: validation?.linkContentType?.filter(
          (entry) => entry !== "teamPage"
        )
      }
    ]
  });
};
