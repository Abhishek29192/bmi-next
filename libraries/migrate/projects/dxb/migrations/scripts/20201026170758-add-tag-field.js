"use strict";

module.exports.description = "Add tag field link to content type";

module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage
    .createField("tag")
    .name("Tag")
    .type("Link")
    .validations([{ linkContentType: ["tag"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");
  productListerPage.deleteField("tag");
};
