"use strict";

module.exports.description =
  "Add recipients field and remove method and action";

module.exports.up = (migration) => {
  const form = migration.editContentType("form");
  form.deleteField("action");
  form.deleteField("method");
  form
    .createField("successRedirect")
    .name("Success redirect")
    .type("Link")
    .validations([{ linkContentType: ["link"] }])
    .linkType("Entry");
  form
    .createField("recipients")
    .name("Recipients")
    .type("Symbol")
    .required(true);
  form.moveField("recipients").afterField("description");
};

module.exports.down = (migration) => {
  const form = migration.editContentType("form");
  form.createField("action").name("Action").type("Symbol");
  form
    .createField("method")
    .name("Method")
    .type("Symbol")
    .validations([{ in: ["post", "get", "dialog"] }]);
  form.deleteField("successRedirect");
  form.deleteField("recipients");
};
