"use strict";

const merchantTypes = require("../../variables/merchantTypes/20210929064001.js");

module.exports.description = "Add Merchant Types and options";

module.exports.up = (migration) => {
  const roofer = migration.editContentType("roofer");
  roofer
    .createField("merchantType")
    .name("Type of Merchant")
    .type("Array")
    .items({
      type: "Symbol",
      validations: [
        {
          in: merchantTypes
        }
      ]
    });

  roofer.moveField("merchantType").afterField("branchType");

  roofer.changeFieldControl("merchantType", "builtin", "checkbox");
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("merchantType");
};
