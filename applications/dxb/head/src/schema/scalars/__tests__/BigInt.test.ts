import { Kind } from "gatsby/graphql";
import BigInt from "../BigInt";

describe("BigInt", () => {
  describe("serialize", () => {
    it("throws an error if argument is not number", () => {
      expect(() => BigInt.serialize("some string")).toThrow(
        "GraphQL BigInt Scalar serializer expected a 'number'"
      );
    });

    it("returns number", () => {
      expect(BigInt.serialize(1000000000000)).toBe(1000000000000);
    });
  });

  describe("parseValue", () => {
    it("throws an error if argument is not number", () => {
      expect(() => BigInt.parseValue("some string")).toThrow(
        "GraphQL BigInt Scalar parser expected a 'number'"
      );
    });

    it("returns number", () => {
      expect(BigInt.parseValue(1000000000000)).toBe(1000000000000);
    });
  });

  describe("paseLiteral", () => {
    it("throws an error if argument is not number", () => {
      expect(() =>
        BigInt.parseLiteral({ kind: Kind.STRING, value: "some string" })
      ).toThrow("GraphQL BigInt Scalar literal parser expected a 'number'");
    });

    it("returns number", () => {
      expect(
        BigInt.parseLiteral({ kind: Kind.INT, value: "1000000000000" })
      ).toBe(1000000000000);
    });
  });
});
