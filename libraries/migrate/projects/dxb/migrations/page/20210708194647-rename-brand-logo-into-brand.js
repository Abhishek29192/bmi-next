/**
 * @typedef { import("contentful-migration").default } Migration
 * @typedef { (migration: Migration) => void } MigrationFunction
 */

module.exports.description = "Rename brandLogo field in brand";

/**
 * @type {MigrationFunction}
 */
module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("brandLogo", "brand");
  page.editField("brand").name("Brand");
  page.moveField("brand").afterField("featuredImage");
};

/**
 * @type {MigrationFunction}
 */
module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("brand", "brandLogo");
  page.editField("brandLogo").name("Brand Logo");
  page.moveField("brandLogo").afterField("featuredImage");
};
