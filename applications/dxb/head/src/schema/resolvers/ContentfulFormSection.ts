import { config } from "dotenv";
import {
  generateDigestFromData,
  generateHashFromString
} from "../../../../libraries/utils/src/encryption";
import {
  Context,
  LegalConsent,
  MetaData,
  Node,
  ResolveArgs
} from "./types/Gatsby";

interface FieldData {
  id: string;
  name: string;
  label: string;
  type: string;
  width?: string;
  required?: boolean;
  options?: string;
}

config({
  path: `./.env.${process.env.NODE_ENV}`
});

const getNodeData = (parentId: string, fieldData: FieldData) => ({
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
} as const;

export type HubspotFieldTypes =
  (typeof hubSpotFieldtoBMIFieldMap)[keyof typeof hubSpotFieldtoBMIFieldMap];

export type HubspotFieldNames = "mobilephone" | "email" | string;

const mapFields = (type: HubspotFieldTypes, name: HubspotFieldNames) => {
  // hardcode extra validations
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

// flatten select/radio options to string
const transformOptions = (options: { value: string }[]) => {
  return options.map((item) => item.value).join(", ");
};

const getLegalConsentOptions = (metaData: MetaData[]): LegalConsent => {
  const legalConsent =
    metaData.find(({ name }) => name === "legalConsentOptions") || null;

  return legalConsent && (JSON.parse(legalConsent.value) as LegalConsent);
};

const createLegalCensentField = (
  legalConsentOptions: LegalConsent,
  parentId: string,
  name: string,
  type: string
) => {
  const HubSpotId =
    legalConsentOptions.communicationConsentCheckboxes[0].communicationTypeId;

  return getNodeData(parentId, {
    id: `HubSpot.Legal.${name}.${HubSpotId}`,
    name: `hs-legal-${name}`,
    // eslint-disable-next-line security/detect-object-injection
    label: legalConsentOptions[name]
      .toString()
      .replace(/(<p[^>]+?>|<p>|<\/p>)/gim, ""),
    type: "hubspot-" + type,
    width: "full"
  });
};

export default {
  inputs: {
    type: ["ContentfulFormInputs"],
    async resolve(source: Node, args: ResolveArgs, context: Context) {
      if (source.source === "HubSpot") {
        if (!process.env.HUBSPOT_API_KEY) {
          throw new Error("No Hubspot API key provided");
        }

        const hubSpotForm = await context.nodeModel.getNodeById({
          id: source.hubSpotFormGuid,
          type: "HubspotForm"
        });

        if (!hubSpotForm) {
          // eslint-disable-next-line no-console
          console.warn(
            `HubSpot GUID not found: ${source.hubSpotFormGuid}.\nPlease check entry ${source.contentful_id} in Contentful.`
          );
          return [];
        }

        const fields = hubSpotForm.formFieldGroups
          .filter((input) => {
            // HubSpot provides alternative inputs other than fields.
            if (input.isPageBreak === true) {
              return false;
            }

            if (!input.fields.length) {
              // TODO: Deal with text fields and others.
              return false;
            }

            return true;
          })
          .map((input) =>
            getNodeData(source.id, {
              // TODO: I only support basic hubspot form layout (one field per row)
              id: generateHashFromString(
                source.id + input.fields[0].name,
                true
              ),
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
          /**
           * API: https://legacydocs.hubspot.com/docs/methods/forms/submit_form
           * we have 2 Legal consent options
           * - consent
           * - legitimateInterest
           */

          // hidden
          if (legalConsentOptions.isLegitimateInterest) {
            // simplest option no checkboxes
            fields.push(
              createLegalCensentField(
                legalConsentOptions,
                source.id,
                "isLegitimateInterest",
                "hidden"
              )
            );
          }

          // hidden - save communication ID
          if (legalConsentOptions.communicationConsentCheckboxes) {
            fields.push(
              getNodeData(source.id, {
                id:
                  "HubSpot.Legal.ID." +
                  legalConsentOptions.communicationConsentCheckboxes[0]
                    .communicationTypeId,
                name: "hs-legal-communicationTypeId",
                label:
                  legalConsentOptions.communicationConsentCheckboxes[0]
                    .communicationTypeId,
                type: "hubspot-hidden"
              })
            );
          }

          // display 1 - text
          if (legalConsentOptions.communicationConsentText) {
            fields.push(
              createLegalCensentField(
                legalConsentOptions,
                source.id,
                "communicationConsentText",
                "text"
              )
            );
          }
          // display 2 - checkbox 1
          if (legalConsentOptions.isLegitimateInterest === false) {
            fields.push(
              getNodeData(source.id, {
                id:
                  "LEGAL_CONSENT" +
                  legalConsentOptions.communicationConsentCheckboxes[0]
                    .communicationTypeId,
                name: "hs-legal-communication",
                label:
                  legalConsentOptions.communicationConsentCheckboxes[0].label.replace(
                    /(<p[^>]+?>|<p>|<\/p>)/gim,
                    ""
                  ),
                type: "hubspot-checkbox",
                width: "full",
                required:
                  legalConsentOptions.communicationConsentCheckboxes[0].required
              })
            );
          }

          // display 3 - text - middle
          if (legalConsentOptions.processingConsentText) {
            fields.push(
              createLegalCensentField(
                legalConsentOptions,
                source.id,
                "processingConsentText",
                "text"
              )
            );
          }

          // display 4 - checkbox - 2
          if (
            legalConsentOptions.processingConsentType === "REQUIRED_CHECKBOX"
          ) {
            fields.push(
              getNodeData(source.id, {
                id:
                  "HubSpot.Legal.processingConsentType." +
                  legalConsentOptions.communicationConsentCheckboxes[0]
                    .communicationTypeId,
                name: "hs-legal-processingConsentType",
                label:
                  legalConsentOptions.processingConsentCheckboxLabel.replace(
                    /(<p[^>]+?>|<p>|<\/p>)/gim,
                    ""
                  ),
                type: "hubspot-checkbox",
                width: "full",
                required: true
              })
            );
          }

          // display 5 - text - last
          if (legalConsentOptions.privacyPolicyText) {
            fields.push(
              createLegalCensentField(
                legalConsentOptions,
                source.id,
                "privacyPolicyText",
                "text"
              )
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
