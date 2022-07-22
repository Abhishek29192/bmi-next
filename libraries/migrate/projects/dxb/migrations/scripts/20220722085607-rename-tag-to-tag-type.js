module.exports.description = "<Rename Tag content type to Tag Type>";

module.exports.up = (migration) => {
  const tagType = migration.editContentType("tag");

  tagType.name("Tag Type");
};

module.exports.down = (migration) => {
  const tag = migration.editContentType("tag");

  tag.name("Tag");
};
