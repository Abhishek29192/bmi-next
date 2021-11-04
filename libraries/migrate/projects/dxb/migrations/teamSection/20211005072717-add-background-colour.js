"use strict";

const backgroundColor =
  require("../../variables/colours/20210601130010").backgroundColor;

module.exports.description = "Add background colour";

module.exports.up = (migration) => {
  migration
    .editContentType("teamSection")
    .createField("backgroundColor")
    .name("Background Colour")
    .type("Symbol")
    .validations([{ in: backgroundColor }]);
};

module.exports.down = (migration) => {
  migration.editContentType("teamSection").deleteField("backgroundColor");
};
