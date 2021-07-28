module.exports.description = "Create Table content type";

module.exports.up = (migration) => {
  const table = migration
    .createContentType("table")
    .name("Table")
    .displayField("title");

  table.createField("title").name("Title").type("Text").required(true);

  table.createField("data").name("Data").type("Object");

  // TODO: Figure out extension widgetIDs
  // https://www.contentful.com/developers/docs/references/content-management-api/#/reference/ui-extensions/extensions-collection
  // https://www.contentful.com/developers/docs/concepts/editor-interfaces/#custom-widgets
  table.changeFieldControl("data", "extension", "7zdNJV7cj8MpVwN5ontGk2");
};

module.exports.down = (migration) => {
  migration.deleteContentType("table");
};
