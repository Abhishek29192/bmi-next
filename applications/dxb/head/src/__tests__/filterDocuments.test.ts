import { clearFilterValues, updateFilterValue } from "../utils/filters";
import { createBrandFilterCriteria } from "./helpers/filterHelper";

describe("updateFilterValue tests", () => {
  describe("When updateFilterValue is requested", () => {
    it("Then: returns updated filters", () => {
      const results = updateFilterValue(
        [createBrandFilterCriteria()],
        "brand",
        "Icopal",
        true
      );
      expect(results).toMatchSnapshot();
    });
  });

  describe("When non checked updateFilterValue is requested", () => {
    it("Then: returns updated filters", () => {
      const results = updateFilterValue(
        [createBrandFilterCriteria()],
        "brand",
        "AeroDek",
        true
      );
      expect(results).toMatchSnapshot();
    });
  });
});

describe("clearFilterValues tests", () => {
  describe("When clearFilterValues is requested", () => {
    it("Then: returns correct results", () => {
      const results = clearFilterValues([]);
      expect(results).toMatchSnapshot();
    });
  });
});
