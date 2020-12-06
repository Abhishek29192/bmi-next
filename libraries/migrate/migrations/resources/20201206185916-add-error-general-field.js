module.exports.description = "Add general error to resources content type";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField("errorGeneral")
    .name("Error: General")
    .type("Link")
    .validations([{ linkContentType: ["promo"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");

  resources.deleteField("errorGeneral");
};
