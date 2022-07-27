module.exports.description = "Rename Tag content type to Category";

module.exports.up = (migration) => {
  const tagType = migration.editContentType("tag");

  tagType.name("Category");
};

module.exports.down = (migration) => {
  const tag = migration.editContentType("tag");

  tag.name("Tag");
};
