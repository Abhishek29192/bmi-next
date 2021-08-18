"use strict";

module.exports.description = "Add next best actions field to contact us page";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage
    .createField("nextBestActions")
    .name("Next best actions")
    .type("Array")
    .validations([{ size: { min: 2, max: 4 } }])
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["promo", "page", "productListerPage", "teamPage"]
        }
      ],
      linkType: "Entry"
    });
  contactUsPage.changeFieldControl(
    "nextBestActions",
    "builtin",
    "entryLinksEditor"
  );
  contactUsPage.moveField("nextBestActions").afterField("iframe");
};

module.exports.down = (migration) => {
  migration.editContentType("contactUsPage").deleteField("nextBestActions");
};
