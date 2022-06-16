import { getInFieldValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Add Calculator option to link type validation";

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
      { in: [...((inFieldValidation || []) as string[]), "Calculator"] }
    ]
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
        in: (inFieldValidation?.filter((item) => item !== "Calculator") ||
          []) as string[]
      }
    ]
  });
};
