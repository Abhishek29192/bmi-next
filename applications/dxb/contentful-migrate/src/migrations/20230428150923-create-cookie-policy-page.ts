import { getExtensions } from "@bmi-digital/contentful-migration";
import { internalName } from "../variables/helpText/20210421160910.js";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create cookie policy page content type";

const contentTypeName = "cookiePolicyPage";
export const up: MigrationFunction = async (migration, context) => {
  const page = migration
    .createContentType(contentTypeName)
    .name("Cookie Policy Page")
    .description(
      "This page will be used to inject auto generated cookie policy by one trust"
    );

  page.createField("name").name("Name").type("Symbol").required(true);
  page.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  page.displayField("name");

  page
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField("slug")
    .name("Slug")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  page
    .createField("heroType")
    .required(true)
    .name("Hero Type")
    .type("Symbol")
    .validations([
      {
        in: ["Level 1", "Level 2", "Level 3"]
      }
    ]);
  page.changeFieldControl("heroType", "builtin", "dropdown", {
    helpText:
      "Choose Hierarchy if the hero type should be chosen automatically according to the page's menu position."
  });

  page.createField("subtitle").name("Subtitle").type("Symbol");
  page.changeFieldControl("subtitle", "builtin", "singleLine", {
    helpText: "This will be rendered for heroType 'Level 1' only."
  });
  page
    .createField("leadBlock")
    .name("Lead Block")
    .type("Link")
    .validations([{ linkContentType: ["leadBlockSection"] }])
    .linkType("Entry");

  page
    .createField("sections")
    .name("Sections")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["leadBlockSection", "titleWithContent"]
        }
      ],
      linkType: "Entry"
    });

  page
    .createField("seo")
    .name("SEO")
    .type("Link")
    .validations([{ linkContentType: ["seoContent"] }])
    .linkType("Entry");

  page
    .createField("breadcrumbTitle")
    .name("Breadcrumb Title")
    .type("Symbol")
    .required(false);

  page.changeFieldControl("title", "builtin", "singleLine");
  const extensions = await getExtensions(context!.makeRequest);

  const slugGenerator = extensions.items.find(
    (item) => item.extension.name === "Slug Generator"
  );

  if (!slugGenerator) {
    throw new Error("Slug Generator Extension was not found");
  }

  page.changeFieldControl("slug", "builtin", slugGenerator.sys.id, {
    helpText:
      'This will define the URL of the page. The page will be created at "https://www.bmigroup.com/{country-code}/{slug}".'
  });
  page.changeFieldControl("sections", "builtin", "entryLinksEditor");
};

export const down: MigrationFunction = (migration) => {
  migration.deleteContentType(contentTypeName);
};
