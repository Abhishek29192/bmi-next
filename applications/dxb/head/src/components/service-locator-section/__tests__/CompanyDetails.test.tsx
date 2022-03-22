import { EntryTypeEnum } from "../../Service";
import createService from "../../../__tests__/ServiceHelper";
import * as devLog from "../../../utils/devLog";
import { createCompanyDetails } from "../components";

jest.spyOn(devLog, "devLog");

afterEach(jest.clearAllMocks);

describe("createCompanyDetails", () => {
  const getMicroCopyMock = jest.fn().mockImplementation((copy: string) => copy);
  it("should return details array for sectionType = ROOFER_TYPE", () => {
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
    expect(typeObject.label).toBeTruthy();
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
    expect(faxObject).toBeFalsy();
    expect(typeObject).toBeFalsy();
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
});
