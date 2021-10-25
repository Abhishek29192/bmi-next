module.exports.description = "Create Maximum Samples";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField("maximumSamples")
    .name("Maximum Samples")
    .type("Number");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField("maximumSamples");
};
