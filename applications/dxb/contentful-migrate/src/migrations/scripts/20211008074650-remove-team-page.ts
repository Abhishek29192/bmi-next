import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = `Remove team page from linked page field validations`;

export const up: MigrationFunction = async (migration, context) => {
  const link = migration.editContentType("link");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    link.id,
    "linkedPage"
  );

  const linkContentTypeValidations = (validation?.linkContentType || []).filter(
    (entry) => entry !== "teamPage"
  );
  link.editField("linkedPage").validations(
    linkContentTypeValidations.length > 0
      ? [
          {
            linkContentType: linkContentTypeValidations
          }
        ]
      : []
  );
};

export const down: MigrationFunction = async (migration, context) => {
  const link = migration.editContentType("link");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    link.id,
    "linkedPage"
  );

  link
    .editField("linkedPage")
    .validations([
      { linkContentType: [...(validation?.linkContentType || []), "teamPage"] }
    ]);
};
