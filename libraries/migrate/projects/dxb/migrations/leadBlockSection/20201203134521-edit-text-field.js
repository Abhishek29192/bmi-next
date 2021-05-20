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
        // TODO: Semantic component for presentational variant of headings
        // Tracked by https://bmigroup.atlassian.net/browse/DXB-1179
        "heading-5"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...enabledNodeTypesValidation.enabledNodeTypes,
        "heading-5"
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
      (node) => node !== "heading-5"
    );

  leadBlockSection.editField("text").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
