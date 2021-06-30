module.exports.description = "Adds country navigation introduction field";

const fieldName = "countryNavigationIntroduction";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(fieldName)
    .name("Country navigation: Introduction")
    .type("RichText")
    .required(true);
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(fieldName);
};
