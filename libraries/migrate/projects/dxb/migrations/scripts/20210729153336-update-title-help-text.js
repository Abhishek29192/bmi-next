"use strict";

module.exports.description = "Update title help text";

module.exports.up = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("name").name("Label");
  promo.changeFieldControl("title", "builtin", "singleLine", {
    helpText:
      "This text will be displayed with an underline on the Hero. If you do not add a Title the label will be used as the card title of the promo."
  });
};

module.exports.down = (migration) => {
  const promo = migration.editContentType("promo");

  promo.editField("name").name("Name");
  promo.changeFieldControl("title", "builtin", "singleLine", {
    helpText: "This text will be displayed with an underline on the Hero"
  });
};
