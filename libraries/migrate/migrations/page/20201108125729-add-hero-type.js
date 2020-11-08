module.exports.description = "Add heroType field to content type Page";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");
  page
    .createField("heroType")
    .required(true)
    .name("Hero Type")
    .type("Symbol")
    .validations([
      {
        in: ["Hierarchy", "Spotlight"]
      }
    ]);
  page.changeFieldControl("heroType", "builtin", "radio", {
    helpText:
      "Choose Hierarchy if the hero type should be chosen automatically according to the page's menu position."
  });
  page.moveField("heroType").afterField("subtitle");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("heroType");
};
