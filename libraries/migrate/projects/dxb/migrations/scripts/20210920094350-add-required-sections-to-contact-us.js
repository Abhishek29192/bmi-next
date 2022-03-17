"use strict";

module.exports.description = "Add sections field";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: [
            "cardCollectionSection",
            "tabsOrAccordionSection",
            "serviceLocatorSection"
          ]
        }
      ],
      linkType: "Entry"
    }
  });
};

module.exports.down = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.editField("sections", {
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["cardCollectionSection", "tabsOrAccordionSection"]
        }
      ],
      linkType: "Entry"
    }
  });
};
