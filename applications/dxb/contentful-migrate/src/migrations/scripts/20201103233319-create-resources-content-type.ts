import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Resources";

export const up: MigrationFunction = (migration: Migration) => {
  const resources = migration
    .createContentType("resources")
    .name("Resources")
    .displayField("title")
    .description("Configuration for a site");

  resources
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  resources
    .createField("microCopy")
    .name("Micro copy")
    .type("Array")
    .items({
      type: "Link",
      validations: [{ linkContentType: ["resource"] }],
      linkType: "Entry"
    });

  resources
    .createField("pdpSidebarItems")
    .name("Product Details Page: Sidebar items")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2, max: 3 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });

  resources
    .createField("pdpCardsTitle")
    .name("Product Details Page: Cards title")
    .type("Symbol");

  resources
    .createField("pdpCards")
    .name("Product Details Page: Cards")
    .type("Array")
    .validations([{ size: { min: 2, max: 4 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: [
            "promo",
            "page",
            "productListerPage",
            "contactUsPage",
            "teamPage"
          ]
        }
      ],
      linkType: "Entry"
    });

  resources
    .createField("pdpExploreBar")
    .name("Product Details Page: Explore Bar")
    .type("Link")
    .validations([{ linkContentType: ["navigation"] }])
    .linkType("Entry");

  resources.changeFieldControl("microCopy", "builtin", "entryLinksEditor");
  resources.changeFieldControl(
    "pdpSidebarItems",
    "builtin",
    "entryLinksEditor",
    {
      helpText:
        "These items will populate the sidebar of all Product pages. The first entry will be used below the key features, the second and third will be added next to the technical specifications."
    }
  );
  resources.changeFieldControl("pdpCards", "builtin", "entryLinksEditor");
  resources.changeFieldControl("pdpExploreBar", "builtin", "entryLinkEditor");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("resources");
