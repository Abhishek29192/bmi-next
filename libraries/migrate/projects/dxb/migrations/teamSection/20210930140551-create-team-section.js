module.exports.description = "Create Team Section";

module.exports.up = (migration) => {
  const teamSection = migration
    .createContentType("teamSection")
    .name("Team Section")
    .displayField("title")
    .description("");

  teamSection.createField("title").name("Title").type("Symbol").required(true);

  teamSection
    .createField("items")
    .name("Items")
    .type("Array")
    .required(true)
    .validations([{ size: { min: 1 } }])
    .items({
      type: "Link",
      validations: [{ linkContentType: ["teamCategory"] }],
      linkType: "Entry"
    });

  teamSection.changeFieldControl("title", "builtin", "singleLine");
  teamSection.changeFieldControl("items", "builtin", "entryLinksEditor");
};

module.exports.down = (migration) => migration.deleteContentType("teamSection");
