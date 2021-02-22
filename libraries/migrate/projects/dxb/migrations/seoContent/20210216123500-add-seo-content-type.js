"use strict";

module.exports.description = "Create content type for SEO content";

module.exports.up = (migration) => {
  const seoContent = migration
    .createContentType("seoContent")
    .name("SEO content")
    .displayField("title")
    .description("");

  seoContent.createField("title").name("Title").type("Symbol").required(true);

  seoContent.createField("metaTitle").name("Meta Title").type("Symbol");

  seoContent
    .createField("metaDescription")
    .name("Meta Description")
    .type("Symbol");
};

module.exports.down = (migration) => migration.deleteContentType("seoContent");
