import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Add Content Topics field to Contact Us page";

export const up: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("contentTopics")
    .name("Content topics")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["contentTopic"] }],
      linkType: "Entry"
    });

  contactUsPage.moveField("contentTopics").afterField("queriesSubtitle");
};

export const down: MigrationFunction = (migration: Migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("contentTopics");
};
