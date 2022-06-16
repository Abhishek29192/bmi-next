import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Remove team page links from resources.";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("resources");

  //pdpCards
  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "pdpCards"
  );

  page.editField("pdpCards").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: validation?.linkContentType?.filter(
          (entry) => entry !== "teamPage"
        )
      }
    ]
  });

  //nba
  const { validation: nbaValidation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "searchPageNextBestActions"
  );

  page.editField("searchPageNextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: nbaValidation?.linkContentType?.filter(
          (entry) => entry !== "teamPage"
        )
      }
    ]
  });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("resources");

  //pdp
  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "pdpCards"
  );

  page.editField("pdpCards").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: [...(validation?.linkContentType || []), "teamPage"] }
    ]
  });

  //nba
  const { validation: nbaValidation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "searchPageNextBestActions"
  );

  page.editField("searchPageNextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      {
        linkContentType: [...(nbaValidation?.linkContentType || []), "teamPage"]
      }
    ]
  });
};
