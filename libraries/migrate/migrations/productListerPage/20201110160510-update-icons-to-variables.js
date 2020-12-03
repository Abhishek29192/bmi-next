"use strict";

const icons = require("../../variables/icons/20201110150955").brands;

module.exports.description = "Update icons to use avariable file";

module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.editField("brandLogo", {
    validations: [{ in: icons }]
  });
};

module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.editField("brandLogo", {
    validations: [
      {
        in: ["Icopal", "Monier", "Monarplan", "Arrow", "Zanda", "AeroDek"]
      }
    ]
  });
};
