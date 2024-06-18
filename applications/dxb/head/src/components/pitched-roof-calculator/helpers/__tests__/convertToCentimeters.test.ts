import { convertToCentimeters } from "../convertToCentimeters";

describe("convertToCentimeters helper", () => {
  describe("when input of ClassificationField type provided", () => {
    it("returns correct value if 'cm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: "10",
          name: "10 cm",
          code: "10cm"
        })
      ).toBe(10);
    });

    it("returns correct value if 'mm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: "10",
          name: "10 mm",
          code: "10mm"
        })
      ).toBe(1);
    });

    it("returns correct value if 'm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: "2",
          code: "2m",
          name: "2 m"
        })
      ).toBe(200);
    });

    it("returns correct value if 'μm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: "10000",
          code: "10000μm",
          name: "10000 μm"
        })
      ).toBe(1);
    });

    it("returns correct value if value ends with a spacing", () => {
      expect(
        convertToCentimeters({
          value: "10000 ",
          code: "10000 μm",
          name: "10000  μm"
        })
      ).toBe(1);
    });

    it("returns correct value if value starts with a spacing", () => {
      expect(
        convertToCentimeters({
          value: " 10000",
          code: " 10000μm",
          name: " 10000 μm"
        })
      ).toBe(1);
    });

    it("throws error", () => {
      expect(() =>
        convertToCentimeters({ value: "str", name: "str cm", code: "strcm" })
      ).toThrow();
    });

    it("returns undefined if value is nt a number and 'throwOnTypeError' is set to false", () => {
      expect(
        convertToCentimeters(
          { value: "str", name: "str cm", code: "strcm" },
          false
        )
      ).toBeUndefined();
    });

    it("returns undefined if input is not provided", () => {
      expect(convertToCentimeters(undefined, false)).toBeUndefined();
    });

    it("returns 0 if 0 provided", () => {
      expect(
        convertToCentimeters({ value: "0", name: "0 cm", code: "0cm" })
      ).toBe(0);
    });
  });

  describe("when input of Distance type provided", () => {
    it("returns correct value if 'cm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: 10,
          unit: "cm"
        })
      ).toBe(10);
    });

    it("returns correct value if 'mm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: 10,
          unit: "mm"
        })
      ).toBe(1);
    });

    it("returns correct value if 'm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: 2,
          unit: "m"
        })
      ).toBe(200);
    });

    it("returns correct value if 'μm' unit provided", () => {
      expect(
        convertToCentimeters({
          value: 10000,
          unit: "μm"
        })
      ).toBe(1);
    });

    it("returns 0 if 0 provided", () => {
      expect(
        convertToCentimeters({
          value: 0,
          unit: "μm"
        })
      ).toBe(0);
    });
  });
});
