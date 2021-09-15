/**
 * @typedef { import("contentful-migration").default } Migration
 * @typedef { (migration: Migration) => void } MigrationFunction
 */
"use strict";

module.exports.description = "Add allow filter by field on Product Lister Page";

/**
 * @type {MigrationFunction}
 */
module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage
    .createField("allowFilterBy")
    .name("Allow Filter By")
    .type("Array")
    .required(false)
    .items({
      type: "Symbol",
      validations: []
    });

  productListerPage.changeFieldControl(
    "allowFilterBy",
    "builtin",
    "tagEditor",
    {
      helpText:
        "type the filter value and hit enter, note the value should match with the PIM name (ex:  'generalInformation.materials', 'measurements.length', 'ProductFamily', 'Category', 'Category | PITCHED_ROOF_NO', 'PITCHED_ROOF_NO')"
    }
  );

  productListerPage.moveField("allowFilterBy").afterField("categoryCodes");
};

/**
 * @type {MigrationFunction}
 */
module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.deleteField("allowFilterBy");
};
