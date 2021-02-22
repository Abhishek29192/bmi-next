"use strict";

module.exports.description = "Create content model for tags";

module.exports.up = (migration) => {
  const tag = migration
    .createContentType("tag")
    .name("Tag")
    .displayField("title")
    .description("");

  tag.createField("title").name("Title").type("Symbol").required(true);
};

module.exports.down = (migration) => {
  migration.deleteContentType("tag");
};
