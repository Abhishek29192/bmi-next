"use strict";

const getItemsValidations = (field, validationType = "linkContentType") => {
  if (field.type !== "Array") {
    console.warn(
      `getFieldValidations: The field ${field.name} is of type ${field.type}. Only fields of type "Array" have items validation `
    );
    return [];
  }

  return field.items.validations.find(
    (validation) => validation[validationType]
  )[validationType];
};

module.exports = async (makeRequest, contentTypeId, fieldId) => {
  const pageSectionTypes = await makeRequest({
    method: "GET",
    url: `/content_types/${contentTypeId}`
  });

  const field = pageSectionTypes.fields.find(({ id }) => id === fieldId);

  return {
    field,
    getItemsValidations: getItemsValidations.bind(null, field)
  };
};
