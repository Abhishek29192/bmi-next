"use strict";

const { getInFieldValidations } = require("../../../../utils/fieldValidations");

module.exports.description = "Add Calculator option to link type validation";

module.exports.up = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    validations: [{ in: [...inFieldValidation, "Calculator"] }]
  });
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
      { in: inFieldValidation.filter((item) => item !== "Calculator") }
    ]
  });
};
