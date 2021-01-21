module.exports.description =
  "Add tags field to team page content type with entries";

module.exports.up = (migration) => {
  const teamPage = migration.editContentType("teamPage");

  teamPage
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

  teamPage.changeFieldControl("tags", "builtin", "entryCardsEditor", {
    helpText: "Please add tags to group content or specify the type of page"
  });

  teamPage.moveField("tags").afterField("tag");

  migration.transformEntries({
    contentType: "teamPage",
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
  teamPage.editField("tag").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const teamPage = migration.editContentType("teamPage");

  teamPage.editField("tag").disabled(false).omitted(false);

  migration.transformEntries({
    contentType: "teamPage",
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

  teamPage.deleteField("tags");
};
