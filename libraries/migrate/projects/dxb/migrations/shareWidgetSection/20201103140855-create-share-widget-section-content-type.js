"use strict";

module.exports.description = "Create content model for Share Widget Section";

module.exports.up = (migration) => {
  const shareWidgetSection = migration
    .createContentType("shareWidgetSection")
    .name("Share Widget Section")
    .displayField("title")
    .description("Widget for social sharing actions");

  shareWidgetSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  shareWidgetSection
    .createField("clipboardSuccessMessage")
    .name("Clipboard success message")
    .type("Symbol");

  shareWidgetSection
    .createField("clipboardErrorMessage")
    .name("Clipboard error message")
    .type("Symbol");

  shareWidgetSection
    .createField("isLeftAligned")
    .name("Is left aligned")
    .type("Boolean");

  shareWidgetSection
    .createField("email")
    .name("Share by email")
    .type("Boolean");

  shareWidgetSection
    .createField("copy")
    .name("Copy to clipboard")
    .type("Boolean");

  shareWidgetSection
    .createField("linkedin")
    .name("LinkedIn share")
    .type("Boolean");

  shareWidgetSection
    .createField("twitter")
    .name("Twitter share")
    .type("Boolean");

  shareWidgetSection
    .createField("facebook")
    .name("Facebook share")
    .type("Boolean");

  shareWidgetSection
    .createField("pinterest")
    .name("Pinterest share")
    .type("Boolean");
};

module.exports.down = (migration) =>
  migration.deleteContentType("shareWidgetSection");
