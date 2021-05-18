const { roles } = require("../../variables/roles/20210421085849");

module.exports.description = "Create content model for Carousel";

module.exports.up = (migration) => {
  const carousel = migration
    .createContentType("carousel")
    .name("Carousel")
    .displayField("name")
    .description("Ordered list of items to be rendered as a carousel.");

  carousel
    .createField("name")
    .name("Name")
    .type("Symbol")
    .validations([{ unique: true }]);

  carousel
    .createField("list")
    .name("List")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["carouselItem"] }],
      linkType: "Entry"
    });

  carousel
    .createField("audienceRole")
    .name("Audience Role")
    .type("Symbol")
    .required(true)
    .validations([{ unique: true }, { in: roles }]);

  carousel.changeFieldControl("name", "builtin", "singleLine", {
    helpText:
      "Display name to retrieve the entry when searching in the Contentful web app."
  });
  carousel.changeFieldControl("list", "builtin", "entryCardsEditor", {
    helpText: "Enter the list of items in the order you want them to appear",
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
  carousel.changeFieldControl("audienceRole", "builtin", "radio");
};

module.exports.down = (migration) => migration.deleteContentType("carousel");
