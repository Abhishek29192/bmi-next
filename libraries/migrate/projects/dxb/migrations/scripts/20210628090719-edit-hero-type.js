module.exports.description = "Allow editing of hero type on PLP page";

module.exports.up = (migration) => {
  const page = migration.editContentType("productListerPage");
  page
    .createField("heroType")
    .required(true)
    .name("Hero Type")
    .type("Symbol")
    .validations([
      {
        in: ["Hierarchy", "Spotlight", "Level 1", "Level 2", "Level 3"]
      }
    ]);
  page.changeFieldControl("heroType", "builtin", "dropdown", {
    helpText:
      "Choose Hierarchy if the hero type should be chosen automatically according to the page's menu position."
  });
  page.moveField("heroType").afterField("subtitle");

  migration.transformEntries({
    contentType: "productListerPage",
    from: ["heroType"],
    to: ["heroType"],
    transformEntryForLocale: function (fromFields, currentLocale) {
      const currentHeroType = (fromFields.heroType || {})[currentLocale];
      return { heroType: currentHeroType || "Level 2" };
    }
  });
};

module.exports.down = (migration) => {
  const page = migration.editContentType("productListerPage");
  page.deleteField("heroType");
};
