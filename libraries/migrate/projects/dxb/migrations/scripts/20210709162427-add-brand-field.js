/**
 * @typedef { import("contentful-migration").default } Migration
 * @typedef { (migration: Migration) => void } MigrationFunction
 */

const brands = require("../../variables/icons/20210512134828").brands;

module.exports.description = "Add brandLogo field to team page content type";

/**
 * @type {MigrationFunction}
 */
module.exports.up = (migration) => {
  const page = migration.editContentType("teamPage");

  page
    .createField("brandLogo")
    .name("Brand")
    .type("Symbol")
    .validations([{ in: brands }]);

  page.moveField("brandLogo").afterField("featuredImage");
};

/**
 * @type {MigrationFunction}
 */
module.exports.down = (migration) => {
  const page = migration.editContentType("teamPage");

  page.deleteField("brandLogo");
};
