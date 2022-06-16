import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type Migration from "contentful-migration";
import type { MigrationContext, MigrationFunction } from "contentful-migration";

export const description = "Remove team page links from simple page.";

export const up: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("page");

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

  page.editField("nextBestActions").items({
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
};

export const down: MigrationFunction = async (
  migration: Migration,
  context?: MigrationContext
) => {
  const page = migration.editContentType("page");

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
