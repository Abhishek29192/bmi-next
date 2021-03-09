"use strict";

const { getInFieldValidations } = require("../../../../utils/fieldValidations");

module.exports.description = "";

module.exports.up = async (migration, { makeRequest }) => {
  const link = migration.editContentType("link");

  const { inFieldValidation } = await getInFieldValidations(
    makeRequest,
    link.id,
    "type"
  );

  link.editField("type", {
    validations: [{ in: [...inFieldValidation, "Visualiser"] }]
  });

  link.createField("parameters").name("Parameters").type("Object");

  link.changeFieldControl("parameters", "builtin", "objectEditor", {
    helpText:
      "Guidance for configuring parameters is available here: https://bmigroup.atlassian.net/l/c/nWbwfPj1"
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
      { in: inFieldValidation.filter((item) => item !== "Visualiser") }
    ]
  });

  link.deleteField("parameters");
};
