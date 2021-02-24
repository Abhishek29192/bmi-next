"use strict";

const getLinkFieldValidations = (field) => {
  if (field.type !== "Link") {
    console.warn(
      `getLinkFieldValidations: The field ${field.name} is of type ${field.type}. Please specify a "Link" type or use getItemsValidations for items.`
    );
    return { linkContentType: [] };
  }

  return field.validations.find((validation) => validation["linkContentType"])[
    "linkContentType"
  ];
};

const getInFieldValidations = (field) => {
  if (field.type !== "Symbol") {
    console.warn(
      `getInFieldValidations: The field ${field.name} is of type ${field.type}. Please specify a "Symbol" type or use getItemsValidations for items.`
    );
    return { in: [] };
  }

  return field.validations.find((validation) => validation["in"])["in"];
};

module.exports = {
  getLinkContentTypeValidations: async (
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
      linkContentType: getLinkFieldValidations(field)
    };
  },
  getInFieldValidations: async (makeRequest, contentTypeId, fieldId) => {
    const contentType = await makeRequest({
      method: "GET",
      url: `/content_types/${contentTypeId}`
    });

    const field = contentType.fields.find(({ id }) => id === fieldId);

    return {
      field,
      inFieldValidation: getInFieldValidations(field)
    };
  }
};
