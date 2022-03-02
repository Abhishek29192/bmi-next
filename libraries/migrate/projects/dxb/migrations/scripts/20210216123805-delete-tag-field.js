module.exports.description =
  "Delete tag field from brand landing page content type";

module.exports.up = (migration) => {
  const brandLandingPage = migration.editContentType("brandLandingPage");

  brandLandingPage.deleteField("tag");
};
