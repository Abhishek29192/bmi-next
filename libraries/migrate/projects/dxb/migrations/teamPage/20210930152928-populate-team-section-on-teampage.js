module.exports.description = "Add teamSection as prep for move to simple page";

module.exports.up = (migration) => {
  const teamPage = migration.editContentType("teamPage");

  teamPage
    .createField("teamSection")
    .name("Team Section")
    .type("Link")
    .validations([{ linkContentType: ["teamSection"] }])
    .linkType("Entry");

  migration.deriveLinkedEntries({
    contentType: "teamPage",
    derivedContentType: "teamSection",
    from: ["title", "teamCategories"],
    toReferenceField: "teamSection",
    derivedFields: ["title", "items"],
    identityKey: async (fromFields) => {
      const idKey = Object.values(fromFields.title)
        .toString()
        .toLowerCase()
        .replace(/\s/g, "-")
        .replace(/[^0-9a-z]/gi, "");
      return idKey;
    },
    shouldPublish: true,
    deriveEntryForLocale: async (inputFields) => {
      const title = Object.values(inputFields.title).toString();
      const items = Object.values(inputFields.teamCategories)[0];

      return {
        title,
        items
      };
    }
  });
};

module.exports.down = (migration) => {
  const teamPage = migration.editContentType("teamPage");
  teamPage.deleteField("teamSections");
};
