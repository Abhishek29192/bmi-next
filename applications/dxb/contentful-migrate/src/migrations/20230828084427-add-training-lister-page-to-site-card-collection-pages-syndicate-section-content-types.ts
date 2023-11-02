import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Add training lister page to Site, Card collection, and Syndicate section content types";

const contentTypes = [
  { contentTypeName: "cardCollectionSection", field: "cards" },
  { contentTypeName: "site", field: "pages" },
  { contentTypeName: "villainSection", field: "villains" }
];

export const up: MigrationFunction = async (migration, context) => {
  for await (const item of contentTypes) {
    const contentType = migration.editContentType(item.contentTypeName);

    const { validation } = await getItemsValidations(
      context!.makeRequest,
      contentType.id,
      item.field
    );

    contentType.editField(item.field).items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: [
            ...(validation?.linkContentType || []),
            "trainingListerPage"
          ]
        }
      ]
    });
  }
};

export const down: MigrationFunction = async (migration, context) => {
  for await (const item of contentTypes) {
    const contentType = migration.editContentType(item.contentTypeName);

    const { validation } = await getItemsValidations(
      context!.makeRequest,
      contentType.id,
      item.field
    );

    contentType.editField(item.field).items({
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: (validation?.linkContentType || []).filter(
            (entryType) => entryType !== "trainingListerPage"
          )
        }
      ]
    });
  }
};
