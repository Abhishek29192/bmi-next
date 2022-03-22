module.exports.description = "Create SDP Bim Description";

const field = "sdpBimDescription";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: BIM Description Content")
    .type("RichText");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
