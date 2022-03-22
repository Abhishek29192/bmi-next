module.exports.description = "Add link columns field to page content type";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("linkColumns")
    .name("Link Columns")
    .type("Link")
    .validations([{ linkContentType: ["linkColumnsSection"] }])
    .linkType("Entry");

  page.moveField("linkColumns").beforeField("nextBestActions");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");
  page.deleteField("linkColumns");
};
