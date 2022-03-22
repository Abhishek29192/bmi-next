module.exports.description = "Create PDP fixing tool title and description";

const title = "pdpFixingToolTitle";
const description = "pdpFixingToolDescription";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField(title)
    .name("Product Details Page: Fixing Tool title")
    .type("Symbol");

  resources
    .createField(description)
    .name("Product Details Page: Fixing Tool description")
    .type("RichText");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(title);
  resources.deleteField(description);
};
