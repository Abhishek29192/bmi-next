module.exports.description =
  "Delete tag field from contact us page content type";

module.exports.up = (migration) => {
  const contactUsPage = migration.editContentType("contactUsPage");

  contactUsPage.deleteField("tag");
};
