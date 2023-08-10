import type { MigrationFunction } from "contentful-migration";

export const description = "Rename content-topic to contact-topic";

export const up: MigrationFunction = (migration) => {
  const contactTopic = migration.editContentType("contentTopic");

  contactTopic.name("Contact Topic");

  contactTopic.editField("footerList").items({
    type: "Link",
    validations: [{ linkContentType: ["contactDetails", "titleWithContent"] }],
    linkType: "Entry"
  });
};

export const down: MigrationFunction = (migration) => {
  const contentTopic = migration.editContentType("contentTopic");

  contentTopic.name("Content Topic");

  contentTopic.editField("footerList").items({
    type: "Link",
    validations: [{ linkContentType: ["navigation", "titleWithContent"] }],
    linkType: "Entry"
  });
};
