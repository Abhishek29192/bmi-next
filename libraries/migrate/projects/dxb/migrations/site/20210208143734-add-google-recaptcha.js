module.exports.description = "Add Recaptcha configuration";

module.exports.up = (migration) => {
  // Add your UP migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples

  const site = migration.editContentType("site");
  site
    .createField("scriptGRecaptchaId")
    .name("Google Recaptcha ID")
    .type("Symbol");

  site
    .createField("scriptGRecaptchaNet")
    .name("Google Recaptcha Use Net?")
    .type("Boolean");
  site.changeFieldControl("scriptGRecaptchaNet", "builtin", "boolean", {
    helpText:
      "Should the Recaptcha script be retrieved from recaptcha.net instead of google.com?"
  });
};

module.exports.down = (migration) => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples

  const site = migration.editContentType("site");
  site.deleteField("scriptGRecaptchaId");
  site.deleteField("scriptGRecaptchaNet");
};
