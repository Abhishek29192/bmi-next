module.exports.description = "Delete tag field from home page content type";

module.exports.up = (migration) => {
  const homePage = migration.editContentType("homePage");

  homePage.deleteField("tag");
};
