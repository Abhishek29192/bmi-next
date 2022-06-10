import {
  stringifyAddress,
  copyOfSiteAddress,
  copyOfBuildingOwnerAddress
} from "../address";
import { mockAddress } from "../../../fixtures/address";

describe("Address utility", () => {
  it("stringify address", () => {
    const address = "Nursery Rd Brixton SW9 8BP London UK";
    expect(stringifyAddress(mockAddress)).toEqual(address);
    expect(stringifyAddress(null)).toEqual("");
  });
  it("copyOfSiteAddress", () => {
    const address = {
      id: 1,
      firstLine: "test"
    };
    expect(copyOfSiteAddress(address)).toMatchObject({ firstLine: "test" });
  });
  it("copyOfBuildingOwnerAddress", () => {
    const address = {
      id: 1,
      firstLine: "test"
    };
    expect(copyOfBuildingOwnerAddress(address)).toMatchObject({
      firstLine: "test"
    });
  });
  it("copyOfSiteAddress empty address", () => {
    expect(copyOfSiteAddress(null)).toBeNull();
  });
  it("copyOfBuildingOwnerAddress empty address", () => {
    expect(copyOfBuildingOwnerAddress(null)).toBeNull();
  });
});
