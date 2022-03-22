"use strict";

module.exports.description = "rename and disable subtitle field";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("subtitle", "subtitleShortText");
  // TODO: delete this disabled and un-used field when markets are happy with it
  // preferably after go-live ( new migration script on this content type)
  page.editField("subtitleShortText").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.changeFieldId("subtitleShortText", "subtitle");
  page.editField("subtitle").disabled(false).omitted(false);
  page.moveField("subtitle").afterField("brandLogo");
};
