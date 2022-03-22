"use strict";

module.exports.description = "Move sortOrder field";

module.exports.up = (migration) => {
  migration
    .editContentType("cardCollectionSection")
    .moveField("sortOrder")
    .afterField("cards");
};

module.exports.down = (migration) => {
  migration
    .editContentType("cardCollectionSection")
    .moveField("sortOrder")
    .afterField("link");
};
