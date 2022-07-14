module.exports.description = "Remove scriptOnetrust from the site";

module.exports.up = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("scriptOnetrust");
};

module.exports.down = (migration) => {
  const site = migration.editContentType("site");

  site.createField("scriptOnetrust").name("OneTrust ID").type("Symbol");
};
