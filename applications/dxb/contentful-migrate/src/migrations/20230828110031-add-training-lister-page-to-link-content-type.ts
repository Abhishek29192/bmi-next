import { getLinkContentTypeValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = `Add Training lister page to linked page field validations`;

export const up: MigrationFunction = async (migration, context) => {
  const link = migration.editContentType("link");

  const { linkContentType } = await getLinkContentTypeValidations(
    context!.makeRequest,
    link.id,
    "linkedPage"
  );

  link.editField("linkedPage").validations([
    {
      linkContentType: [...(linkContentType || []), "trainingListerPage"]
    }
  ]);
};

export const down: MigrationFunction = async (migration, context) => {
  const link = migration.editContentType("link");

  const { linkContentType } = await getLinkContentTypeValidations(
    context!.makeRequest,
    link.id,
    "linkedPage"
  );

  link.editField("linkedPage").validations([
    {
      linkContentType: [
        ...(linkContentType?.filter(
          (entryType) => entryType !== "trainingListerPage"
        ) || [])
      ]
    }
  ]);
};