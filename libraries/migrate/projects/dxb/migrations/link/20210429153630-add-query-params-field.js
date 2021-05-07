"use strict";

module.exports.description = "add query params field to internal links";

module.exports.up = async (migration) => {
  const link = migration.editContentType("link");

  link.createField("queryParams").name("Query Params").type("Symbol");

  link.changeFieldControl("queryParams", "Symbol", "singleLine", {
    helpText:
      "Parameter to be appended to the internal link, separate multiple strings by a comma e.g. chip=Pitched+roof,Flat+roof"
  });

  link.moveField("queryParams").afterField("linkedPage");
};

module.exports.down = async (migration) => {
  const link = migration.editContentType("link");

  link.deleteField("queryParams");
};
