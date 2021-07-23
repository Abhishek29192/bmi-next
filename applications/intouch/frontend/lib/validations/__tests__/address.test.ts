import { validateAddress } from "../address";
import { mockAddress } from "../../../fixtures/address";

describe("validateAddress", () => {
  it("should be ok with a complete address", () => {
    expect(validateAddress(mockAddress)).toEqual({
      result: true,
      missingFields: []
    });
  });

  it("should flag missing fields", () => {
    expect(validateAddress({ ...mockAddress, firstLine: undefined })).toEqual({
      result: false,
      missingFields: ["firstLine"]
    });
  });

  it("should flag missing nested fields", () => {
    expect(
      validateAddress({
        ...mockAddress,
        coordinates: { ...mockAddress.coordinates, y: undefined }
      })
    ).toEqual({
      result: false,
      missingFields: ["coordinates.y"]
    });
  });
});
