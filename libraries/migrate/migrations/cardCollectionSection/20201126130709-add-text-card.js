module.exports.description = "Add Text Card to Card Collection Section";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    .validations([{ in: ["Highlight Card", "Story Card", "Text Card"] }]);
};

module.exports.down = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection
    .editField("cardType")
    .validations([{ in: ["Highlight Card", "Story Card"] }]);
};
