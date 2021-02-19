"use strict";

const previousIcons = require("../../variables/icons/20201110150955").brands;
const icons = require("../../variables/icons/20201111103444").brands;

module.exports.description = "Add Monarflex icon";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("brandLogo", {
    validations: [{ in: icons }]
  });
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("brandLogo", {
    validations: [{ in: previousIcons }]
  });
};
