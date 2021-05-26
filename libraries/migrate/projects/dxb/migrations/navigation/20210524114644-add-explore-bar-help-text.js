"use strict";

module.exports.description = "Add help text for Explore Bar use";

module.exports.up = (migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    helpText:
      "When using Navigation as a section, only `Link` content types can be used to make up the horizontal menu bar."
  });
};

module.exports.down = (migration) => {
  const navigation = migration.editContentType("navigation");
  navigation.changeFieldControl("links", "builtin", "entryLinksEditor", {
    helpText: ""
  });
};
