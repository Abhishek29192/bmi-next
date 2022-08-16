import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "<Put your description here>";

export const up: MigrationFunction = (migration: Migration) => {
  const contactDetails = migration
    .createContentType("contactDetails")
    .name("Contact Details")
    .displayField("title")
    .description("");

  contactDetails
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  contactDetails.createField("address").name("Address").type("Symbol");
  contactDetails.createField("email").name("Email").type("Symbol");
  contactDetails.createField("phoneNumber").name("Phone Number").type("Symbol");

  contactDetails
    .createField("otherInformation")
    .name("Other Information")
    .type("RichText")
    .validations([
      { enabledMarks: ["bold"], message: "Only bold marks are allowed" },
      {
        enabledNodeTypes: ["heading-2"],
        message: "Only heading 2 nodes are allowed"
      },
      { nodes: {} }
    ]);
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("contactDetails");
};
