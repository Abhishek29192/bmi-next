import { describe, it, jest } from "@jest/globals";
import { Service } from "..";
import createService, {
  createFullyPopulatedService
} from "../../../__tests__/helpers/ServiceHelper";
import { EntryTypeEnum } from "../../Service";
import { createCompanyDetails } from "../components";

const { ROOFER_TYPE, BRANCH_TYPE, MERCHANT_TYPE } = EntryTypeEnum;

const mockGetMicroCopy = jest.fn((copy: string) => `MC: ${copy}`);

afterEach(() => {
  jest.clearAllMocks();
});

describe("createCompanyDetails", () => {
  it("should return details for sectionType = ROOFER_TYPE", () => {
    const service = createFullyPopulatedService({
      entryType: ROOFER_TYPE
    });

    const details = createCompanyDetails(
      ROOFER_TYPE,
      service,
      mockGetMicroCopy,
      { lat: 10, lng: 10 }
    );

    expect(details).toMatchSnapshot();
  });

  it("should return details for sectionType = BRANCH_TYPE", () => {
    const service = createFullyPopulatedService({ entryType: BRANCH_TYPE });

    const details = createCompanyDetails(
      BRANCH_TYPE,
      service,
      mockGetMicroCopy,
      { lat: 10, lng: 10 }
    );

    expect(details).toMatchSnapshot();
  });

  it("should return details for sectionType = MERCHANT_TYPE", () => {
    const service = createFullyPopulatedService({ entryType: MERCHANT_TYPE });

    const details = createCompanyDetails(
      MERCHANT_TYPE,
      service,
      mockGetMicroCopy,
      { lat: 10, lng: 10 }
    );

    expect(details).toMatchSnapshot();
  });

  it("should handle minimal set of data", () => {
    const service: Service = createService();

    const details = createCompanyDetails(
      ROOFER_TYPE,
      service,
      mockGetMicroCopy,
      { lat: 10, lng: 10 }
    );

    expect(details).toMatchSnapshot();
  });
});
