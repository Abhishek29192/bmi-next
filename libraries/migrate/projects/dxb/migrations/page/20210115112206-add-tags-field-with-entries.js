module.exports.description = "Add tags field to page content type with entries";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page
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

  page.changeFieldControl("tags", "builtin", "entryCardsEditor", {
    helpText: "Please add tags to group content or specify the type of page"
  });

  page.moveField("tags").afterField("tag");

  migration.transformEntries({
    contentType: "page",
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
  page.editField("tag").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.editField("tag").disabled(false).omitted(false);

  migration.transformEntries({
    contentType: "page",
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

  page.deleteField("tags");
};
