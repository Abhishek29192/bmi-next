import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create content model for Contact Details";

export const up: MigrationFunction = (migration: Migration) => {
  const contactDetails = migration
    .createContentType("contactDetails")
    .name("Contact Details")
    .displayField("fullName")
    .description("Contact details that appear as cards on the Company Page");

  contactDetails
    .createField("fullName")
    .name("Full Name")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }]);

  contactDetails
    .createField("subHeading")
    .name("Sub-Heading")
    .type("Symbol")
    .required(true);

  contactDetails
    .createField("email")
    .name("Email")
    .type("Symbol")
    .required(true)
    .validations([
      { regexp: { pattern: "^\\w[\\w.-]*@([\\w-]+\\.)+[\\w-]+$" } }
    ]);

  contactDetails.createField("phoneNumber").name("Phone Number").type("Symbol");

  contactDetails.changeFieldControl("fullName", "builtin", "singleLine");
  contactDetails.changeFieldControl("subHeading", "builtin", "singleLine");
  contactDetails.changeFieldControl("email", "builtin", "singleLine");
  contactDetails.changeFieldControl("phoneNumber", "builtin", "singleLine");
};

export const down: MigrationFunction = (migration: Migration) =>
  migration.deleteContentType("contactDetails");
