module.exports.description =
  "Add input banner to resources content type and remove the showSignUpBlock";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("pdpInputBanner")
    .name("PDP: Input Banner")
    .type("Link")
    .validations([{ linkContentType: ["inputBanner"] }])
    .linkType("Entry");

  resources.changeFieldControl("pdpInputBanner", "builtin", "entryLinkEditor");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("pdpInputBanner");
};
