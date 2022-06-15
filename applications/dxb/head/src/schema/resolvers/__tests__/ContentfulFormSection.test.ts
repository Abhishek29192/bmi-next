import ContentfulFormSection from "../ContentfulFormSection";
import { Context, Node } from "../types/Gatsby";

const source: Node = {
  id: "source",
  children: null,
  parent: null,
  internal: null
};

const context: Context = {
  nodeModel: {
    findAll: jest
      .fn()
      .mockResolvedValue([{ id: "asset-type-1" }, { id: "asset-type-2" }]),
    findOne: jest.fn(),
    getNodeById: jest.fn().mockImplementation(({ id }: { id: string }) =>
      Promise.resolve({
        id
      })
    ),
    getNodesByIds: jest.fn()
  }
};

interface HubSpotField {
  name: string;
  label: string;
  fieldType: string;
  required: boolean;
  options: { value: string }[];
}

const createHubSpotField = (field?: Partial<HubSpotField>): HubSpotField => ({
  name: "field",
  fieldType: "text",
  required: false,
  label: "field",
  options: [],
  ...field
});

jest.mock("@bmi/utils", () => {
  const originalModule = jest.requireActual("@bmi/utils");

  return {
    ...originalModule,
    generateHashFromString: (name: string) => name
  };
});

