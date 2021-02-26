module.exports.description = "Delete tag field from page content type";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page.deleteField("tag");
};
