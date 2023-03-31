import * as devLog from "../../../utils/devLog";
import createService from "../../../__tests__/helpers/ServiceHelper";
import { EntryTypeEnum } from "../../Service";
import { createCompanyDetails } from "../components";

const { ROOFER_TYPE, BRANCH_TYPE, MERCHANT_TYPE } = EntryTypeEnum;

jest.spyOn(devLog, "devLog");

afterEach(jest.clearAllMocks);

describe("createCompanyDetails", () => {
  const getMicroCopyMock = jest.fn().mockImplementation((copy: string) => copy);
  it("should return correct array of details for sectionType = ROOFER_TYPE", () => {
    const service = createService({
      serviceTypes: [
        { __typename: "ContentfulServiceType", name: "Pitched Roof" }
      ]
    });
    const details = createCompanyDetails(
      ROOFER_TYPE,
      service,
      "en",
      getMicroCopyMock,
      false,
      "googleURLLatLng"
    );
    const typeObject = details.find(
      (item) => item.label === "findARoofer.roofTypeLabel"
    );
    expect(typeObject.label).toBeTruthy();
  });
  it("should return details array for sectionType = BRANCH_TYPE", () => {
    const service = createService();
    const details = createCompanyDetails(
      BRANCH_TYPE,
      service,
      "en",
      getMicroCopyMock,
      false,
      "googleURLLatLng"
    );
    const faxObject = details.find((item) => item.label === "global.fax");
    expect(faxObject.label).toBeTruthy();
  });
  it("should return details array for sectionType = MERCHANT_TYPE", () => {
    const service = createService();
    const details = createCompanyDetails(
      MERCHANT_TYPE,
      service,
      "en",
      getMicroCopyMock,
      false,
      "googleURLLatLng"
    );
    const faxObject = details.find((item) => item.label === "global.fax");
    const typeObject = details.find(
      (item) => item.label === "findARoofer.roofTypeLabel"
    );
    expect(faxObject).toBeFalsy();
    expect(typeObject).toBeFalsy();
  });
  it("should return empty details array for sectionType = undefined", () => {
    const service = createService();
    const sectionType = undefined;
    const details = createCompanyDetails(
      sectionType,
      service,
      "en",
      getMicroCopyMock,
      false,
      "googleURLLatLng"
    );
    expect(devLog.devLog).toHaveBeenCalledWith(
      "Invalid section type passed to service locator:",
      sectionType
    );
    expect(details).toStrictEqual([]);
  });

  describe("When service contains empty fields", () => {
    it("should not return empty fields in company details", () => {
      const service = createService({
        phone: null,
        email: null,
        website: null,
        fax: null,
        serviceTypes: null,
        certification: null,
        summary: null
      });
      const details = createCompanyDetails(
        BRANCH_TYPE,
        service,
        "en",
        getMicroCopyMock,
        false,
        "googleURLLatLng"
      );
      const phoneObject = details.find((item) => item.type === "phone");
      const email = details.find((item) => item.type === "email");
      const websiteObject = details.find((item) => item.type === "website");
      const faxObject = details.find((item) => item.label === "fax");
      const serviceTypesObject = details.find(
        (item) => item.type === "content"
      );
      const certificationObject = details.find(
        (item) => item.type === "roofProLevel"
      );
      const distanceObject = details.find((item) => item.type === "distance");
      const addressObject = details.find((item) => item.type === "address");
      expect(phoneObject).toBeUndefined();
      expect(email).toBeUndefined();
      expect(websiteObject).toBeUndefined();
      expect(faxObject).toBeUndefined();
      expect(serviceTypesObject).toBeUndefined();
      expect(certificationObject).toBeUndefined();

      expect(addressObject).toBeTruthy();
      expect(distanceObject).toBeTruthy();
    });
  });

  describe("when certification is populated", () => {
    it("should return certification object", () => {
      const service = createService({
        certification: "expert"
      });
      const details = createCompanyDetails(
        ROOFER_TYPE,
        service,
        "en",
        getMicroCopyMock,
        false,
        "googleURLLatLng"
      );
      const certificationObject = details.find(
        (item) => item.type === "roofProLevel"
      );
      expect(certificationObject).toBeTruthy();
    });
  });

  describe("when localisation returns undefined for requested key", () => {
    it("should label without localisation suffix", () => {
      const getMicroCopyMock = jest
        .fn()
        .mockImplementation((copy: string) => undefined);
      const service = createService({
        certification: "expert",
        address: "1 street, PO5T C0DE"
      });
      const details = createCompanyDetails(
        ROOFER_TYPE,
        service,
        "en",
        getMicroCopyMock,
        false,
        "googleURLLatLng"
      );
      const certificationObject = details.find(
        (item) => item.type === "roofProLevel"
      );
      const addressObject = details.find((item) => item.type === "address");
      expect(certificationObject).toBeTruthy();
      expect(addressObject).toBeTruthy();
    });
  });

  describe("when service websiteLinkAsLabel set to true", () => {
    describe("and service entry type is ROOFER", () => {
      it("should return website text as microcopy text", () => {
        const service = createService({
          serviceTypes: [
            { __typename: "ContentfulServiceType", name: "Pitched Roof" }
          ],
          entryType: ROOFER_TYPE,
          websiteLinkAsLabel: true
        });
        const details = createCompanyDetails(
          ROOFER_TYPE,
          service,
          "en",
          getMicroCopyMock,
          false,
          "googleURLLatLng"
        );

        const websiteLinkLabelObj = details.find(
          (item) => item["type"] === "website"
        );

        expect(websiteLinkLabelObj).toBeTruthy();
        expect(websiteLinkLabelObj["text"]).toEqual("findARoofer.websiteLabel");
      });
    });
    describe("and service entry type is MERCHANT", () => {
      it("should return website text as microcopy text", () => {
        const service = createService({
          entryType: MERCHANT_TYPE,
          websiteLinkAsLabel: true
        });
        const details = createCompanyDetails(
          MERCHANT_TYPE,
          service,
          "en",
          getMicroCopyMock,
          false,
          "googleURLLatLng"
        );

        const websiteLinkLabelObj = details.find(
          (item) => item["type"] === "website"
        );

        expect(websiteLinkLabelObj).toBeTruthy();
        expect(websiteLinkLabelObj["text"]).toEqual(
          "findAMerchant.websiteLabel"
        );
      });
    });
    describe("and service entry type is BRANCH", () => {
      it("should return website text as microcopy text", () => {
        const service = createService({
          entryType: BRANCH_TYPE,
          websiteLinkAsLabel: true
        });
        const details = createCompanyDetails(
          BRANCH_TYPE,
          service,
          "en",
          getMicroCopyMock,
          false,
          "googleURLLatLng"
        );

        const websiteLinkLabelObj = details.find(
          (item) => item["type"] === "website"
        );

        expect(websiteLinkLabelObj).toBeTruthy();
        expect(websiteLinkLabelObj["text"]).toEqual("findABranch.websiteLabel");
      });
    });
  });

  [BRANCH_TYPE, MERCHANT_TYPE, ROOFER_TYPE].forEach((service) => {
    describe(`When a ${service} service has social-media information`, () => {
      it("should display social media information", () => {
        const channels = {
          facebook: "foo",
          instagram: "beep",
          twitter: "bar",
          linkedIn: "tux"
        };

        const service = createService(channels);

        const details = createCompanyDetails(
          ROOFER_TYPE,
          service,
          "en",
          getMicroCopyMock,
          false,
          "googleURLLatLng"
        );

        expect(details).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              channels: {
                facebook: "foo",
                instagram: "beep",
                linkedIn: "tux",
                twitter: "bar"
              },
              type: "socialMedia",
              label: "findARoofer.socialMediaLabel"
            })
          ])
        );
      });
    });

    describe("When service does NOT have social-media information", () => {
      it("should NOT return social media component", () => {
        const details = createCompanyDetails(
          ROOFER_TYPE,
          createService(),
          "en",
          getMicroCopyMock,
          false,
          "googleURLLatLng"
        );

        expect(details).not.toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              type: "content",
              label: "findARoofer.socialMediaLabel"
            })
          ])
        );
      });
    });
  });
});
