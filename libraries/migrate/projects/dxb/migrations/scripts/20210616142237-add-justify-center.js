module.exports.description = "Add justify center option";

const contentType = "cardCollectionSection";
const fieldName = "justifyCenter";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(contentType);

  cardCollectionSection
    .createField(fieldName)
    .name("Justify Center")
    .type("Boolean");

  cardCollectionSection.changeFieldControl(fieldName, "builtin", "boolean");
};

module.exports.down = (migration) => {
  const cardCollectionSection = migration.editContentType(contentType);
  cardCollectionSection.deleteField(fieldName);
};
