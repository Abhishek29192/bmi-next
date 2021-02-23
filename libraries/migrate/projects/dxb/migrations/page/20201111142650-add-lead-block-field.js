module.exports.description = "Add lead block field";

module.exports.up = (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  page
    .createField("leadBlock")
    .name("Lead Block")
    .type("Link")
    .validations([{ linkContentType: ["leadBlockSection"] }])
    .linkType("Entry");

  migration.transformEntries({
    contentType: "page",
    from: ["title", "sections"],
    to: ["leadBlock"],
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const sectionEntries = fromFields.sections
        ? fromFields.sections[currentLocale]
        : [];
      let entries;

      try {
        entries = (
          await Promise.all(
            sectionEntries.map((entry) => {
              return makeRequest({
                method: "GET",
                url: `/entries/${entry.sys.id}`
              });
            })
          )
        ).filter(({ sys: { contentType } }) => {
          return contentType.sys.id === "leadBlockSection";
        });
      } catch (error) {
        console.error(
          `LeadBlockSection: Something went wrong while fetching section entries for ${fromFields.title[currentLocale]}`
        );
        return;
      }

      if (!entries.length) {
        return;
      }

      if (entries.length > 1) {
        console.warn(
          `LeadBlockSection: More than one LeadBlockSection found. Only the first entry will be used in the lead block field. Make sure you manually edit the ${fromFields.title} page.`
        );
      }

      return {
        leadBlock: sectionEntries.find(
          (entry) => entry.sys.id === entries[0].sys.id
        )
      };
    }
  });

  page.moveField("leadBlock").beforeField("sections");
};

module.exports.down = async (migration) => {
  const page = migration.editContentType("page");

  page.deleteField("leadBlock");
};
