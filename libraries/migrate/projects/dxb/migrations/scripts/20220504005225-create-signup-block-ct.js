"use strict";

module.exports.description = "Create SignupBlock Content Type";

module.exports.up = (migration) => {
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

module.exports.down = (migration) => {
  migration.deleteContentType("signupBlock");
};
