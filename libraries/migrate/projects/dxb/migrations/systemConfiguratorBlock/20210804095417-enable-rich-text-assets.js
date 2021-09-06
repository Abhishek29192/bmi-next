"use strict";

module.exports.description = "Allow embedding assets in description";

const {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} = require("../../../../utils/richTextValidations");

module.exports.up = async (migration, { makeRequest }) => {
  const systemConfiguratorBlock = migration.editContentType(
    "systemConfiguratorBlock"
  );

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "systemConfiguratorBlock",
    "description"
  );

  systemConfiguratorBlock.editField("description").validations([
    {
      enabledNodeTypes: [
        ...enabledNodeTypesValidation.enabledNodeTypes,
        "embedded-asset-block"
      ],
      message: getMessageFromEnabledNodeTypes([
        ...enabledNodeTypesValidation.enabledNodeTypes,
        "embedded-asset-block"
      ])
    }
  ]);
};

module.exports.down = async (migration, { makeRequest }) => {
  const systemConfiguratorBlock = migration.editContentType(
    "systemConfiguratorBlock"
  );

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "systemConfiguratorBlock",
    "description"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation.enabledNodeTypes.filter(
      (node) => node !== "embedded-asset-block"
    );

  systemConfiguratorBlock.editField("description").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
