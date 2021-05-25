"use strict";

const { isDryRun } = require("../../../../utils/process");

module.exports.description = "rename and disable subtitle field";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("subtitle", "subtitleShortText");
  page.editField("subtitleShortText").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("subtitleShortText", "subtitle");
  page.editField("subtitle").disabled(false).omitted(false);
  page.moveField("subtitle").afterField("brandLogo");
};
