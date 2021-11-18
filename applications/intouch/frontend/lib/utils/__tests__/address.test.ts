import { stringifyAddress } from "../address";
import { mockAddress } from "../../../fixtures/address";

describe("Address utility", () => {
  it("stringify address", () => {
    const address = "Nursery Rd Brixton SW9 8BP London UK";
    expect(stringifyAddress(mockAddress)).toEqual(address);
  });
});
