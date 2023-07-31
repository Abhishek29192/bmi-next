import type { MigrationFunction } from "contentful-migration";

export const description = "Move contentTopic up.";

export const up: MigrationFunction = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.moveField("contentTopics").afterField("queriesSubtitle");
  contactUsPage.editField("contentTopics").name("Contact Topics");
};

export const down: MigrationFunction = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.moveField("contentTopics").afterField("locations");
  contactUsPage.editField("contentTopics").name("Content topics");
};
