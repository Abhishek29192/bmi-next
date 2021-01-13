"use strict";

module.exports.description =
  "Add search page sidebar items to resources content type";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("searchPageSidebarItems")
    .name("Search Page: Sidebar Items")
    .type("Link")
    .validations([{ linkContentType: ["titleWithContent"] }])
    .linkType("Entry");
  resources
    .moveField("searchPageSidebarItems")
    .afterField("searchPageSearchTips");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("searchPageSidebarItems");
};
