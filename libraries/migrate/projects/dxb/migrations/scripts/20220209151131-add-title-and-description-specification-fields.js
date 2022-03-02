module.exports.description = "Create PDP specification title and description";

const title = "pdpSpecificationTitle";
const description = "pdpSpecificationDescription";

module.exports.up = (migration) => {
  const resources = migration.editContentType("resources");

  resources
    .createField(title)
    .name("Product Details Page: Specification title")
    .type("Symbol");

  resources
    .createField(description)
    .name("Product Details Page: Specification description")
    .type("RichText");
};

module.exports.down = (migration) => {
  const resources = migration.editContentType("resources");
  resources.deleteField(title);
  resources.deleteField(description);
};
