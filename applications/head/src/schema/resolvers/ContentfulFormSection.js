"use strict";

const {
  generateIdFromString,
  generateDigestFromData
} = require("./utils/encryption");

require("dotenv").config({
  path: `./.env.${process.env.NODE_ENV}`
});

const getNodeData = (parentId, fieldData) => ({
  ...fieldData,
  parent: parentId,
  children: [],
  internal: {
    type: "contentfulFormSectionInputsJsonNode",
    owner: "@bmi/resolvers",
    contentDigest: generateDigestFromData(fieldData)
  }
});

const hubSpotFieldtoBMIFieldMap = {
  text: "text",
  textarea: "textarea",
  number: "text",
  select: "select",
  booleancheckbox: "hubspot-checkbox",
  radio: "radio"
  // checkbox: "",
  // file: ""
  // date: ""
};

const mapFields = (type, name) => {
  // hardocde extra validations
  switch (name) {
    case "mobilephone":
      return "phone";
    case "email":
      return "email";
  }

  // default to "text"
  // eslint-disable-next-line security/detect-object-injection
  return hubSpotFieldtoBMIFieldMap[type] || "text";
};

const transformOptions = (options) => {
  return options.map((item) => item.value).join(", ");
};

const getLegalConsentOptions = (metaData) => {
  const legalConsent =
    metaData.find(({ name }) => name === "legalConsentOptions") || null;

  return legalConsent && JSON.parse(legalConsent.value);
};

module.exports = {
  inputs: {
    type: ["ContentfulFormInputs"],
    async resolve(source, args, context) {
      if (source.source === "HubSpot") {
        const hubSpotForm = await context.nodeModel.getNodeById({
          id: source.hubSpotFormGuid,
          type: "HubspotForm"
        });

        const fields = hubSpotForm.formFieldGroups
          .filter((input) => input.isPageBreak === false)
          .map((input) =>
            getNodeData(source.id, {
              // TODO: I only support basic hubspot form layout (one field per row)
              id: generateIdFromString(source.id + input.fields[0].name),
              name: input.fields[0].name,
              label: input.fields[0].label,
              type: mapFields(input.fields[0].fieldType, input.fields[0].name),
              width: "full",
              required: input.fields[0].required,
              options: transformOptions(input.fields[0].options)
            })
          );

        const legalConsentOptions = getLegalConsentOptions(
          hubSpotForm.metaData
        );
        if (legalConsentOptions) {
          if (legalConsentOptions.communicationConsentText) {
            fields.push(
              getNodeData(source.id, {
                id:
                  "communicationConsentText" +
                  legalConsentOptions.communicationConsentCheckboxes[0]
                    .communicationTypeId,
                name: "communicationConsentText",
                label: legalConsentOptions.communicationConsentText.replace(
                  /(<p[^>]+?>|<p>|<\/p>)/gim,
                  ""
                ),
                type: "hubspot-text",
                width: "full"
              })
            );
          }
          fields.push(
            getNodeData(source.id, {
              id:
                "LEGAL_CONSENT" +
                legalConsentOptions.communicationConsentCheckboxes[0]
                  .communicationTypeId,
              name:
                "LEGAL_CONSENT.subscription_type_" +
                legalConsentOptions.communicationConsentCheckboxes[0]
                  .communicationTypeId,
              label: legalConsentOptions.communicationConsentCheckboxes[0].label.replace(
                /(<p[^>]+?>|<p>|<\/p>)/gim,
                ""
              ),
              type: "hubspot-checkbox",
              width: "full",
              required:
                legalConsentOptions.communicationConsentCheckboxes[0].required
            })
          );
          if (legalConsentOptions.processingConsentText) {
            fields.push(
              getNodeData(source.id, {
                id:
                  "processingConsentText" +
                  legalConsentOptions.communicationConsentCheckboxes[0]
                    .communicationTypeId,
                name: "processingConsentText",
                label: legalConsentOptions.processingConsentText.replace(
                  /(<p[^>]+?>|<p>|<\/p>)/gim,
                  ""
                ),
                type: "hubspot-text",
                width: "full"
              })
            );
          }
          if (legalConsentOptions.privacyPolicyText) {
            fields.push(
              getNodeData(source.id, {
                id:
                  "privacyPolicyText" +
                  legalConsentOptions.communicationConsentCheckboxes[0]
                    .communicationTypeId,
                name: "privacyPolicyText",
                label: legalConsentOptions.privacyPolicyText.replace(
                  /(<p[^>]+?>|<p>|<\/p>)/gim,
                  ""
                ),
                type: "hubspot-text",
                width: "full"
              })
            );
          }
        }

        return fields;
      } else {
        if (source.inputs___NODE && source.inputs___NODE.length) {
          return Promise.all(
            source.inputs___NODE.map((id) => {
              return context.nodeModel.getNodeById({
                id,
                type: "contentfulFormSectionInputsJsonNode"
              });
            })
          );
        }
        return null;
      }
    }
  }
};
