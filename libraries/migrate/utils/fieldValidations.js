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
  }
};
