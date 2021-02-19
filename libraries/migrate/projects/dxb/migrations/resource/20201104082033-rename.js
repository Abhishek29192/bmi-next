module.exports.description = "Rename Resource content type";

module.exports.up = (migration) => {
  migration.editContentType("resource", { name: "Micro copy " });
};

module.exports.down = (migration) => {
  migration.editContentType("resource", { name: "Resource " });
};
