import * as devLog from "../../../utils/devLog";
import createService from "../../../__tests__/helpers/ServiceHelper";
import { EntryTypeEnum } from "../../Service";
import { createCompanyDetails } from "../components";

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
      EntryTypeEnum.ROOFER_TYPE,
      service,
      false,
      "en",
      getMicroCopyMock,
      false,
      "googleURLLatLng"
    );
    const typeObject = details.find(
      (item) => item.label === "findARoofer.roofTypeLabel"
    );
    const directions = details.find(
      (item) => item.label === "findARoofer.getDirectionsLabel"
    );
    expect(typeObject.label).toBeTruthy();
    expect(directions).toBeUndefined();
  });
  it("should return details array for sectionType = BRANCH_TYPE", () => {
    const service = createService();
    const details = createCompanyDetails(
      EntryTypeEnum.BRANCH_TYPE,
      service,
      false,
      "en",
      getMicroCopyMock,
      false,
      "googleURLLatLng"
    );
    const faxObject = details.find((item) => item.label === "global.fax");
    const directions = details.find(
      (item) => item.label === "findARoofer.getDirectionsLabel"
    );
    expect(directions).toBeTruthy();
    expect(faxObject.label).toBeTruthy();
  });
  it("should return details array for sectionType = MERCHANT_TYPE", () => {
    const service = createService();
    const details = createCompanyDetails(
      EntryTypeEnum.MERCHANT_TYPE,
      service,
      false,
      "en",
      getMicroCopyMock,
      false,
      "googleURLLatLng"
    );
    const faxObject = details.find((item) => item.label === "global.fax");
    const typeObject = details.find(
      (item) => item.label === "findARoofer.roofTypeLabel"
    );
    const directions = details.find(
      (item) => item.label === "findARoofer.getDirectionsLabel"
    );
    expect(faxObject).toBeFalsy();
    expect(typeObject).toBeFalsy();
    expect(directions).toBeTruthy();
  });
  it("should return empty details array for sectionType = undefined", () => {
    const service = createService();
    const sectionType = undefined;
    const details = createCompanyDetails(
      sectionType,
      service,
      false,
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

  describe("Service has empty fields tests", () => {
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
        EntryTypeEnum.BRANCH_TYPE,
        service,
        false,
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
      const ctaObject = details.find((item) => item.type === "cta");
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
      expect(ctaObject).toBeTruthy();
    });
  });

  describe("when certification is populated", () => {
    it("should return certification object", () => {
      const service = createService({
        certification: "expert"
      });
      const details = createCompanyDetails(
        EntryTypeEnum.ROOFER_TYPE,
        service,
        false,
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

  describe("when localsation returns undefined for requestd key", () => {
    it("should label without localisation suffix", () => {
      const getMicroCopyMock = jest
        .fn()
        .mockImplementation((copy: string) => undefined);
      const service = createService({
        certification: "expert",
        address: "1 street, PO5T C0DE"
      });
      const details = createCompanyDetails(
        EntryTypeEnum.ROOFER_TYPE,
        service,
        true,
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

  describe("Service is null empty fields tests", () => {
    it("should not return empty fields in company details", () => {
      const details = createCompanyDetails(
        EntryTypeEnum.BRANCH_TYPE,
        null,
        false,
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
      const ctaObject = details.find((item) => item.type === "cta");
      const distanceObject = details.find((item) => item.type === "distance");
      const addressObject = details.find((item) => item.type === "address");
      expect(phoneObject).toBeUndefined();
      expect(email).toBeUndefined();
      expect(websiteObject).toBeUndefined();
      expect(faxObject).toBeUndefined();
      expect(serviceTypesObject).toBeUndefined();
      expect(certificationObject).toBeUndefined();

      expect(addressObject).toBeUndefined();
      expect(distanceObject).toBeUndefined();
      expect(ctaObject).toBeUndefined();
    });
  });
});
