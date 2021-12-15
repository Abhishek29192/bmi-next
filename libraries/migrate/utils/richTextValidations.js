"use strict";

const getRichTextFieldValidations = (field, validationType) => {
  if (field.type !== "RichText") {
    console.warn(
      `getRichTextFieldValidations: The field ${field.name} is of type ${field.type}. Only fields of type "RichText" have ${validationType} validation`
    );
    return {
      enabledNodeTypes: [],
      message: ""
    };
  }

  // eslint-disable-next-line security/detect-object-injection
  return field.validations.find((validation) => validation[validationType]);
};

// See table for set of RichText specific validations
// https://www.contentful.com/developers/docs/references/content-management-api/#/reference/content-types/content-type
module.exports = {
  getEnabledNodeTypesValidations: async (
    makeRequest,
    contentTypeId,
    fieldId
  ) => {
    const contentType = await makeRequest({
      method: "GET",
      url: `/content_types/${contentTypeId}`
    });

    const field = contentType.fields.find(({ id }) => id === fieldId);

    return {
      field,
      enabledNodeTypesValidation: getRichTextFieldValidations(
        field,
        "enabledNodeTypes"
      )
    };
  },
  getMessageFromEnabledNodeTypes: (enabledNodeTypes) => {
    const string = enabledNodeTypes.join(", ").replace(/, ([^,]*)$/, " and $1");

    return `Only ${string} are allowed`;
  }
};
