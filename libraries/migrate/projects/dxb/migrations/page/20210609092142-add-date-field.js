"use strict";

module.exports.description = "Add date field";

module.exports.up = (migration) => {
  const page = migration.editContentType("page");
  page.createField("date").name("Date").type("Date");
  page.moveField("date").afterField("leadBlock");
};

module.exports.down = (migration) => {
  migration.editContentType("page").deleteField("date");
};
