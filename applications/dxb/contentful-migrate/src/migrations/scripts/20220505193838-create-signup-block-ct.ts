import type Migration from "contentful-migration";
import type { MigrationFunction } from "contentful-migration";

export const description = "Create SignupBlock Content Type";

export const up: MigrationFunction = (migration: Migration) => {
  const signupBlock = migration
    .createContentType("signupBlock")
    .name("Signup Block")
    .displayField("title");

  signupBlock.createField("title").name("Title").type("Symbol");

  signupBlock.createField("description").name("Description").type("Text");

  signupBlock
    .createField("signupLabel")
    .name("Signup Label")
    .type("Symbol")
    .required(true);

  signupBlock
    .createField("signupDialogContent")
    .name("Signup: Dialong content")
    .type("Link")
    .validations([{ linkContentType: ["form"] }])
    .linkType("Entry")
    .required(true);

  signupBlock.changeFieldControl("title", "builtin", "singleLine");
  signupBlock.changeFieldControl("description", "builtin", "singleLine");
  signupBlock.changeFieldControl("signupLabel", "builtin", "singleLine");
  signupBlock.changeFieldControl(
    "signupDialogContent",
    "builtin",
    "entryLinkEditor",
    {
      helpText: "This is the section that will open up inside the dialog."
    }
  );
};

export const down: MigrationFunction = (migration: Migration) => {
  migration.deleteContentType("signupBlock");
};
