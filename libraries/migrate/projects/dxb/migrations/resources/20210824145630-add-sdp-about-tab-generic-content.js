module.exports.description = "Create About lead block cta on SDP";

const field = "sdpSidebarItems";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");
  resources
    .createField(field)
    .name("System Details Page: Sidebar Items")
    .type("Array")
    .required(false)
    .validations([{ size: { max: 1 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["titleWithContent"] }],
      linkType: "Entry"
    });
  resources.changeFieldControl(
    "pdpSidebarItems",
    "builtin",
    "entryLinksEditor"
  );
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(field);
};
