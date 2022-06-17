import { DocumentResultData } from "../components/DocumentResults";
import {
  clearFilterValues,
  convertToURLFilters,
  generateUniqueDocuments,
  sortAlphabeticallyBy,
  updateFilterValue,
  ResultTypeEnum
} from "../utils/filters";
import { ProductFilter } from "../types/pim";
import createPimDocument from "./helpers/PimDocumentHelper";
import createContentfuldocument from "./helpers/ContentfulDocumentHelper";

describe("filters tests", () => {
  describe("sortAlphabeticallyBy tests", () => {
    describe("When empty data is passed", () => {
      it("returns empty result", () => {
        const result = [].sort(sortAlphabeticallyBy("code"));
        expect(result).toEqual([]);
      });
    });
    describe("When empty key is passed", () => {
      it("returns same result", () => {
        const input = [
          { code: "x" },
          { code: "y" },
          { code: "a" },
          { code: "b" }
        ];
        const output = [
          { code: "x" },
          { code: "y" },
          { code: "a" },
          { code: "b" }
        ];
        const result = input.sort(sortAlphabeticallyBy(""));
        expect(result).toEqual(output);
      });
    });

    describe("When prop key does not exist in data", () => {
      it("returns same result", () => {
        const input = [
          { code: "x" },
          { code: "y" },
          { code: "a" },
          { code: "b" }
        ];
        const output = [
          { code: "x" },
          { code: "y" },
          { code: "a" },
          { code: "b" }
        ];
        const result = input.sort(sortAlphabeticallyBy("doesNotExist"));
        expect(result).toEqual(output);
      });
    });

    describe("When prop key does exists in data", () => {
      it("returns sorted result", () => {
        const input = [
          { code: "x" },
          { code: "y" },
          { code: "a" },
          { code: "b" }
        ];
        const output = [
          { code: "a" },
          { code: "b" },
          { code: "x" },
          { code: "y" }
        ];
        const result = input.sort(sortAlphabeticallyBy("code"));
        expect(result).toEqual(output);
      });
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

  describe("generateUniqueDocuments tests", () => {
    describe("When result type is Simple", () => {
      describe("input documents are empty", () => {
        it("returns empty result list", () => {
          const result = generateUniqueDocuments(ResultTypeEnum.Simple, []);
          expect(result).toEqual([]);
        });
      });
      describe("input documents are NOT empty", () => {
        it("returns unique document list", () => {
          const inputDataItems: DocumentResultData[] =
            Array<DocumentResultData>();

          const baseUrl = "http://localhost/document/library/";

          const contenfulDocument = createContentfuldocument({
            id: `contentful-doc-id`,
            asset: {
              file: {
                url: "",
                fileName: `contentful-doc-fileName`,
                contentType: "",
                details: { size: 9999 }
              }
            }
          });

          const pimDocument = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });

          // create duplicate pim documents
          [1, 2, 3].map(() => inputDataItems.push(pimDocument));

          // create duplicate contentful documents
          [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

          const result = generateUniqueDocuments(
            ResultTypeEnum.Simple,
            inputDataItems
          );

          // unique documents for expected result
          const expectedResult: DocumentResultData[] =
            Array<DocumentResultData>();

          const expectedPimDocument = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });
          expectedResult.push(expectedPimDocument);
          expectedResult.push(contenfulDocument);
          expect(result).toEqual(expectedResult);
        });

        it("returns unique documents list with apropriated related products", () => {
          const baseUrl = "http://localhost/document/library/";

          const pimDocument = createPimDocument({
            id: `pim-doc-id-test`,
            url: `${baseUrl}pim-doc-url-test`
          });

          const pimDocument1 = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });
          const pimDocument2 = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });
          const pimDocument3 = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });

          // create duplicate pim documents
          const inputDataItems: DocumentResultData[] =
            Array<DocumentResultData>(
              pimDocument,
              pimDocument1,
              pimDocument2,
              pimDocument3
            );

          const result = generateUniqueDocuments(
            ResultTypeEnum.Simple,
            inputDataItems
          );

          // unique documents for expected result
          const expectedResult: DocumentResultData[] =
            Array<DocumentResultData>();
          const documentWithRelatedProducts = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });
          const expectedPimDocument = createPimDocument({
            id: `pim-doc-id-test`,
            url: `${baseUrl}pim-doc-url-test`
          });
          expectedResult.push(expectedPimDocument);
          expectedResult.push(documentWithRelatedProducts);

          expect(result).toEqual(expectedResult);
        });
      });
    });

    describe("When result type is NOT Simple", () => {
      describe("input documents are empty", () => {
        it("returns empty result list", () => {
          const result = generateUniqueDocuments(ResultTypeEnum.Technical, []);
          expect(result).toEqual([]);
        });
      });
      describe("input documents are NOT empty", () => {
        it("returns document list without filtering", () => {
          const inputDataItems: DocumentResultData[] =
            Array<DocumentResultData>();

          const baseUrl = "http://localhost/document/library/";

          const contenfulDocument = createContentfuldocument({
            id: `contentful-doc-id`,
            asset: {
              file: {
                url: "",
                fileName: `contentful-doc-fileName`,
                contentType: "",
                details: { size: 9999 }
              }
            }
          });

          // const pimLinkDocument = createPimLinkDocument({
          //   id: `pim-link-doc-id`,
          //   url: `${baseUrl}pim-link-doc-url`
          // });

          const pimDocument = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });

          // create duplicate pim documents
          [1, 2, 3].map(() => inputDataItems.push(pimDocument));

          // create duplicate pim link documents
          //[1, 2, 3].map(() => inputDataItems.push(pimLinkDocument));

          // create duplicate contentful documents
          [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

          const result = generateUniqueDocuments(
            ResultTypeEnum.Technical,
            inputDataItems
          );

          expect(result).toEqual(inputDataItems);
        });
      });
    });
  });

  describe("convertToURLFilters tests", () => {
    const input = (firstValue: string[]): ProductFilter[] => [
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
      const input: ProductFilter[] = [
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
