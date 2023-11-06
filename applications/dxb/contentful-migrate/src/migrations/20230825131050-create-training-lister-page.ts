import { getExtensions } from "@bmi-digital/contentful-migration";
import { internalName } from "../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create trining lister page content type";

export const up: MigrationFunction = async (migration, context) => {
  const trainingListerPage = migration
    .createContentType("trainingListerPage")
    .name("Training Lister Page");

  trainingListerPage
    .createField("name")
    .name("Name")
    .type("Symbol")
    .localized(true)
    .required(true);
  trainingListerPage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  trainingListerPage.displayField("name");

  trainingListerPage
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .localized(true)
    .required(true)
    .validations([{ unique: true }]);

  trainingListerPage
    .createField("title")
    .name("Title")
    .type("Symbol")
    .localized(true)
    .required(true);

  trainingListerPage
    .createField("subtitle")
    .name("Subtitle")
    .type("Symbol")
    .localized(true);

  trainingListerPage
    .createField("featuredMedia")
    .name("Featured Image")
    .type("Link")
    .validations([{ linkContentType: ["image"] }])
    .linkType("Entry")
    .required(true)
    .localized(true);

  trainingListerPage
    .createField("seo")
    .name("SEO")
    .type("Link")
    .localized(true)
    .validations([{ linkContentType: ["seoContent"] }])
    .linkType("Entry");

  trainingListerPage
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .localized(true)
    .required(false);

  trainingListerPage
    .createField("parentPage")
    .name("Parent Page")
    .type("Link")
    .localized(true)
    .validations([
      {
        linkContentType: [
          "page",
          "contactUsPage",
          "teamPage",
          "homePage",
          "productListerPage",
          "documentLibraryPage",
          "brandLandingPage",
          "trainingListerPage"
        ]
      }
    ])
    .linkType("Entry");

  const extensions = await getExtensions(context!.makeRequest);

  const slugGenerator = extensions.items.find(
    (item) => item.extension.name === "Slug Generator"
  );

  if (!slugGenerator) {
    throw new Error("Slug Generator Extension was not found");
  }

  trainingListerPage.changeFieldControl(
    "slug",
    "extension",
    slugGenerator.sys.id,
    {
      helpText:
        'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
    }
  );
};

export const down: MigrationFunction = async (migration) => {
  migration.deleteContentType("trainingListerPage");
};
