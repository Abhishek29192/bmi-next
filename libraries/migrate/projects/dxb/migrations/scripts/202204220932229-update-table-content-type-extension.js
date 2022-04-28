const { getExtensions } = require("../../../../utils/makeRequestUtils");

module.exports.description = "update table contentful extension";

module.exports.up = async (migration, { makeRequest }) => {
  const table = migration.editContentType("table");
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
  const table = migration.editContentType("table");
  table.changeFieldControl("data", "extension", "7zdNJV7cj8MpVwN5ontGk2");
};
