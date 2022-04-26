const { getExtensions } = require("../../../../utils/makeRequestUtils");

module.exports.description = "Create Table editor content type";

module.exports.up = async (migration, { makeRequest }) => {
  const table = migration
    .createContentType("tableEditor")
    .name("Table editor")
    .displayField("title");

  table.createField("title").name("Title").type("Text").required(true);

  table.createField("data").name("Data").type("Object");

  const extensions = await getExtensions(makeRequest);

  if (extensions && extensions.items) {
    const tableEditorExtension = extensions.items.find(
      (item) => item.extension.name === "table field editor"
    );
    if (tableEditorExtension) {
      table.changeFieldControl(
        "data",
        "extension",
        tableEditorExtension.sys.id
      );
    }
  }
};

module.exports.down = (migration) => {
  migration.deleteContentType("tableEditor");
};
