import { Filter } from "@bmi-digital/components";
import { ProductFilter } from "../../types/pim";
import { xferFilterValue } from "../elasticSearchPLP";

describe("syncFilterValue function", () => {
  describe("When matching filter is found in target", () => {
    it("should transfer the filter value from source to target filters", () => {
      const srcFilters = [
        {
          filterCode: "colour",
          name: "colour",
          label: "Colour",
          value: ["colour1"],
          options: [
            { label: "1", value: "colour1" },
            { label: "2", value: "colour2" }
          ]
        }
      ];

      const targetFilters: Filter[] = [
        {
          filterCode: "colour",
          name: "colour",
          label: "Colour",
          options: [
            { label: "1", value: "colour1" },
            { label: "2", value: "colour2" }
          ]
        }
      ];

      const updatedFilters = xferFilterValue(srcFilters, targetFilters);
      const result = [
        {
          filterCode: "colour",
          name: "colour",
          label: "Colour",
          value: ["colour1"],
          options: [
            { label: "1", value: "colour1" },
            { label: "2", value: "colour2" }
          ]
        }
      ];

      expect(updatedFilters).toEqual(result);
    });
  });

  describe("When matching filter is found NOT in target", () => {
    it("should transfer the filter value from source to target filters", () => {
      const srcFilters: ProductFilter[] = [
        {
          filterCode: "colour",
          name: "height",
          label: "Height",
          value: ["height1"],
          options: [
            { label: "h1", value: "height1" },
            { label: "h2", value: "height1" }
          ]
        }
      ];

      const targetFilters: Filter[] = [
        {
          filterCode: "colour",
          name: "colour",
          label: "Colour",
          options: [
            { label: "1", value: "colour1" },
            { label: "2", value: "colour2" }
          ]
        }
      ];

      const updatedFilters = xferFilterValue(srcFilters, targetFilters);
      const result = [
        {
          filterCode: "colour",
          name: "colour",
          label: "Colour",
          value: ["height1"],
          options: [
            { label: "1", value: "colour1" },
            { label: "2", value: "colour2" }
          ]
        }
      ];

      expect(updatedFilters).toEqual(result);
    });
  });
});
