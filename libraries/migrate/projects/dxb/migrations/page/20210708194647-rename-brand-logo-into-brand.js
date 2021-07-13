/**
 * @typedef { import("contentful-migration").default } Migration
 * @typedef { (migration: Migration) => void } MigrationFunction
 */

module.exports.description = "Rename brandLogo to brand";

/**
 * @type {MigrationFunction}
 */
module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page.editField("brandLogo").name("Brand");
};

/**
 * @type {MigrationFunction}
 */
module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.editField("brandLogo").name("Brand Logo");
};
