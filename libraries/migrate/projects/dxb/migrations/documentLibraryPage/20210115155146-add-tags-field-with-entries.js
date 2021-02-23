module.exports.description =
  "Add tags field to document library page content type with entries";

module.exports.up = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage
    .createField("tags")
    .name("Tags")
    .type("Array")
    .items({
      type: "Link",
      validations: [
        {
          linkContentType: ["tag"]
        }
      ],
      linkType: "Entry"
    });

  documentLibraryPage.changeFieldControl(
    "tags",
    "builtin",
    "entryCardsEditor",
    {
      helpText: "Please add tags to group content or specify the type of page"
    }
  );

  documentLibraryPage.moveField("tags").afterField("tag");

  migration.transformEntries({
    contentType: "documentLibraryPage",
    from: ["tag"],
    to: ["tags"],
    transformEntryForLocale: async ({ tag }, currentLocale) => {
      if (!tag) {
        return;
      }

      return {
        tags: [tag[currentLocale]]
      };
    }
  });

  // For safety, task to remove the `tag` field tracked by:
  // https://bmigroup.atlassian.net/browse/DXB-1409
  documentLibraryPage.editField("tag").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const documentLibraryPage = migration.editContentType("documentLibraryPage");

  documentLibraryPage.editField("tag").disabled(false).omitted(false);

  migration.transformEntries({
    contentType: "documentLibraryPage",
    from: ["tags"],
    to: ["tag"],
    transformEntryForLocale: async ({ tag }, currentLocale) => {
      if (!tag) {
        return;
      }

      return {
        tag: tag[currentLocale]
      };
    }
  });

  documentLibraryPage.deleteField("tags");
};
