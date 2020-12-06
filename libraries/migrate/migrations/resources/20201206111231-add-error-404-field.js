module.exports.description = "Add error 404 to resources content type";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("errorFourOFour")
    .name("Error: 404")
    .type("Link")
    .validations([{ linkContentType: ["promo"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("errorFourOFour");
};
