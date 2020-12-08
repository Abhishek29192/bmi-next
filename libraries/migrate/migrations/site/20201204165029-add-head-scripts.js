module.exports.description = "Add head scripts to the site";

module.exports.up = (migration) => {
  const site = migration.editContentType("site");

  site.createField("headScripts").name("Head scripts tags").type("Text");
  site.createField("scriptGA").name("Google Analytics ID").type("Symbol");
  site.createField("scriptOnetrust").name("OneTrust ID").type("Symbol");
  site.createField("scriptGTM").name("Google Tag Manager ID").type("Symbol");
  site.createField("scriptHotJar").name("HotJar ID").type("Symbol");

  site.changeFieldControl("headScripts", "builtin", "multipleLine", {
    helpText: "This field is to inject custom <script> content into <head>"
  });
};

module.exports.down = (migration) => {
  const site = migration.editContentType("site");

  site.deleteField("headScripts");
  site.deleteField("scriptGA");
  site.deleteField("scriptOnetrust");
  site.deleteField("scriptGTM");
  site.deleteField("scriptHotJar");
};
