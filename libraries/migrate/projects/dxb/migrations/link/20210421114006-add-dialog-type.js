"use strict";

const { getInFieldValidations } = require("../../../../utils/fieldValidations");

module.exports.description = "Add Dialog type";

module.exports.up = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    validations: [{ in: [...inFieldValidation, "Dialog"] }]
  });

  link
    .createField("dialogContent")
    .name("Dialog content")
    .type("Link")
    .validations([
      {
        linkContentType: [
          "cardCollectionSection",
          "carouselSection",
          "documentDownloadSection",
          "imageGallerySection",
          "villainSection",
          "titleWithContent",
          "form"
        ]
      }
    ])
    .linkType("Entry");

  link.changeFieldControl("dialogContent", "builtin", "entryLinkEditor", {
    helpText: "This is the section that will open up inside the dialog."
  });
};

module.exports.down = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    validations: [{ in: inFieldValidation.filter((item) => item !== "Dialog") }]
  });

  link.deleteField("dialogContent");
};
