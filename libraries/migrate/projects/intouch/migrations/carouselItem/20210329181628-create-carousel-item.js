const audiences = require("../../variables/audiences/20210222125604");

module.exports.description = "Create content model for Carousel Item";

module.exports.up = (migration) => {
  const carouselItem = migration
    .createContentType("carouselItem")
    .name("Carousel Item")
    .displayField("header")
    .description(
      "Content that appears in the main carousel.  Note that there are two other minor carousels in InTouch, the Benefits Carousel and the Company Administrators carousel (probably redundant).  This entity is for content you see in the big one which contains promotional messages that do not link anywhere."
    );

  carouselItem
    .createField("header")
    .name("Header")
    .type("Symbol")
    .required(true);

  carouselItem
    .createField("imageSet")
    .name("Image Set")
    .type("Link")
    .required(true)
    .validations([
      { linkContentType: ["imageSet"], message: "Must point to an Image Set" }
    ])
    .linkType("Entry");

  carouselItem
    .createField("audience")
    .name("Audience")
    .type("Symbol")
    .required(true)
    .validations([{ in: audiences }]);

  carouselItem.createField("body").name("Body").type("Text").required(true);

  carouselItem.changeFieldControl("header", "builtin", "singleLine", {
    helpText: "The header for the item"
  });
  carouselItem.changeFieldControl("imageSet", "builtin", "entryLinkEditor");
  carouselItem.changeFieldControl("audience", "builtin", "dropdown", {
    helpText: "Role"
  });
  carouselItem.changeFieldControl("body", "builtin", "multipleLine", {
    helpText: "The body text for the item"
  });
};

module.exports.down = (migration) =>
  migration.deleteContentType("carouselItem");
