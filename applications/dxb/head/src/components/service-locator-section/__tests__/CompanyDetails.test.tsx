import { describe, it, jest } from "@jest/globals";
import { createFullyPopulatedService } from "../../../__tests__/helpers/ServiceHelper";
import { EntryTypeEnum } from "../../Service";
import { createCompanyDetails } from "../components";

const getMicroCopy = jest.fn((copy: string) => `MC: ${copy}`);
const centre = { lat: 10, lng: 10 };

afterEach(() => {
  jest.clearAllMocks();
});

describe("createCompanyDetails", () => {
  for (const entryType of Object.values(EntryTypeEnum)) {
    describe(`${entryType}: Summary`, () => {
      const service = createFullyPopulatedService({
        entryType
      });

      const details = createCompanyDetails({
        sectionType: entryType,
        service,
        getMicroCopy,
        centre
      });

      it(`should return a service summary if defined`, () => {
        expect(details).toHaveProperty("summary", service.summary);
      });

      it(`should return 'undefined' if service.summary is undefined`, () => {
        const service = createFullyPopulatedService({
          entryType,
          summary: undefined
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details).toHaveProperty("summary", undefined);
      });
    });
  }

  for (const entryType of Object.values(EntryTypeEnum)) {
    describe(`${entryType}: Address`, () => {
      const service = createFullyPopulatedService({
        entryType
      });

      const details = createCompanyDetails({
        sectionType: entryType,
        service,
        getMicroCopy,
        centre
      });

      it(`should always return a service address object, with the following link property if the 'centre', 'service.certification' and 'service.serviceTypes' props are defined`, () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: global.address";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: global.address";
            break;
        }

        expect(details).toHaveProperty("address", {
          address: service.address,
          gtm: {
            action: "https://www.google.com/maps/dir/10,+10/address%201/",
            id: "cta-click1",
            label: expectedGtmLabel
          },
          link: "https://www.google.com/maps/dir/10,+10/address%201/"
        });
      });

      it(`should not include the centre values in the link or gtm action values if 'centre' is undefined`, () => {
        const centre = undefined;

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.address!.gtm!.action).toBe(
          "https://www.google.com/maps/dir/address%201/"
        );
        expect(details.address!.link).toBe(
          "https://www.google.com/maps/dir/address%201/"
        );
      });

      it(`should not include the 'service.certification' prop value in the gtm label, if undefined`, () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: global.address";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: global.address";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          certification: undefined
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.address!.gtm!.label).toBe(expectedGtmLabel);
      });

      it(`should use the service.entryType value in the gtm label if service.serviceTypes is null`, () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Roofer";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Merchant - MC: global.address";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Branch - MC: global.address";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          serviceTypes: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.address!.gtm!.label).toBe(expectedGtmLabel);
      });
    });
  }

  for (const entryType of Object.values(EntryTypeEnum)) {
    describe(`${entryType}: Distance`, () => {
      it("should return a micro copied label when the distance prop is not undefined.", () => {
        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.distance!.label).toBe("MC: findARoofer.distanceLabel");
      });

      it("should transform the distance prop value into kilometres when distance is a number, with a 'km' suffix at the end of the string", () => {
        const distanceInput = 1000;

        const service = createFullyPopulatedService({
          entryType,
          distance: distanceInput
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        const distanceOutput = "1km";

        expect(details.distance!.text).toBe(distanceOutput);
      });

      it("should return undefined if the distance value is undefined", () => {
        const service = createFullyPopulatedService({
          entryType,
          distance: undefined
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details).toHaveProperty("distance", undefined);
      });

      it("should not return undefined if the distance value is 0", () => {
        const service = createFullyPopulatedService({
          entryType,
          distance: 0
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details).toHaveProperty("distance", {
          label: "MC: findARoofer.distanceLabel",
          text: "0km"
        });
      });
    });
  }

  for (const entryType of Object.values(EntryTypeEnum)) {
    describe(`${entryType}: Phone`, () => {
      it("should return the phone number, if service.phone is defined", () => {
        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.phone!.phone).toBe("01234567890");
      });

      it("should return the phone number label, if service.phone is defined", () => {
        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.phone!.label).toBe("MC: global.telephone");
      });

      it("should return the following gtm object, if 'service.certification' and 'service.serviceTypes' props are defined", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: global.telephone";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: global.telephone";
            break;
        }

        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.phone!.gtm).toEqual({
          action: "tel:01234567890",
          id: "cta-click1",
          label: expectedGtmLabel
        });
      });

      it("should not include the 'service.certification' prop value in the gtm label, if undefined", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: global.telephone";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: global.telephone";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          certification: undefined
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.phone!.gtm!.label).toBe(expectedGtmLabel);
      });

      it("should use the service.entryType value in the gtm label if service.serviceTypes is null", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Roofer";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Merchant - MC: global.telephone";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Branch - MC: global.telephone";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          serviceTypes: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.phone!.gtm!.label).toBe(expectedGtmLabel);
      });

      it("should return undefined if service.phone is null", () => {
        const service = createFullyPopulatedService({
          entryType,
          phone: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details).toHaveProperty("phone", undefined);
      });
    });
  }

  for (const entryType of Object.values(EntryTypeEnum)) {
    describe(`${entryType}: Email`, () => {
      it("should return the email address, if service.email is defined", () => {
        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.email!.email).toBe("test@test.com");
      });

      it("should return the email address label, if service.email is defined", () => {
        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.email!.label).toBe("MC: global.email");
      });

      it("should return the following gtm object, if 'service.certification' and 'service.serviceTypes' props are defined", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: global.email";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: global.email";
            break;
        }

        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.email!.gtm).toEqual({
          action: "mailto:test@test.com",
          id: "cta-click1",
          label: expectedGtmLabel
        });
      });

      it("should not include the 'service.certification' prop value in the gtm label, if undefined", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: global.email";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: global.email";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          certification: undefined
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.email!.gtm!.label).toBe(expectedGtmLabel);
      });

      it("should use the service.entryType value in the gtm label if service.serviceTypes is null", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Roofer";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Merchant - MC: global.email";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Branch - MC: global.email";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          serviceTypes: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.email!.gtm!.label).toBe(expectedGtmLabel);
      });

      it("should return undefined if service.email is null", () => {
        const service = createFullyPopulatedService({
          entryType,
          email: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details).toHaveProperty("email", undefined);
      });
    });
  }

  for (const entryType of Object.values(EntryTypeEnum)) {
    describe(`${entryType}: Website`, () => {
      it("should define the website link correctly if it starts with 'http'", () => {
        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.website).toBe(service.website);
      });

      it("should define the website link correctly if it doesn't start with 'http'", () => {
        const website = "localhost";

        const service = createFullyPopulatedService({
          entryType,
          website: website
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.website).toBe(`https://${website}`);
      });

      it("should define the website text string as the localisedLabel if websiteLinkAsLabel is true", () => {
        const service = createFullyPopulatedService({
          websiteLinkAsLabel: true
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.text).toBe("MC: findARoofer.websiteLabel");
      });

      it("should define the website text string as the link hostname if websiteLinkAsLabel is false", () => {
        const service = createFullyPopulatedService({
          websiteLinkAsLabel: false
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.text).toBe("localhost");
      });

      it("should define the website text string as the link hostname if websiteLinkAsLabel is null", () => {
        const service = createFullyPopulatedService({
          websiteLinkAsLabel: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.text).toBe("localhost");
      });

      it("should return the correct localised website label", () => {
        let expectedMicroCopyLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedMicroCopyLabel = "MC: findARoofer.websiteLabel";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedMicroCopyLabel = "MC: findAMerchant.websiteLabel";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedMicroCopyLabel = "MC: findABranch.websiteLabel";
            break;
        }

        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.label).toBe(expectedMicroCopyLabel);
      });

      it("should return the following gtm object, if 'service.certification' and 'service.serviceTypes' props are defined", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: findAMerchant.websiteLabel";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Pitched Roof - MC: findABranch.websiteLabel";
            break;
        }

        const service = createFullyPopulatedService({
          entryType
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.gtm).toEqual({
          action: "http://localhost",
          id: "cta-click1",
          label: expectedGtmLabel
        });
      });

      it("should not include the 'service.certification' prop value in the gtm label, if undefined", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - Pitched Roof";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: findAMerchant.websiteLabel";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - Pitched Roof - MC: findABranch.websiteLabel";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          certification: undefined
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.gtm!.label).toBe(expectedGtmLabel);
      });

      it("should use the service.entryType value in the gtm label if service.serviceTypes is null", () => {
        let expectedGtmLabel;
        switch (entryType) {
          case EntryTypeEnum.ROOFER_TYPE:
            expectedGtmLabel = "roofer 1 - address 1 - elite - Roofer";
            break;
          case EntryTypeEnum.MERCHANT_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Merchant - MC: findAMerchant.websiteLabel";
            break;
          case EntryTypeEnum.BRANCH_TYPE:
            expectedGtmLabel =
              "roofer 1 - address 1 - elite - Branch - MC: findABranch.websiteLabel";
            break;
        }

        const service = createFullyPopulatedService({
          entryType,
          serviceTypes: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details.website!.gtm!.label).toBe(expectedGtmLabel);
      });

      it("should return undefined if service.website is null", () => {
        const service = createFullyPopulatedService({
          entryType,
          website: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details).toHaveProperty("website", undefined);
      });
    });
  }

  describe("Roofer: RoofProLevel", () => {
    it(`should return the RoofProLevel object if the sectionType is Roofer and service.certification is defined`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.ROOFER_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.ROOFER_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("roofProLevel", {
        label: "MC: findARoofer.certificationLabel",
        level: "elite"
      });
    });

    it(`should return undefined if service.certification is null`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.ROOFER_TYPE,
        certification: null
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.ROOFER_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("roofProLevel", undefined);
    });
  });

  describe("Merchant: RoofProLevel", () => {
    it(`should return undefined if the sectionType is Merchant`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.MERCHANT_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.MERCHANT_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("roofProLevel", undefined);
    });
  });

  describe("Branch: RoofProLevel", () => {
    it(`should return undefined if the sectionType is Branch`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.BRANCH_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.BRANCH_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("roofProLevel", undefined);
    });
  });

  describe("Roofer: Fax", () => {
    it(`should return undefined if sectionType is Roofer`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.ROOFER_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.ROOFER_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("fax", undefined);
    });
  });

  describe("Merchant: Fax", () => {
    it(`should return undefined if the sectionType is Merchant`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.MERCHANT_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.MERCHANT_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("fax", undefined);
    });
  });

  describe("Branch: Fax", () => {
    it(`should return the fax object if the sectionType is Branch and service.fax is defined`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.BRANCH_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.BRANCH_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("fax", {
        fax: "01234567891",
        label: "MC: global.fax"
      });
    });

    it(`should return undefined if the sectionType is Branch and service.fax is undefined`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.BRANCH_TYPE,
        fax: undefined
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.BRANCH_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("fax", undefined);
    });
  });

  describe("Roofer: Content", () => {
    it(`should return the content object if the sectionType is Roofer and service.serviceTypes is defined`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.ROOFER_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.ROOFER_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("content", {
        label: "MC: findARoofer.roofTypeLabel",
        text: "Pitched Roof"
      });
    });

    it(`should return join the serviceType names of all objects in the array into a single string, separated by commas`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.ROOFER_TYPE,
        serviceTypes: [
          { __typename: "ContentfulServiceType", name: "Pitched Roof" },
          { __typename: "ContentfulServiceType", name: "Flat Roof" },
          { __typename: "ContentfulServiceType", name: "Solar Panels" }
        ]
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.ROOFER_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("content", {
        label: "MC: findARoofer.roofTypeLabel",
        text: "Pitched Roof, Flat Roof, Solar Panels"
      });
    });

    it(`should return undefined if the sectionType is Roofer and service.serviceTypes is null`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.BRANCH_TYPE,
        serviceTypes: null
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.BRANCH_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("content", undefined);
    });
  });

  describe("Merchant: Content", () => {
    it(`should return undefined if the sectionType is Merchant`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.MERCHANT_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.MERCHANT_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("content", undefined);
    });
  });

  describe("Branch: Content", () => {
    it(`should return undefined if sectionType is Roofer`, () => {
      const service = createFullyPopulatedService({
        entryType: EntryTypeEnum.BRANCH_TYPE
      });

      const details = createCompanyDetails({
        sectionType: EntryTypeEnum.BRANCH_TYPE,
        service,
        getMicroCopy,
        centre
      });

      expect(details).toHaveProperty("content", undefined);
    });
  });

  for (const entryType of Object.values(EntryTypeEnum)) {
    describe(`${entryType}: Social Media`, () => {
      const service = createFullyPopulatedService({
        entryType
      });

      const details = createCompanyDetails({
        sectionType: entryType,
        service,
        getMicroCopy,
        centre
      });

      it(`should return a socialMedia object with a facebook property if facebook is defined`, () => {
        expect(details.socialMedia!.facebook).toEqual({
          handle: "facebook",
          gtm: {
            action: "facebook",
            id: "cta-share-ext-company",
            label: "roofer 1 - address 1 - elite - Pitched Roof - facebook"
          }
        });
      });

      it(`should return undefined if facebook is null`, () => {
        const service = createFullyPopulatedService({
          entryType,
          facebook: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });
        expect(details.socialMedia!.facebook).toBeUndefined();
      });

      it(`should return a socialMedia object with a instagram property if instagram is defined`, () => {
        expect(details.socialMedia!.instagram).toEqual({
          handle: "instagram",
          gtm: {
            action: "instagram",
            id: "cta-share-ext-company",
            label: "roofer 1 - address 1 - elite - Pitched Roof - instagram"
          }
        });
      });

      it(`should return undefined if instagram is null`, () => {
        const service = createFullyPopulatedService({
          entryType,
          instagram: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });
        expect(details.socialMedia!.instagram).toBeUndefined();
      });

      it(`should return a socialMedia object with a linkedin property if linkedin is defined`, () => {
        expect(details.socialMedia!.linkedIn).toEqual({
          handle: "linkedin",
          gtm: {
            action: "linkedIn",
            id: "cta-share-ext-company",
            label: "roofer 1 - address 1 - elite - Pitched Roof - linkedIn"
          }
        });
      });

      it(`should return undefined if linkedin is null`, () => {
        const service = createFullyPopulatedService({
          entryType,
          linkedIn: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });
        expect(details.socialMedia!.linkedIn).toBeUndefined();
      });

      it(`should return a socialMedia object with a twitter property if twitter is defined`, () => {
        expect(details.socialMedia!.twitter).toEqual({
          handle: "twitter",
          gtm: {
            action: "twitter",
            id: "cta-share-ext-company",
            label: "roofer 1 - address 1 - elite - Pitched Roof - twitter"
          }
        });
      });

      it(`should return undefined if twitter is null`, () => {
        const service = createFullyPopulatedService({
          entryType,
          twitter: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });
        expect(details.socialMedia!.twitter).toBeUndefined();
      });

      it(`should return 'undefined' if all social media channels are null`, () => {
        const service = createFullyPopulatedService({
          entryType,
          facebook: null,
          instagram: null,
          linkedIn: null,
          twitter: null
        });

        const details = createCompanyDetails({
          sectionType: entryType,
          service,
          getMicroCopy,
          centre
        });

        expect(details).toHaveProperty("socialMedia", undefined);
      });
    });
  }
});
