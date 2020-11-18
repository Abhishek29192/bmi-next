"use strict";

const icons = require("../../variables/icons/20201110150955").brands;

module.exports.description = "Update icons to use avariable file";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("brandLogo", {
    validations: [{ in: icons }]
  });
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("brandLogo", {
    validations: [
      {
        in: ["Icopal", "Monier", "Monarplan", "Arrow", "Zanda", "AeroDek"]
      }
    ]
  });
};
