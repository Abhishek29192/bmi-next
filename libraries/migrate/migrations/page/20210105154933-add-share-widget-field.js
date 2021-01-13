"use strict";

module.exports.description = "Add share widget field";

module.exports.up = (migration, { makeRequest }) => {
  const page = migration.editContentType("page");

  page
    .createField("shareWidget")
    .name("Share Widget")
    .type("Link")
    .validations([{ linkContentType: ["shareWidgetSection"] }])
    .linkType("Entry");

  migration.transformEntries({
    contentType: "page",
    from: ["title", "sections"],
    to: ["shareWidget"],
    transformEntryForLocale: async (fromFields, currentLocale) => {
      const sectionEntries = fromFields.sections
        ? fromFields.sections[currentLocale]
        : [];
      let entries;

      try {
        entries = (
          await Promise.all(
            sectionEntries.map((entry) =>
              makeRequest({
                method: "GET",
                url: `/entries/${entry.sys.id}`
              })
            )
          )
        ).filter(
          ({ sys: { contentType } }) =>
            contentType.sys.id === "shareWidgetSection"
        );
      } catch (error) {
        console.error(
          `ShareWidgetSection: Something went wrong while fetching section entries for "${fromFields.title[currentLocale]}"`
        );
        return;
      }

      if (!entries.length) {
        return;
      }

      if (entries.length > 1) {
        console.warn(
          `ShareWidgetSection: More than one ShareWidgetSection found. Only the first entry will be used in the share widget field. Make sure you manually edit the "${fromFields.title[currentLocale]}" page.`
        );
      }

      const entryIds = entries.map((entry) => entry.sys.id);

      return {
        shareWidget: sectionEntries.find(
          (entry) => entry.sys.id === entryIds[0]
        ),
        sections: sectionEntries.filter(
          (entry) => !entryIds.includes(entry.sys.id)
        )
      };
    }
  });

  page.moveField("shareWidget").beforeField("leadBlock");
};

module.exports.down = async (migration) => {
  const page = migration.editContentType("page");

  page.deleteField("shareWidget");
};
