"use strict";

module.exports.description = "Add sort order";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .createField("sortOrder")
    .name("Sort order")
    .type("Symbol")
    .validations([
      {
        in: [
          "Default (Contentful)",
          "Date (Newest first)",
          "Date (Oldest first)"
        ]
      }
    ]);

  cardCollectionSection.changeFieldControl("sortOrder", "builtin", "dropdown", {
    helpText:
      "Date sorting will only apply to card entries with `date` fields, e.g. Simple page."
  });
};

module.exports.down = (migration) => {
  migration.editContentType("cardCollectionSection").deleteField("sortOrder");
};
