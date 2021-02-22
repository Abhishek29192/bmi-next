"use strict";

const previousIcons = require("../../variables/icons/20201110150955");
const icons = require("../../variables/icons/20201111103444");

module.exports.description = "Add Monarflex icon";

module.exports.up = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    validations: [{ in: icons }]
  });
};

module.exports.down = (migration) => {
  const link = migration.editContentType("link");

  link.editField("icon", {
    validations: [{ in: previousIcons }]
  });
};
