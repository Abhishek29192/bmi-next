"use strict";

const existingMerchants = require("../../variables/merchantTypes/20210929064001");
const newMerchants = require("../../variables/merchantTypes/20211111064001");

module.exports.description = "Update list of merchant types";

module.exports.up = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("merchantType").items({
    type: "Symbol",
    validations: [{ in: newMerchants }]
  });
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("merchantType").items({
    type: "Symbol",
    validations: [{ in: existingMerchants }]
  });
};
