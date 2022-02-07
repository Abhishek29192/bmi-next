import can from "../can";
import { generateAccount } from "../../../lib/tests/factories/account";
import { ROLES } from "../../../lib/constants";

jest.mock("../gates", () => ({
  dataModel: {
    object: {
      SUPER_ADMIN: (_, { hasExtraData }) => !!hasExtraData,
      MARKET_ADMIN: true
    },
    function: (_, { hasExtraData }) => !!hasExtraData,
    boolean: true
  }
}));

describe("permissions/can", () => {
  it("has no matched dataModel key", () => {
    const user = generateAccount({ role: ROLES.SUPER_ADMIN });

    expect(can(user, "undefinedDataModel", "object")).toBe(false);
  });

  describe("definition is an object", () => {
    it("gate is a function and has no extraData passed", () => {
      const user = generateAccount({ role: ROLES.SUPER_ADMIN });

      expect(can(user, "dataModel", "object")).toBe(false);
    });

    it("gate is a function and has extraData", () => {
      const user = generateAccount({
        role: ROLES.SUPER_ADMIN,
        hasCompany: true
      });

      expect(can(user, "dataModel", "object", { hasExtraData: true })).toBe(
        true
      );
    });

    it("gate is not a function", () => {
      const user = generateAccount({ role: ROLES.MARKET_ADMIN });

      expect(can(user, "dataModel", "object")).toBe(true);
    });

    it("gate is undefined", () => {
      const user = generateAccount({ role: null });

      expect(can(user, "dataModel", "undefined")).toBe(false);
    });

    it("has no user", () => {
      expect(can(null, "dataModel", "object")).toBe(false);
    });
  });

  describe("definition is a function", () => {
    it("has extraData", () => {
      const user = generateAccount();

      expect(can(user, "dataModel", "function", { hasExtraData: true })).toBe(
        true
      );
    });

    it("has no extraData", () => {
      const user = generateAccount();

      expect(can(user, "dataModel", "function")).toBe(false);
    });
  });

  describe("definition is a boolean", () => {
    it("return correct value", () => {
      const user = generateAccount();

      expect(can(user, "dataModel", "boolean")).toBe(true);
    });
  });
});
