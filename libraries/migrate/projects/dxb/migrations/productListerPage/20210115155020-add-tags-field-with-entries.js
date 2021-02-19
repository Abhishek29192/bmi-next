module.exports.description =
  "Add tags field to product lister product lister page content type with entries";

module.exports.up = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage
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

  productListerPage.changeFieldControl("tags", "builtin", "entryCardsEditor", {
    helpText: "Please add tags to group content or specify the type of page"
  });

  productListerPage.moveField("tags").afterField("tag");

  migration.transformEntries({
    contentType: "productListerPage",
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
  productListerPage.editField("tag").disabled(true).omitted(true);
};

module.exports.down = (migration) => {
  const productListerPage = migration.editContentType("productListerPage");

  productListerPage.editField("tag").disabled(false).omitted(false);

  migration.transformEntries({
    contentType: "productListerPage",
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

  productListerPage.deleteField("tags");
};
