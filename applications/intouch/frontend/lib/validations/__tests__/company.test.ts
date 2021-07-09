import { validateCompanyProfile } from "../company";
import { mockCompany } from "../../../fixtures/company";

describe("validateCompanyProfile", () => {
  it("should be ok with a complete company profile", () => {
    expect(validateCompanyProfile(mockCompany)).toEqual({
      result: true,
      missingFields: []
    });
  });

  it("should flag incomplete company fields", () => {
    expect(
      validateCompanyProfile({
        ...mockCompany,
        phone: undefined,
        aboutUs: undefined
      })
    ).toEqual({
      result: false,
      missingFields: ["phone", "aboutUs"]
    });
  });

  it("should flag incomplete nested fields (trading Address)", () => {
    expect(
      validateCompanyProfile({
        ...mockCompany,
        tradingAddress: {
          ...mockCompany.tradingAddress,
          postcode: undefined
        }
      })
    ).toEqual({
      result: false,
      missingFields: ["tradingAddress"]
    });
  });
});
