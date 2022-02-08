module.exports.description = "remove un-used script fields from the site";

module.exports.up = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("scriptHotJar");
  site.deleteField("scriptGA");
  site.deleteField("scriptGOptLoad");
};

module.exports.down = (migration) => {
  const site = migration.editContentType("site");

  site.createField("scriptHotJar").name("HotJar ID").type("Symbol");
  site.createField("scriptGA").name("Google Analytics ID").type("Symbol");
  site
    .createField("scriptGOptLoad")
    .name("Google Optimize Load balancing ID")
    .type("Symbol");
};
