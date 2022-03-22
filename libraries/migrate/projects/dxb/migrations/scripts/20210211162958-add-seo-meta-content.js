"use strict";

module.exports.description = "Add SEO meta content";

module.exports.up = (migration) => {
  migration
    .editContentType("page")
    .createField("seo")
    .name("SEO")
    .type("Link")
    .validations([{ linkContentType: ["seoContent"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  migration.editContentType("page").deleteField("seo");
};
