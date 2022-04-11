module.exports.description = "Changed required status of image field";

module.exports.up = (migration) => {
  const image = migration.editContentType("image");
  image.editField("image").required(true);
};

module.exports.down = (migration) => {
  const image = migration.editContentType("image");
  image.editField("image").required(false);
};
