import { getInFieldValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Add HubSpot CTA type";

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
      { in: [...((inFieldValidation || []) as string[]), "HubSpot CTA"] }
    ]
  });

  link.createField("hubSpotCTAID").name("HubSpot CTA ID").type("Symbol");
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
        in: (inFieldValidation?.filter((item) => item !== "HubSpot CTA") ||
          []) as string[]
      }
    ]
  });

  link.deleteField("hubSpotCTAID");
};
