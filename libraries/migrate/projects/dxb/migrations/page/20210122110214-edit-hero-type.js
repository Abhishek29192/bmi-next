module.exports.description =
  "Add levels 1-3 to heroType validation on page content type.";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");
  page.editField("heroType").validations([
    {
      in: ["Hierarchy", "Spotlight", "Level 1", "Level 2", "Level 3"]
    }
  ]);
  page.changeFieldControl("heroType", "builtin", "dropdown");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.editField("heroType").validations([
    {
      in: ["Hierarchy", "Spotlight"]
    }
  ]);
  page.changeFieldControl("heroType", "builtin", "radio");
};
