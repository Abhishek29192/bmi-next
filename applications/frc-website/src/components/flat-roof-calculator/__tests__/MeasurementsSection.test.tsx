import { getSystem } from "../calculations/getSystem";
import { pickNumbers } from "../utils/pickNumbers";

describe("MeasurementsSection component", () => {
  describe("getSystem tests", () => {
    it("throws error when path not found with field", () => {
      expect(() =>
        getSystem(
          { fieldArea: 2, kerbHeight: "string" },
          {
            paths: [{ option: "kerbHeight", target: "target" }],
            field: "kerbHeight"
          }
        )
      ).toThrow("Couldn't find path for string in kerbHeight");
    });
    it("throws error when path is found but the value is not string", () => {
      expect(() =>
        getSystem(
          { fieldArea: 2, kerbHeight: 99 },
          {
            paths: [{ option: "kerbHeight", target: "target" }],
            field: "kerbHeight"
          }
        )
      ).toThrow("Found an invalid selection 99 for kerbHeight");
    });

    it("returns value of path", () => {
      const result = getSystem(
        { fieldArea: 2, kerbHeight: "target" },
        {
          paths: [{ option: "target", target: "target" }],
          field: "kerbHeight"
        }
      );
      expect(result).toEqual({
        name: "target",
        values: {
          companyName: undefined,
          detailHeight1: undefined,
          detailHeight2: undefined,
          detailLength1: undefined,
          detailLength2: undefined,
          fieldArea: 2,
          kerbHeight: undefined,
          kerbLength: undefined,
          projectName: undefined,
          upstandHeight: undefined,
          upstandLength: undefined
        }
      });
    });
  });
  describe("pickNumbers tests", () => {
    it("returns empty object when property not found", () => {
      const result = pickNumbers(
        { fieldArea: 2, kerbHeight: "string" },
        "kerbHeight"
      );
      expect(result).toEqual({});
    });
    it("picks requested properties", () => {
      const result = pickNumbers(
        { fieldArea: 2, kerbHeight: "string" },
        "fieldArea"
      );
      expect(result).toEqual({ fieldArea: 2 });
    });
  });
});
