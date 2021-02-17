module.exports.description = "Add head scripts to the site";

module.exports.up = (migration) => {
  // Add your UP migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples

  const site = migration.editContentType("site");
  site
    .createField("scriptGOptLoad")
    .name("Google Optimize Load balancing ID")
    .type("Symbol");
};

module.exports.down = (migration) => {
  // Add your DOWN migration script here. See examples here:
  // https://github.com/contentful/migration-cli/tree/master/examples
  const site = migration.editContentType("site");
  site.deleteField("scriptGOptLoad");
};
