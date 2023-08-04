import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Syndicate to the sections";

export const up: MigrationFunction = async (migration, context) => {
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

export const down: MigrationFunction = async (migration, context) => {
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
