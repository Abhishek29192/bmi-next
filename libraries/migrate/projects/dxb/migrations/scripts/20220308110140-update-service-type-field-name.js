"use strict";

module.exports.description = "Change Service Types field name";

module.exports.up = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer.editField("serviceTypes").name("Services Types");
};

module.exports.down = (migration) => {};
