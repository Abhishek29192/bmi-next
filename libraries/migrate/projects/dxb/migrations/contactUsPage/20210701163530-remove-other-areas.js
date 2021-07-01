"use strict";

module.exports.description = "Remove Other areas";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("otherAreasTitle");
  contactUsPage.deleteField("otherAreas");
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("otherAreasTitle")
    .name("Other areas title")
    .type("Symbol");
  contactUsPage
    .createField("otherAreas")
    .name("Other areas")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 2 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });
};
