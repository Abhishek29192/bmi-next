"use strict";

module.exports.description = "Add tag field link to content type tag";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");
  promo
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");
  promo.deleteField("tag");
};
