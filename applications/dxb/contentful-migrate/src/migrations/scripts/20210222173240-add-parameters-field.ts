import { getInFieldValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "";

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
      { in: [...((inFieldValidation || []) as string[]), "Visualiser"] }
    ]
  });

  link.createField("parameters").name("Parameters").type("Object");

  link.changeFieldControl("parameters", "builtin", "objectEditor", {
    helpText:
      "Guidance for configuring parameters is available here: https://bmigroup.atlassian.net/l/c/nWbwfPj1"
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
        in: (inFieldValidation?.filter((item) => item !== "Visualiser") ||
          []) as string[]
      }
    ]
  });

  link.deleteField("parameters");
};
