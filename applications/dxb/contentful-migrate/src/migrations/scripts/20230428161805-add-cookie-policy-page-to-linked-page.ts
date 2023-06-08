import { getLinkContentTypeValidations } from "@bmi-digital/contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

const diffEntryTypes = ["cookiePolicyPage"];

export const description = `Add ${diffEntryTypes.join(
  ", "
)} to linked page field validations`;

export const up: MigrationFunction = async (
  migration,
  context?: MigrationContext
) => {
  const link = migration.editContentType("link");

  const { linkContentType } = await getLinkContentTypeValidations(
    context!.makeRequest,
    link.id,
    "linkedPage"
  );

  link.editField("linkedPage").validations([
    {
      linkContentType: [...(linkContentType || []), ...diffEntryTypes]
    }
  ]);
};

export const down: MigrationFunction = async (
  migration,
  context?: MigrationContext
) => {
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
          (entryType) => !diffEntryTypes.includes(entryType)
        ) || [])
      ]
    }
  ]);
};
