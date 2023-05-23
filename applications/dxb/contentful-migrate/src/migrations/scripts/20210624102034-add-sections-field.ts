import type { MigrationFunction } from "contentful-migration";

export const description = "Add sections field";

export const up: MigrationFunction = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("sections")
    .name("Sections")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["cardCollectionSection", "tabsOrAccordionSection"]
        }
      ],
      linkType: "Entry"
    });

  contactUsPage.moveField("sections").afterField("contentTopics");
};

export const down: MigrationFunction = (migration) => {
  migration.editContentType("contactUsPage").deleteField("sections");
};
