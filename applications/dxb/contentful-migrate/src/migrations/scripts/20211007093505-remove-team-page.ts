import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Remove team page links from contactUsPage.";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("contactUsPage");

  //remove from parentPage field
  page.editField("parentPage").validations([
    {
      linkContentType: [
        "page",
        "contactUsPage",
        "homePage",
        "productListerPage",
        "documentLibraryPage",
        "brandLandingPage"
      ]
    }
  ]);

  //remove from nextBestActions field
  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "nextBestActions"
  );

  const linkContentTypeValidations = (validation?.linkContentType || []).filter(
    (entry) => entry !== "teamPage"
  );
  page.editField("nextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations:
      linkContentTypeValidations.length > 0
        ? [
            {
              linkContentType: linkContentTypeValidations
            }
          ]
        : []
  });
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("contactUsPage");

  page.editField("parentPage").validations([
    {
      linkContentType: [
        "page",
        "contactUsPage",
        "teamPage",
        "homePage",
        "productListerPage",
        "documentLibraryPage",
        "brandLandingPage"
      ]
    }
  ]);

  const { validation } = await getItemsValidations(
    context!.makeRequest,
    page.id,
    "nextBestActions"
  );

  page.editField("nextBestActions").items({
    type: "Link",
    linkType: "Entry",
    validations: [
      { linkContentType: [...(validation?.linkContentType || []), "teamPage"] }
    ]
  });
};
