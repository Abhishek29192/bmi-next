"use strict";

const existingRoofers = require("../../variables/roofer/20210507094158");
const newRoofers = require("../../variables/roofer/20211124094158");

module.exports.description = "Update list of roofer types";

module.exports.up = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("type").items({
    type: "Symbol",
    validations: [{ in: newRoofers }]
  });
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("type").items({
    type: "Symbol",
    validations: [{ in: existingRoofers }]
  });
};
