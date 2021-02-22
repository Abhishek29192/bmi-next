"use strict";

const previousIcons = require("../../variables/icons/20201111103444");
const icons = require("../../variables/icons/20210120155354");

module.exports.description = "Add PhoneMobile icon";

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
