"use strict";

module.exports.description = "Add source field to form";

module.exports.up = (migration) => {
  const form = migration.editContentType("form");
  form
    .createField("source")
    .name("Source")
    .type("Symbol")
    .validations([{ in: ["Contentful", "HubSpot"] }])
    .required(true);
  form.createField("hubSpotFormGuid").name("HubSpot form GUID").type("Symbol");
  form.editField("recipients").required(false);
  form.moveField("source").afterField("description");

  migration.transformEntries({
    contentType: "form",
    from: [],
    to: ["source"],
    transformEntryForLocale: async () => ({
      source: "Contentful"
    })
  });
};

module.exports.down = (migration) => {
  const form = migration.editContentType("form");
  form.deleteField("source");
  form.deleteField("hubSpotFormGuid");
  form.editField("recipients").required(true);
};
