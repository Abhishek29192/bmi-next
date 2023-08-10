import { getInFieldValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Calculator option to link type validation";

export const up: MigrationFunction = async (migration, context) => {
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

export const down: MigrationFunction = async (migration, context) => {
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
