module.exports.description =
  "Add single row display option to card collection content type";

const contentType = "cardCollectionSection";
const fieldName = "displaySingleRow";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(contentType);

  cardCollectionSection
    .createField(fieldName)
    .name("Display on a single row")
    .type("Boolean");

  cardCollectionSection.changeFieldControl(fieldName, "builtin", "boolean");
};

module.exports.down = (migration) => {
  const cardCollectionSection = migration.editContentType(contentType);
  cardCollectionSection.deleteField(fieldName);
};
