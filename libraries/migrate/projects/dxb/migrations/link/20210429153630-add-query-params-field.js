"use strict";

module.exports.description = "add query params field to internal links";

module.exports.up = async (migration) => {
  const link = migration.editContentType("link");

  link.createField("queryParams").name("Query Params").type("Symbol");

  link.changeFieldControl("queryParams", "Symbol", "singleLine", {
    helpText:
      "Provide query parameters to internal linked page. e.g. chip=Pitched+roof,Flat+roof&Param2=example1,example2"
  });

  link.moveField("queryParams").afterField("linkedPage");
};

module.exports.down = async (migration) => {
  const link = migration.editContentType("link");

  link.deleteField("queryParams");
};
