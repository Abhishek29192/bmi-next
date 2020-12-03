module.exports.description = "Add description field";

module.exports.up = (migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.createField("description").name("Description").type("Text");

  syndicateSection.moveField("description").afterField("title");
};

module.exports.down = (migration) => {
  const syndicateSection = migration.editContentType("villainSection");

  syndicateSection.deleteField("description");
};
