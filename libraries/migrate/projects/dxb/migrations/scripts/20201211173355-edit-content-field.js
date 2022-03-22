"use strict";

module.exports.description =
  "Edit the content time for the Product Lister Page";

const {
  getEnabledNodeTypesValidations,
  getMessageFromEnabledNodeTypes
} = require("../../../../utils/richTextValidations");

module.exports.up = async (migration, { makeRequest }) => {
  const productListerPage = migration.editContentType("productListerPage");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "productListerPage",
    "content"
  );

  productListerPage.editField("content").validations([
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
  const productListerPage = migration.editContentType("productListerPage");

  const { enabledNodeTypesValidation } = await getEnabledNodeTypesValidations(
    makeRequest,
    "productListerPage",
    "content"
  );

  const previousEnabledNodes =
    enabledNodeTypesValidation.enabledNodeTypes.filter(
      (node) => node !== "embedded-asset-block"
    );

  productListerPage.editField("content").validations([
    {
      enabledNodeTypes: previousEnabledNodes,
      message: getMessageFromEnabledNodeTypes(previousEnabledNodes)
    }
  ]);
};
