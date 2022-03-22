const {
  internalName,
  optionalTitle
} = require("../../variables/helpText/20210421160910");

module.exports.description = "Add required name field";

module.exports.up = (migration) => {
  const imageGallerySection = migration.editContentType("imageGallerySection");

  imageGallerySection
    .createField("name")
    .name("Name")
    .type("Symbol")
    .required(true);

  imageGallerySection.displayField("name");
  imageGallerySection.moveField("name").beforeField("title");
  imageGallerySection.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  imageGallerySection.editField("title").required(false);
  imageGallerySection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: optionalTitle
  });

  migration.transformEntries({
    contentType: "imageGallerySection",
    from: ["title"],
    to: ["name"],
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    }),
    shouldPublish: "preserve"
  });
};

module.exports.down = (migration) => {
  const imageGallerySection = migration.editContentType("imageGallerySection");

  imageGallerySection.displayField("title");
  imageGallerySection.editField("title").required(true);
  imageGallerySection.changeFieldControl("title", "builtin", "singleLine", {
    helpText: ""
  });
  imageGallerySection.deleteField("name");
};
