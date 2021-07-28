"use strict";

const { internalName } = require("../../variables/helpText/20210421160910");

module.exports.description = "Add title field";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  promo.createField("name").name("Name").type("Symbol").required(true);
  promo.moveField("name").beforeField("title");
  promo.displayField("name");
  promo.changeFieldControl("name", "builtin", "singleLine", {
    helpText: internalName
  });

  promo.editField("title").required(false);

  migration.transformEntries({
    contentType: "promo",
    from: ["title"],
    to: ["name"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ title }, currentLocale) => ({
      name: (title && title[currentLocale]) || "Untitled"
    })
  });
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");

  migration.transformEntries({
    contentType: "promo",
    from: ["name", "title"],
    to: ["title"],
    shouldPublish: "preserve",
    transformEntryForLocale: async ({ name, title }, currentLocale) => {
      if (title) {
        return;
      }

      return {
        title: (name && name[currentLocale]) || "Untitled"
      };
    }
  });

  promo.editField("title").required(true);
  promo.displayField("title");

  promo.deleteField("name");
};
