module.exports.description = "Delete tag field from team page content type";

module.exports.up = (migration) => {
  const teamPage = migration.editContentType("teamPage");

  teamPage.deleteField("tag");
};
