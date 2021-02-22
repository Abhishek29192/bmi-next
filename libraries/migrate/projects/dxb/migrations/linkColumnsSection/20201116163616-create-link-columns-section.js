module.exports.description = "Create content type for Link Columns Section";

module.exports.up = (migration) => {
  const linksColumnsSection = migration
    .createContentType("linkColumnsSection")
    .name("Link Columns Section")
    .displayField("title")
    .description("");

  linksColumnsSection
    .createField("title")
    .name("Title")
    .type("Symbol")
    .required(true);

  linksColumnsSection
    .createField("columns")
    .name("Columns")
    .type("Array")
    .required(true)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["navigation"] }],
      linkType: "Entry"
    });
};

module.exports.down = (migration) =>
  migration.deleteContentType("linkColumnsSection");
