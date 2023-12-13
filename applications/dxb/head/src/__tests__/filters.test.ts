import {
  clearFilterValues,
  convertToURLFilters,
  sortAlphabeticallyBy,
  updateFilterValue
} from "../utils/filters";
import type { Filter } from "@bmi-digital/components/filters";

describe("filters tests", () => {
  describe("sortAlphabeticallyBy tests", () => {
    const input = [
      { key: "c", doc_count: 3 },
      { key: "b", doc_count: 2 },
      { key: "a", doc_count: 1 },
      { key: "c", doc_count: 4 }
    ];

    it("returns -1 when a[propName] is less than b[propName]", () => {
      expect(sortAlphabeticallyBy("key")(input[1], input[0])).toEqual(-1);
    });

    it("returns 1 when a[propName] is greater than b[propName]", () => {
      expect(sortAlphabeticallyBy("key")(input[0], input[1])).toEqual(1);
    });

    it("returns 0 when a[propName] is equal to b[propName]", () => {
      expect(sortAlphabeticallyBy("key")(input[0], input[3])).toEqual(0);
    });

    it("sorts alphabetically by the prop value when called inside the sort method", () => {
      expect(input.sort(sortAlphabeticallyBy("key"))).toEqual([
        { key: "a", doc_count: 1 },
        { key: "b", doc_count: 2 },
        { key: "c", doc_count: 3 },
        { key: "c", doc_count: 4 }
      ]);
    });
  });

  describe("clearFilterValues tests", () => {
    describe("When empty data is passed", () => {
      it("returns empty result", () => {
        const result = clearFilterValues([]);
        expect(result).toEqual([]);
      });
    });
    describe("When array of filters are passed", () => {
      it("returns empty result", () => {
        const inputFilters = [
          {
            label: "filterLabels.textureFamily",
            name: "texturefamily",
            options: [
              {
                label: "feature-label",
                value: "value"
              }
            ],
            value: ["someValue"]
          }
        ];
        const expectedResult = [
          {
            label: "filterLabels.textureFamily",
            name: "texturefamily",
            options: [
              {
                label: "feature-label",
                value: "value"
              }
            ],
            value: []
          }
        ];
        const result = clearFilterValues(inputFilters);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe("updateFilterValue tests", () => {
    describe("When empty data is passed", () => {
      it("returns empty result", () => {
        const result = updateFilterValue([], "", "", true);
        expect(result).toEqual([]);
      });
    });
    describe("When array of filters are passed to Add a filter value", () => {
      describe("and filtername does not match", () => {
        it("returns newly added filter value in result", () => {
          const inputFilters = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: ["someValue"]
            }
          ];
          const expectedResult = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: ["someValue"]
            }
          ];
          const result = updateFilterValue(
            inputFilters,
            "does-not-exist",
            "someValue-2",
            true
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("And existing Values is null", () => {
        it("returns newly added filter value in result", () => {
          const inputFilters = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: null
            }
          ];
          const expectedResult = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: ["someValue-2"]
            }
          ];
          const result = updateFilterValue(
            inputFilters,
            "texturefamily",
            "someValue-2",
            true
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("And filter has existing Values", () => {
        it("returns newly added filter value in result", () => {
          const inputFilters = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: ["someValue"]
            }
          ];
          const expectedResult = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: ["someValue", "someValue-2"]
            }
          ];
          const result = updateFilterValue(
            inputFilters,
            "texturefamily",
            "someValue-2",
            true
          );
          expect(result).toEqual(expectedResult);
        });
      });
    });
    describe("When array of filters are passed to remove filter value", () => {
      describe("and filter Values is null", () => {
        it("returns removed filter result", () => {
          const inputFilters = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: null
            }
          ];
          const expectedResult = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: []
            }
          ];
          const result = updateFilterValue(
            inputFilters,
            "texturefamily",
            "someValue",
            false
          );
          expect(result).toEqual(expectedResult);
        });
      });
      describe("and filter Values exist", () => {
        it("returns removed filter result", () => {
          const inputFilters = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: ["someValue"]
            }
          ];
          const expectedResult = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [
                {
                  label: "feature-label",
                  value: "value"
                }
              ],
              value: []
            }
          ];
          const result = updateFilterValue(
            inputFilters,
            "texturefamily",
            "someValue",
            false
          );
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });

  describe("convertToURLFilters tests", () => {
    const input = (firstValue: string[] = []): readonly Filter[] => [
      {
        filterCode: "colour",
        label: "Colour",
        name: "colour",
        options: [
          { label: "Grey", value: "grey" },
          { label: "Red", value: "red" }
        ],
        value: firstValue
      },
      {
        filterCode: "material",
        label: "Material",
        name: "material",
        options: [
          { label: "Slate", value: "slate" },
          { label: "Clay", value: "clay" }
        ],
        value: undefined
      }
    ];

    it("converts filters correctly", () => {
      const result = convertToURLFilters(input(["red"]));
      expect(result).toEqual([{ name: "colour", value: ["red"] }]);
    });

    it("converts filters with multple values correctly", () => {
      const result = convertToURLFilters(input(["red", "grey"]));
      expect(result).toEqual([{ name: "colour", value: ["red", "grey"] }]);
    });

    it("converts multiple filters with multple values correctly", () => {
      const input: readonly Filter[] = [
        {
          filterCode: "colour",
          label: "Colour",
          name: "colour",
          options: [
            { label: "Grey", value: "grey" },
            { label: "Red", value: "red" }
          ],
          value: ["red", "grey"]
        },
        {
          filterCode: "material",
          label: "Material",
          name: "material",
          options: [
            { label: "Slate", value: "slate" },
            { label: "Clay", value: "clay" }
          ],
          value: ["clay"]
        },
        {
          filterCode: "material2",
          label: "Material2",
          name: "material2",
          options: [
            { label: "Slate", value: "slate" },
            { label: "Clay", value: "clay" }
          ],
          value: []
        }
      ];
      const result = convertToURLFilters(input);
      expect(result).toEqual([
        { name: "colour", value: ["red", "grey"] },
        { name: "material", value: ["clay"] }
      ]);
    });

    it("clears filters correctly", () => {
      const result = convertToURLFilters(input(undefined));
      expect(result).toEqual([]);
    });
  });
});
