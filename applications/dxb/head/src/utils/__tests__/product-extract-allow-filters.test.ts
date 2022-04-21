import {
  extractAllowedFeatures,
  extractAllowedCategories
} from "../product-filters";

describe("extract allowed filters tests", () => {
  describe("extract allowed Categories filters tests", () => {
    it("should return empty object when null allow filters provided", () => {
      expect(extractAllowedCategories(null)).toEqual(new Map());
    });
    it("should return empty object when empty allow filter by is provided", () => {
      expect(extractAllowedCategories([])).toEqual(new Map());
    });
    it("should return empty object when category LIKE name is provided", () => {
      const expectedResult = new Map();
      expectedResult.set("CATEGORY_1", []);
      expect(extractAllowedCategories(["CATEGORY_1"])).toEqual(expectedResult);
    });
    describe("When various cases of allow Category filters are provided", () => {
      test.each([
        [["CATEGORY_1"], new Map().set("CATEGORY_1", [])],
        [["CATEGORY|CATEGORY_1"], new Map().set("CATEGORY", ["CATEGORY_1"])],
        [
          ["CATEGORY|CATEGORY_1", "CATEGORY|CATEGORY_2"], //same parent category two children categories are grouped together
          new Map().set("CATEGORY", ["CATEGORY_1", "CATEGORY_2"])
        ],
        [
          //combined root category and one with two children categories
          ["CATEGORY|CATEGORY_1", "CATEGORY|CATEGORY_2", "NEW_CATEGORY"],
          new Map()
            .set("CATEGORY", ["CATEGORY_1", "CATEGORY_2"])
            .set("NEW_CATEGORY", [])
        ],
        [
          [
            "CATEGORY|CATEGORY_1",
            "CATEGORY|CATEGORY_2",
            "NEW_CATEGORY", //if main category is already specified then ignore child categories
            "NEW_CATEGORY| CHILD_CATEGORY"
          ],
          new Map()
            .set("CATEGORY", ["CATEGORY_1", "CATEGORY_2"])
            .set("NEW_CATEGORY", [])
        ],
        [
          //category filters are case sensitive
          [
            "Category|Category_1",
            "CATEGORY|CATEGORY_2",
            "NEW_CATEGORY| CHILD_CATEGORY",
            "NEW_CATEGORY| child_category"
          ],
          new Map()
            .set("Category", ["Category_1"])
            .set("CATEGORY", ["CATEGORY_2"])
            .set("NEW_CATEGORY", ["CHILD_CATEGORY", "child_category"])
        ]
      ])(
        "given %p as argument, returns category filter map of %p",
        (firstArg, expectedResult) => {
          const result = extractAllowedCategories([...firstArg]);
          expect(result).toEqual(expectedResult);
        }
      );
    });
  });
  describe("extract allowed features filters tests", () => {
    it("should return empty object when null allow filters provided", () => {
      expect(extractAllowedFeatures(null)).toEqual(new Map());
    });
    it("should return empty object when empty allow filter by is provided", () => {
      expect(extractAllowedFeatures([])).toEqual(new Map());
    });
    it("should return empty object when category LIKE name is provided", () => {
      expect(extractAllowedFeatures(["CATEGORY_1"])).toEqual(new Map());
    });
    describe("When various cases of allow filters are provided", () => {
      const expectedResult = new Map();
      expectedResult.set("roofattributes.color", []);
      test.each([
        [["roofattributes.color"]],
        [["roofAttributes.color"]],
        [["roofAttributes.Color"]],
        [["roofAttributes.COLOR"]],
        [["RoofAttributes.color"]],
        [["ROOFATTRIBUTES.Color"]],
        [
          [
            "ROOFATTRIBUTES.Color",
            "RoofAttributes.color",
            "roofAttributes.COLOR",
            "roofAttributes.color"
          ]
        ]
      ])(
        "given %p as argument, returns case in-sensitive filter map of filters",
        (firstArg) => {
          const result = extractAllowedFeatures([...firstArg]);
          expect(result).toEqual(expectedResult);
        }
      );
    });
  });
});
