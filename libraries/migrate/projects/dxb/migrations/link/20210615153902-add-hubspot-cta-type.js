"use strict";

const { getInFieldValidations } = require("../../../../utils/fieldValidations");

module.exports.description = "Add HubSpot CTA type";

module.exports.up = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    validations: [{ in: [...inFieldValidation, "HubSpot CTA"] }]
  });

  link.createField("hubSpotCTAID").name("HubSpot CTA ID").type("Symbol");
};

module.exports.down = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    validations: [
      { in: inFieldValidation.filter((item) => item !== "HubSpot CTA") }
    ]
  });

  link.deleteField("hubSpotCTAID");
};
