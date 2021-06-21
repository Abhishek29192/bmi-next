module.exports.description = "Remove Script GTM field from site";

module.exports.up = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("scriptGTM");
};

module.exports.down = (migration) => {
  const site = migration.editContentType("site");

  site.createField("scriptGTM").name("Google Tag Manager ID").type("Symbol");
};
