module.exports.description = "Add brand logo field to page content type";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");

  page
    .createField("brandLogo")
    .name("Brand Logo")
    .type("Symbol")
    .validations([
      { in: ["Icopal", "Zanda", "Monier", "Monarplan", "AeroDek"] }
    ]);

  page.moveField("brandLogo").afterField("featuredImage");
};

module.exports.down = (migration) => {
  const page = migration.editContentType("page");

  page.deleteField("brandLogo");
};
