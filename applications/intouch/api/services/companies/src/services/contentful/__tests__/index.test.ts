import {
  ContentfulGuaranteeTemplatesCollection,
  ContentfulGuaranteeTypeCollection,
  EvidenceCategoryCollection,
  MessageTemplate
} from "@bmi/intouch-api-types";
import {
  getGuaranteeTypeCollection,
  getEvidenceCategory,
  getGuaranteeTemplates,
  messageTemplate,
  tierBenefit
} from "..";

describe("Guarantee", () => {
  const mockClientGateway = jest.fn();

  it("getGuaranteeTypeCollection", async () => {
    const collection = {
      items: [
        {
          name: "test",
          displayName: "test"
        }
      ]
    };
    mockClientGateway.mockImplementationOnce(() => ({
      data: {
        guaranteeTypeCollection: collection
      }
    }));
    const {
      data: { guaranteeTypeCollection }
    }: {
      data: {
        guaranteeTypeCollection: ContentfulGuaranteeTypeCollection;
      };
    } = await getGuaranteeTypeCollection(mockClientGateway, "test");
    expect(guaranteeTypeCollection).toMatchObject(collection);
  });

  it("getEvidenceCategory", async () => {
    const collection = {
      items: [
        {
          name: "test",
          minimumUploads: 1
        }
      ]
    };
    mockClientGateway.mockImplementationOnce(() => ({
      data: {
        evidenceCategoryCollection: collection
      }
    }));
    const {
      data: { evidenceCategoryCollection }
    }: {
      data: { evidenceCategoryCollection: EvidenceCategoryCollection };
    } = await getEvidenceCategory(mockClientGateway, "test");
    expect(evidenceCategoryCollection).toMatchObject(collection);
  });

  it("getGuaranteeTemplates", async () => {
    const collection = {
      items: [
        {
          technology: "test",
          displayName: "test"
        }
      ]
    };
    mockClientGateway.mockImplementationOnce(() => ({
      data: {
        guaranteeTemplateCollection: collection
      }
    }));
    const {
      data: { guaranteeTemplateCollection }
    }: {
      data: {
        guaranteeTemplateCollection: ContentfulGuaranteeTemplatesCollection;
      };
    } = await getGuaranteeTemplates(mockClientGateway, "test", "test", "EN");
    expect(guaranteeTemplateCollection).toMatchObject(collection);
  });

  it("messageTemplate", async () => {
    const collection = {
      items: [
        {
          subject: "subject",
          emailBody: "emailBody",
          notificationBody: "notificationBody,{{project}}",
          format: ["NOTIFICATION"]
        }
      ]
    };
    mockClientGateway.mockImplementationOnce(() => ({
      data: {
        messageTemplateCollection: collection
      }
    }));
    const { data } = await messageTemplate(
      mockClientGateway,
      "REQUEST_SUBMITTED"
    );
    const {
      messageTemplateCollection
    }: {
      messageTemplateCollection: {
        items: [MessageTemplate];
      };
    } = data;
    expect(messageTemplateCollection).toMatchObject(collection);
  });

  it("tierBenefit", async () => {
    const collection = {
      items: [
        {
          name: "tier name",
          tier: "T1",
          shortDescription: "shortDescription"
        }
      ]
    };
    mockClientGateway.mockImplementationOnce(() => ({
      data: {
        tierBenefitCollection: collection
      }
    }));
    const { shortDescription } = await tierBenefit(mockClientGateway, "T1");
    expect(shortDescription).toEqual("shortDescription");
  });
});
