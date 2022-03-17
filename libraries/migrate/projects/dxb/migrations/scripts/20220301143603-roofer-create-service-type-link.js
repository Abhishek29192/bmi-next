"use strict";

module.exports.description = "Add Roofer Service Type field";

module.exports.up = (migration) => {
  const roofer = migration.editContentType("roofer");

  roofer
    .createField("serviceTypes")
    .name("Services provided by this service provider")
    .type("Array")
    .required(false)
    .items({
      type: "Link",
      validations: [{ linkContentType: ["serviceType"] }],
      linkType: "Entry"
    });

  roofer.changeFieldControl("serviceTypes", "builtin", "entryLinksEditor", {
    helpText: "Services offered by this Entry type at the top of this page"
  });

  roofer.moveField("serviceTypes").afterField("merchantType");
};

module.exports.down = (migration) => {
  const roofer = migration.editContentType("roofer");
  roofer.deleteField("serviceTypes");
};
