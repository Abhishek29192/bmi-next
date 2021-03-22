module.exports.description = "Create content model for Carousel";

module.exports.up = (migration) => {
  const carousel = migration
    .createContentType("carousel")
    .name("Carousel")
    .displayField("name")
    .description("Ordered list of items to be rendered as a carousel.");

  carousel
    .createField("list")
    .name("list")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["carouselItem"] }],
      linkType: "Entry"
    });

  carousel.createField("caption").name("caption").type("Text");

  carousel
    .createField("name")
    .name("Name")
    .type("Symbol")
    .validations([{ unique: true }]);

  carousel.changeFieldControl("list", "builtin", "entryCardsEditor", {
    helpText: "Enter the list of items in the order you want them to appear",
    bulkEditing: false,
    showLinkEntityAction: true,
    showCreateEntityAction: true
  });
  carousel.changeFieldControl("caption", "builtin", "markdown");
  carousel.changeFieldControl("name", "builtin", "singleLine", {
    helpText:
      "Display name to retrieve the entry when searching in the Contentful web app."
  });
};

module.exports.down = (migration) => migration.deleteContentType("carousel");
