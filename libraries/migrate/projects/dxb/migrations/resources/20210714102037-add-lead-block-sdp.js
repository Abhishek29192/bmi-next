module.exports.description = "Create lead block cta on SDP";

const field = "sdpLeadBlockCta";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: Lead Block CTA")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");

  resources.changeFieldControl(field, "builtin", "entryLinkEditor");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
