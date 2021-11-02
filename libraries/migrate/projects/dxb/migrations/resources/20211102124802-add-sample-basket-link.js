module.exports.description = "Add link to sample basket";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("sampleBasketLink")
    .name("Samples Basket Link")
    .required(true)
    .type("Link")
    .validations([{ linkContentType: ["page"] }])
    .linkType("Entry");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("sampleBasketLink");
};
