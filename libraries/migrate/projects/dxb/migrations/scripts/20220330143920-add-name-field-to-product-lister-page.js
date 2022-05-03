const { internalName } = require("../../variables/helpText/20210421160910");
module.exports.description = "Add name field for product lister page";

module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);
  productListerPage.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });
  productListerPage.displayField("name");
  productListerPage.moveField("name").beforeField("title");

  migration.transformEntries({
    contentType: "page",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]).replace(/\|/gi, "")
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.deleteField("name");
  productListerPage.displayField("title");
};
