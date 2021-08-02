/**
 * @typedef { import("contentful-migration").default } Migration
 * @typedef { (migration: Migration) => void } MigrationFunction
 */

module.exports.description =
  "Rename brandLogo to brand for display purposes only, as changing the field itself will require a much greater change in the code (to be done later)";

/**
 * @type {MigrationFunction}
 */
module.exports.up = (migration) => {
  const page = migration.editContentType("brandLandingPage");

  page.editField("brandLogo").name("Brand");
};

/**
 * @type {MigrationFunction}
 */
module.exports.down = (migration) => {
  const page = migration.editContentType("brandLandingPage");

  page.editField("brandLogo").name("Brand Logo");
};
