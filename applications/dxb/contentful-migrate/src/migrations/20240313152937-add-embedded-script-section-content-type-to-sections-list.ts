import { getItemsValidations } from "@bmi-digital/contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description =
  "Allow EmbeddedScriptSection to being used as a section on the BrandLandingPage, ContactUsPage, HomePage and SimplePage";

const pages = ["homePage", "brandLandingPage", "contactUsPage", "page"];

export const up: MigrationFunction = async (migration, context) => {
  for await (const pageName of pages) {
    const page = migration.editContentType(pageName);

    const { validation } = await getItemsValidations(
      context!.makeRequest,
      page.id,
      "sections"
    );

    page.editField("sections").items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            ...(validation?.linkContentType || []),
            "embeddedScriptSection"
          ]
        }
      ],
      linkType: "Entry"
    });
  }
};

export const down: MigrationFunction = async (migration, context) => {
  for await (const pageName of pages) {
    const page = migration.editContentType(pageName);

    const { validation } = await getItemsValidations(
      context!.makeRequest,
      page.id,
      "sections"
    );

    page.editField("sections").items({
      type: "Link",
      validations: [
        {
          linkContentType: (validation?.linkContentType || []).filter(
            (entryType) => entryType !== "embeddedScriptSection"
          )
        }
      ],
      linkType: "Entry"
    });
  }
};
