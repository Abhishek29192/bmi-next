import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Add Syndicate to the sections";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    brandLandingPage.id,
    "sections"
  );

  brandLandingPage.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: [
          ...(validation?.linkContentType || []),
          "villainSection",
          ""
        ]
      }
    ],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    brandLandingPage.id,
    "sections"
  );

  brandLandingPage.editField("sections").items({
    type: "Link",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entryType) => entryType !== "villainSection"
        )
      }
    ],
    linkType: "Entry"
  });
};
