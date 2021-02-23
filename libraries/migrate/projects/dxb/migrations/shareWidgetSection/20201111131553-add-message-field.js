"use strict";

module.exports.description = "Add message field";

module.exports.up = (migration) => {
  const shareWidgetSection = migration.editContentType("shareWidgetSection");

  shareWidgetSection.createField("message").name("Message").type("Symbol");
  shareWidgetSection.moveField("message").afterField("title");
};

module.exports.down = (migration) => {
  const shareWidgetSection = migration.editContentType("shareWidgetSection");

  shareWidgetSection.deleteField("message");
};