describe("ContentfulFormSection resolver", () => {
  it("should contain specific type", () => {
    expect(ContentfulFormSection.inputs.type).toEqual(["ContentfulFormInputs"]);
  });

  it("should return input nodes", async () => {
    expect(
      await ContentfulFormSection.inputs.resolve(
        { ...source, inputs___NODE: ["input-1", "input-2"] },
        null,
        context
      )
    ).toEqual([{ id: "input-1" }, { id: "input-2" }]);
  });

  it("should return null if source without inputs___NODE", async () => {
    expect(
      await ContentfulFormSection.inputs.resolve(source, null, context)
    ).toBeNull();
  });

  describe("source HubSpot", () => {
    const hubspot: Node = { ...source, source: "HubSpot" };
    process.env.HUBSPOT_API_KEY = "HUBSPOT_API_KEY";

    afterEach(() => jest.resetAllMocks());

    it("should throw error if no HUBSPOT_API_KEY", async () => {
      process.env.HUBSPOT_API_KEY = "";
      try {
        await ContentfulFormSection.inputs.resolve(hubspot, null, context);
      } catch (error) {
        expect(error).toEqual(new Error("No Hubspot API key provided"));
      }
      process.env.HUBSPOT_API_KEY = "HUBSPOT_API_KEY";
    });
    it("should return empty array if no hubSpotForm found", async () => {
      context.nodeModel.getNodeById = jest.fn();

      expect(
        await ContentfulFormSection.inputs.resolve(hubspot, null, context)
      ).toEqual([]);
    });
    it("should return fields if no legalConsentOptions metadata provided", async () => {
      context.nodeModel.getNodeById = jest.fn().mockResolvedValueOnce({
        formFieldGroups: [
          { isPageBreak: true },
          { fields: [] },
          {
            fields: [
              createHubSpotField({
                options: [{ value: "option-1" }, { value: "option-2" }]
              })
            ]
          },
          { fields: [createHubSpotField({ name: "mobilephone" })] },
          { fields: [createHubSpotField({ name: "email" })] },
          { fields: [createHubSpotField({ fieldType: "wrong-type" })] }
        ],
        metaData: []
      });
      expect(
        await ContentfulFormSection.inputs.resolve(hubspot, null, context)
      ).toEqual([
        {
          children: [],
          id: expect.any(String),
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "field",
          name: "field",
          options: "option-1, option-2",
          parent: "source",
          required: false,
          type: "text",
          width: "full"
        },
        {
          children: [],
          id: expect.any(String),
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "field",
          name: "mobilephone",
          options: "",
          parent: "source",
          required: false,
          type: "phone",
          width: "full"
        },
        {
          children: [],
          id: expect.any(String),
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "field",
          name: "email",
          options: "",
          parent: "source",
          required: false,
          type: "email",
          width: "full"
        },
        {
          children: [],
          id: expect.any(String),
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "field",
          name: "field",
          options: "",
          parent: "source",
          required: false,
          type: "text",
          width: "full"
        }
      ]);
    });
    it("should return additional field from legalConsentOptions", async () => {
      context.nodeModel.getNodeById = jest.fn().mockResolvedValueOnce({
        formFieldGroups: [{ fields: [createHubSpotField()] }],
        metaData: [
          {
            name: "legalConsentOptions",
            value: JSON.stringify({
              isLegitimateInterest: true,
              communicationConsentCheckboxes: [
                { communicationTypeId: "communication-type-1" }
              ],
              communicationConsentText: true,
              processingConsentText: true,
              processingConsentType: "REQUIRED_CHECKBOX",
              processingConsentCheckboxLabel: "<p>label</p>",
              privacyPolicyText: true
            })
          }
        ]
      });
      expect(
        await ContentfulFormSection.inputs.resolve(hubspot, null, context)
      ).toEqual([
        {
          children: [],
          id: expect.any(String),
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "field",
          name: "field",
          options: "",
          parent: "source",
          required: false,
          type: "text",
          width: "full"
        },
        {
          children: [],
          id: "HubSpot.Legal.isLegitimateInterest.communication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "true",
          name: "hs-legal-isLegitimateInterest",
          parent: "source",
          type: "hubspot-hidden",
          width: "full"
        },
        {
          children: [],
          id: "HubSpot.Legal.ID.communication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "communication-type-1",
          name: "hs-legal-communicationTypeId",
          parent: "source",
          type: "hubspot-hidden"
        },
        {
          children: [],
          id: "HubSpot.Legal.communicationConsentText.communication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "true",
          name: "hs-legal-communicationConsentText",
          parent: "source",
          type: "hubspot-text",
          width: "full"
        },
        {
          children: [],
          id: "HubSpot.Legal.processingConsentText.communication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "true",
          name: "hs-legal-processingConsentText",
          parent: "source",
          type: "hubspot-text",
          width: "full"
        },
        {
          children: [],
          id: "HubSpot.Legal.processingConsentType.communication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "label",
          name: "hs-legal-processingConsentType",
          parent: "source",
          required: true,
          type: "hubspot-checkbox",
          width: "full"
        },
        {
          children: [],
          id: "HubSpot.Legal.privacyPolicyText.communication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "true",
          name: "hs-legal-privacyPolicyText",
          parent: "source",
          type: "hubspot-text",
          width: "full"
        }
      ]);
    });

    it("should return additinal field if isLegitimateInterest setted to false", async () => {
      context.nodeModel.getNodeById = jest.fn().mockResolvedValueOnce({
        formFieldGroups: [{ fields: [createHubSpotField()] }],
        metaData: [
          {
            name: "legalConsentOptions",
            value: JSON.stringify({
              isLegitimateInterest: false,
              communicationConsentCheckboxes: [
                {
                  communicationTypeId: "communication-type-1",
                  label: "<p>label</p>",
                  required: true
                }
              ]
            })
          }
        ]
      });
      expect(
        await ContentfulFormSection.inputs.resolve(hubspot, null, context)
      ).toEqual([
        {
          children: [],
          id: expect.any(String),
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "field",
          name: "field",
          options: "",
          parent: "source",
          required: false,
          type: "text",
          width: "full"
        },

        {
          children: [],
          id: "HubSpot.Legal.ID.communication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "communication-type-1",
          name: "hs-legal-communicationTypeId",
          parent: "source",
          type: "hubspot-hidden"
        },
        {
          children: [],
          id: "LEGAL_CONSENTcommunication-type-1",
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "label",
          name: "hs-legal-communication",
          parent: "source",
          required: true,
          type: "hubspot-checkbox",
          width: "full"
        }
      ]);
    });

    it("should do not retur additional field if legalConsentOptions is empty", async () => {
      context.nodeModel.getNodeById = jest.fn().mockResolvedValueOnce({
        formFieldGroups: [{ fields: [createHubSpotField()] }],
        metaData: [
          {
            name: "legalConsentOptions",
            value: JSON.stringify({})
          }
        ]
      });
      expect(
        await ContentfulFormSection.inputs.resolve(hubspot, null, context)
      ).toEqual([
        {
          children: [],
          id: expect.any(String),
          internal: {
            contentDigest: expect.any(String),
            owner: "@bmi/resolvers",
            type: "contentfulFormSectionInputsJsonNode"
          },
          label: "field",
          name: "field",
          options: "",
          parent: "source",
          required: false,
          type: "text",
          width: "full"
        }
      ]);
    });
  });
});
