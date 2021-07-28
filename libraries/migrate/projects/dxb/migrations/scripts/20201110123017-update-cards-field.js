module.exports.description = "Impose a minimum of two cards";

module.exports.up = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards").validations([{ size: { min: 2 } }]);
};

module.exports.down = (migration) => {
  const cardCollectionSection = migration.editContentType(
    "cardCollectionSection"
  );

  cardCollectionSection.editField("cards").validations([]);
};
