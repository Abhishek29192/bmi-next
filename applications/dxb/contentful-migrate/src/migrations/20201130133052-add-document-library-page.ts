import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Document Library to Card Sections";

export const up: MigrationFunction = async (migration, context) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    cardCollectionSection.id,
    "cards"
  );

  cardCollectionSection.editField("cards").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          ...(validation?.linkContentType || []),
          "documentLibraryPage"
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = async (migration, context) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    cardCollectionSection.id,
    "cards"
  );

  cardCollectionSection.editField("cards").items({
    type: "Link",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entryType: any) => entryType !== "documentLibraryPage"
        )
      }
    ],
    linkType: "Entry"
  });
};
