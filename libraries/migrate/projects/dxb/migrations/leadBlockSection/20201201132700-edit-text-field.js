"use strict";

module.exports.description = "Edit the text field for the Lead Block Section";

const {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} = require("../../../../utils/richTextValidations");

module.exports.up = async (migration, { makeRequest }) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "leadBlockSection",
    "text"
  );

  leadBlockSection.editField("text").validations([
    {
      enabledNodeTypes: [
        ...enabledNodeTypesValidation.enabledNodeTypes,
        "heading-2"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...enabledNodeTypesValidation.enabledNodeTypes,
        "heading-2"
      ])
    }
  ]);
};

module.exports.down = async (migration, { makeRequest }) => {
  const leadBlockSection = migration.editContentType("leadBlockSection");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "leadBlockSection",
    "text"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation.enabledNodeTypes.filter(
      (node) => node !== "heading-2"
    );

  leadBlockSection.editField("text").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
