module.exports.description = "Remove unused description from villain section";

module.exports.up = (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.editField("description").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const contentType = migration.editContentType("villainSection");

  contentType.editField("description").disabled(false).omitted(false);
};
