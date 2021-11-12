import { Data as DocumentResultsData } from "../components/DocumentResults";
import { Data as DocumentData } from "../components/Document";
import {
  PIMDocumentData,
  PIMLinkDocumentData
} from "../components/types/PIMDocumentBase";
import {
  clearFilterValues,
  findPIMDocumentBrandCategories,
  convertToURLFilters,
  generateUniqueDocuments,
  getAssetTypeFilterFromDocuments,
  getBrandFilterFromDocuments,
  getDocumentFilters,
  getFilters,
  getPlpFilters,
  getProductFamilyFilterFromDocuments,
  getTextureFilterFromDocuments,
  sortAlphabeticallyBy,
  updateFilterValue,
  getCategoryFilters,
  combineVariantClassifications
} from "../utils/filters";
import { Product } from "../components/types/pim";
import createPimDocument from "./PimDocumentHelper";
import createPimLinkDocument from "./PimLinkDocumentHelper";
import createContentfuldocument from "./ContentfulDocumentHelper";
import createProduct, {
  createBaseProduct,
  createVariantOption
} from "./PimDocumentProductHelper";
import createCategory from "./CategoryHelper";
import createClassification, { createFeature } from "./ClassificationHelper";
import createContentfulDocument from "./ContentfulDocumentHelper";

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
        const result = input.sort(sortAlphabeticallyBy(""));
        expect(result).toEqual(input);
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
        const result = input.sort(sortAlphabeticallyBy("doesNotExist"));
        expect(result).toEqual(input);
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
        expect(result).toEqual(input);
      });
    });
  });

  describe("findPIMDocumentBrandCategory tests", () => {
    describe("When document with no categories array is passed", () => {
      it("returns undefined", () => {
        const inputDataItems: PIMDocumentData | PIMLinkDocumentData =
          createPimDocument({
            product: {
              code: "product-code",
              name: "product-name",
              categories: undefined,
              classifications: undefined
            }
          });
        const result = findPIMDocumentBrandCategories(inputDataItems);
        expect(result).toEqual([]);
      });
    });
    describe("When document with no empty array is passed", () => {
      it("returns undefined", () => {
        const inputDataItems: PIMDocumentData | PIMLinkDocumentData =
          createPimDocument({
            product: {
              code: "product-code",
              name: "product-name",
              categories: []
            }
          });
        const result = findPIMDocumentBrandCategories(inputDataItems);
        expect(result).toEqual([]);
      });
    });
    describe("When document with single Brand category is passed", () => {
      it("returns single brand category in an array", () => {
        const inputDataItems: PIMDocumentData | PIMLinkDocumentData =
          createPimDocument({
            product: {
              code: "product-code",
              name: "product-name",
              categories: [
                {
                  categoryType: "Brand",
                  code: "cat-code1",
                  name: "cat-code1",
                  parentCategoryCode: "cat-code0"
                }
              ]
            }
          });
        const expectedResult = [
          {
            categoryType: "Brand",
            code: "cat-code1",
            name: "cat-code1",
            parentCategoryCode: "cat-code0"
          }
        ];
        const result = findPIMDocumentBrandCategories(inputDataItems);
        expect(result).toEqual(expectedResult);
      });
    });
    describe("When document with multiple Brand category is passed", () => {
      it("returns multiple brand category in an array", () => {
        const inputDataItems: PIMDocumentData | PIMLinkDocumentData =
          createPimDocument({
            product: {
              code: "product-code",
              name: "product-name",
              categories: [
                {
                  categoryType: "Brand",
                  code: "cat-code1",
                  name: "cat-code1",
                  parentCategoryCode: "cat-code-1"
                },
                {
                  categoryType: "Brand",
                  code: "cat-code2",
                  name: "cat-code2",
                  parentCategoryCode: "cat-code-2"
                }
              ]
            }
          });
        const expectedResult = [
          {
            categoryType: "Brand",
            code: "cat-code1",
            name: "cat-code1",
            parentCategoryCode: "cat-code-1"
          },
          {
            categoryType: "Brand",
            code: "cat-code2",
            name: "cat-code2",
            parentCategoryCode: "cat-code-2"
          }
        ];
        const result = findPIMDocumentBrandCategories(inputDataItems);
        expect(result).toEqual(expectedResult);
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

  describe("getAssetTypeFilterFromDocuments tests", () => {
    describe("Documents has NO AssetTypes", () => {
      it("Then: returns undefined", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          assetType: null
        });

        inputDataItems.push(pimDocument);
        const result = getAssetTypeFilterFromDocuments(inputDataItems);
        expect(result).toEqual(undefined);
      });
    });
    describe("Documents has AssetTypes", () => {
      it("Then: returns asset type filter", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`
        });

        const expectedResult = {
          label: "filterLabels.assetType",
          name: "contentfulAssetType",
          options: [
            {
              label: "asset-name",
              value: "asset-code"
            }
          ],
          value: []
        };
        inputDataItems.push(pimDocument);
        const result = getAssetTypeFilterFromDocuments(inputDataItems);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe("getBrandFilterFromDocuments tests", () => {
    describe("Documents has NO Brand Category", () => {
      it("Then: returns undefined", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`
        });

        inputDataItems.push(pimDocument);
        const result = getBrandFilterFromDocuments(inputDataItems);
        expect(result).toEqual(undefined);
      });
    });
    describe("When PIM Documents has Brand category", () => {
      it("Then: returns brand filter", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          product: createProduct({
            categories: [createCategory({ categoryType: "Brand" })],
            classifications: [createClassification()]
          })
        });

        const expectedResult = {
          label: "filterLabels.brand",
          name: "brand",
          options: [
            {
              label: "category-name",
              value: "category-code"
            }
          ],
          value: []
        };
        inputDataItems.push(pimDocument);
        const result = getBrandFilterFromDocuments(inputDataItems);
        expect(result).toEqual(expectedResult);
      });
    });
    describe("When Contenful Documents has Brand category", () => {
      it("Then: returns brand filter", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createContentfulDocument({ brand: "Brand-1" });

        const expectedResult = {
          label: "filterLabels.brand",
          name: "brand",
          options: [
            {
              label: "Brand-1",
              value: "Brand-1"
            }
          ],
          value: []
        };
        inputDataItems.push(pimDocument);
        const result = getBrandFilterFromDocuments(inputDataItems);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe("getProductFamilyFilterFromDocuments tests", () => {
    describe("Documents has NO Categories", () => {
      it("Then: returns undefined", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          product: createProduct({ categories: null })
        });

        inputDataItems.push(pimDocument);
        const result = getProductFamilyFilterFromDocuments(inputDataItems);
        expect(result).toEqual(undefined);
      });
    });

    describe("Documents has NO ProductFamily Category", () => {
      it("Then: returns undefined", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`
        });

        inputDataItems.push(pimDocument);
        const result = getProductFamilyFilterFromDocuments(inputDataItems);
        expect(result).toEqual(undefined);
      });
    });
    describe("Not a Pim document test", () => {
      it("Then: returns undefined", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createContentfulDocument();

        inputDataItems.push(pimDocument);
        const result = getProductFamilyFilterFromDocuments(inputDataItems);
        expect(result).toEqual(undefined);
      });
    });
    describe("Documents has ProductFamily category", () => {
      it("Then: returns ProductFamily filter", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          product: createProduct({
            categories: [createCategory({ categoryType: "ProductFamily" })]
          })
        });

        const expectedResult = {
          label: "filterLabels.productFamily",
          name: "productFamily",
          options: [
            {
              label: "category-name",
              value: "category-code"
            }
          ],
          value: []
        };
        inputDataItems.push(pimDocument);
        const result = getProductFamilyFilterFromDocuments(inputDataItems);
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe("getTextureFilterFromDocuments tests", () => {
    describe("Documents has NO classifications", () => {
      it("Then: returns undefined", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const pimDocument = createPimDocument({
          id: `pim-doc-id`
        });

        inputDataItems.push(pimDocument);
        const result = getTextureFilterFromDocuments("", inputDataItems);
        expect(result).toEqual(undefined);
      });
    });
    describe("Documents has appearance classification", () => {
      describe("And Document has texturefamily classification", () => {
        it("Then: returns texture filter", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const pimDocument = createPimDocument({
            id: `pim-doc-id`,
            product: createProduct({
              classifications: [
                createClassification({
                  name: "appearance Attributes",
                  code: "appearanceAttributes",
                  features: [
                    {
                      name: "classification-feature-name",
                      code: "/appearanceAttributes.texturefamily",
                      featureValues: [
                        {
                          value: "feature-label",
                          code: "value"
                        }
                      ]
                    }
                  ]
                })
              ]
            })
          });

          const expectedResult = {
            label: "filterLabels.textureFamily",
            name: "texturefamily",
            options: [
              {
                label: "feature-label",
                value: "value"
              }
            ],
            value: []
          };
          inputDataItems.push(pimDocument);
          const result = getTextureFilterFromDocuments("", inputDataItems);
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });

  describe("getFilters tests", () => {
    describe("When NO products are provided", () => {
      it("Then: returns empty result", () => {
        const result = getFilters("", []);
        expect(result).toEqual([]);
      });
    });
    describe("And Category is null", () => {
      it("Then: returns empty result", () => {
        const result = getFilters("", [], null);
        expect(result).toEqual([]);
      });
    });
    describe("And pageCategory parameter is not provided", () => {
      describe("And NO matching product category exists in product data", () => {
        it("returns empty result", () => {
          const inputDataItems: Array<Product> = Array<Product>();
          inputDataItems.push(createBaseProduct());

          const result = getFilters("", inputDataItems);
          expect(result).toEqual([]);
        });
      });
      describe("And colour filter categories are present on product classification", () => {
        it("returns colour filters", () => {
          const inputDataItems: Array<Product> = Array<Product>();
          const baseProduct = createBaseProduct();

          baseProduct.classifications = [
            createClassification({
              name: "appearance Attributes",
              code: "appearanceAttributes",
              features: [
                {
                  name: "classification-feature-name",
                  code: "/appearanceAttributes.colourfamily",
                  featureValues: [
                    {
                      value: "feature-label",
                      code: "value"
                    }
                  ]
                }
              ]
            })
          ];
          const expectedResult = [
            {
              label: "filterLabels.colour",
              name: "colour",
              options: [{ label: "feature-label", value: "value" }],
              value: []
            }
          ];
          inputDataItems.push(baseProduct);

          const result = getFilters("", inputDataItems);
          expect(result).toEqual(expectedResult);
        });
      });

      describe("And Materials filter categories are present on product classification", () => {
        it("returns materials filters", () => {
          const inputDataItems: Array<Product> = Array<Product>();
          const baseProduct = createBaseProduct();

          baseProduct.classifications = [
            createClassification({
              name: "appearance Attributes",
              code: "generalInformation",
              features: [
                {
                  name: "classification-feature-name",
                  code: "/generalInformation.materials",
                  featureValues: [
                    {
                      value: "feature-label",
                      code: "value"
                    }
                  ]
                }
              ]
            })
          ];
          const expectedResult = [
            {
              label: "filterLabels.materials",
              name: "materials",
              options: [{ label: "feature-label", value: "value" }],
              value: []
            }
          ];
          inputDataItems.push(baseProduct);

          const result = getFilters("", inputDataItems);
          expect(result).toEqual(expectedResult);
        });
      });

      describe("And texture family filter categories are present on product classification", () => {
        it("returns texture family filters", () => {
          const inputDataItems: Array<Product> = Array<Product>();
          const baseProduct = createBaseProduct();

          baseProduct.classifications = [
            createClassification({
              name: "appearance Attributes",
              code: "appearanceAttributes",
              features: [
                {
                  name: "classification-feature-name",
                  code: "/appearanceAttributes.texturefamily",
                  featureValues: [
                    {
                      value: "feature-label",
                      code: "value"
                    }
                  ]
                }
              ]
            })
          ];
          const expectedResult = [
            {
              label: "filterLabels.textureFamily",
              name: "texturefamily",
              options: [{ label: "feature-label", value: "value" }],
              value: []
            }
          ];
          inputDataItems.push(baseProduct);

          const result = getFilters("", inputDataItems);
          expect(result).toEqual(expectedResult);
        });
      });
    });
    describe("And pageCategory parameter is provided", () => {
      describe("When Products are provided", () => {
        describe("showCategoryFilters is true", () => {
          describe("getCategoryFilters tests", () => {
            describe("And categories are ordered in descending order", () => {
              it("returns category filters sorted by name", () => {
                const inputDataItems: Array<Product> = Array<Product>();
                const baseProduct = createBaseProduct({
                  categories: [
                    createCategory({
                      categoryType: "Category",
                      code: "category-z",
                      name: "category-z",
                      parentCategoryCode: ""
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-2",
                      name: "category-2",
                      parentCategoryCode: "category-z"
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-a",
                      name: "category-a",
                      parentCategoryCode: ""
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-3",
                      name: "category-3",
                      parentCategoryCode: "category-a"
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-aa",
                      name: "category-aa",
                      parentCategoryCode: ""
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-3a",
                      name: "category-3a",
                      parentCategoryCode: "category-aa"
                    })
                  ],
                  variantOptions: [createVariantOption()]
                });
                const expectedResult = [
                  {
                    label: "category-a",
                    name: "category-a",
                    options: [
                      {
                        label: "category-3",
                        value: "category-3"
                      }
                    ],
                    value: []
                  },
                  {
                    label: "category-aa",
                    name: "category-aa",
                    options: [
                      {
                        label: "category-3a",
                        value: "category-3a"
                      }
                    ],
                    value: []
                  },
                  {
                    label: "category-z",
                    name: "category-z",
                    options: [
                      {
                        label: "category-2",
                        value: "category-2"
                      }
                    ],
                    value: []
                  }
                ];
                inputDataItems.push(baseProduct);

                const pageCategory = createCategory({
                  categoryType: "some-category"
                });
                const result = getFilters("", inputDataItems, pageCategory);
                expect(result).toEqual(expectedResult);
              });
            });

            describe("And categories are ordered in ascending order", () => {
              it("returns category filters sorted by name", () => {
                const inputDataItems: Array<Product> = Array<Product>();
                const baseProduct = createBaseProduct({
                  categories: [
                    createCategory({
                      categoryType: "Category",
                      code: "category-a",
                      name: "category-a",
                      parentCategoryCode: ""
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-aa",
                      name: "category-aa",
                      parentCategoryCode: "category-a"
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-aaa",
                      name: "category-aaa",
                      parentCategoryCode: "category-a"
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-b",
                      name: "category-b",
                      parentCategoryCode: ""
                    }),
                    createCategory({
                      categoryType: "Category",
                      code: "category-bbb",
                      name: "category-bbb",
                      parentCategoryCode: "category-b"
                    })
                  ],
                  variantOptions: [createVariantOption()]
                });
                const expectedResult = [
                  {
                    label: "category-a",
                    name: "category-a",
                    value: [],
                    options: [{ label: "category-aa", value: "category-aa" }]
                  },
                  {
                    label: "category-b",
                    name: "category-b",
                    value: [],
                    options: [{ label: "category-bbb", value: "category-bbb" }]
                  }
                ];
                inputDataItems.push(baseProduct);

                const pageCategory = createCategory({
                  categoryType: "some-category"
                });
                const result = getFilters("", inputDataItems, pageCategory);
                expect(result).toEqual(expectedResult);
              });
            });
          });
        });
        describe("And pageCategory is 'Category'", () => {
          it("returns Category filters as undefined", () => {
            const inputDataItems: Array<Product> = Array<Product>();
            const baseProduct = createBaseProduct();
            baseProduct.categories = [
              createCategory({ categoryType: "ProductFamily" })
            ];
            inputDataItems.push(baseProduct);
            const pageCategory = createCategory({
              categoryType: "Category"
            });
            const expectedResult = [
              {
                label: "filterLabels.productFamily",
                name: "productFamily",
                options: [
                  {
                    label: "category-name",
                    value: "category-code"
                  }
                ],
                value: []
              }
            ];
            const result = getFilters("", inputDataItems, pageCategory);
            expect(result).toEqual(expectedResult);
          });
        });
        describe("And pageCategory is 'ProductFamily'", () => {
          it("returns ProductFamily filters as undefined", () => {
            const inputDataItems: Array<Product> = Array<Product>();
            const baseProduct = createBaseProduct();
            baseProduct.categories = [
              createCategory({ categoryType: "ProductFamily" })
            ];
            inputDataItems.push(baseProduct);
            const pageCategory = createCategory({
              categoryType: "ProductFamily"
            });
            const result = getFilters("", inputDataItems, pageCategory);
            expect(result).toEqual([]);
          });
        });
        describe("And pageCategory is NOT 'ProductFamily'", () => {
          it("returns ProductFamily filters", () => {
            const inputDataItems: Array<Product> = Array<Product>();
            const baseProduct = createBaseProduct();
            baseProduct.categories = [
              createCategory({ categoryType: "ProductFamily" })
            ];
            const expectedResult = [
              {
                label: "filterLabels.productFamily",
                name: "productFamily",
                options: [{ label: "category-name", value: "category-code" }],
                value: []
              }
            ];
            inputDataItems.push(baseProduct);
            const pageCategory = createCategory({
              categoryType: "some-category"
            });
            const result = getFilters("", inputDataItems, pageCategory);
            expect(result).toEqual(expectedResult);
          });
        });
        describe("And pageCategory is NOT 'ProductLine'", () => {
          it("And showProductLineFilters is false : returns undefined", () => {
            const inputDataItems: Array<Product> = Array<Product>();
            const baseProduct = createBaseProduct();
            baseProduct.categories = null;
            const expectedResult = [];
            inputDataItems.push(baseProduct);
            const pageCategory = createCategory({
              categoryType: "ProductLine"
            });
            const result = getFilters("", inputDataItems, pageCategory);
            expect(result).toEqual(expectedResult);
          });
          it("And product has NO categories: returns empty result", () => {
            const inputDataItems: Array<Product> = Array<Product>();
            const baseProduct = createBaseProduct();
            baseProduct.categories = null;
            const expectedResult = [];
            inputDataItems.push(baseProduct);
            const pageCategory = createCategory({
              categoryType: "some-category"
            });
            const result = getFilters("", inputDataItems, pageCategory);
            expect(result).toEqual(expectedResult);
          });
          it("returns ProductLine filters", () => {
            const inputDataItems: Array<Product> = Array<Product>();
            const baseProduct = createBaseProduct();
            baseProduct.categories = [
              createCategory({ categoryType: "ProductLine" })
            ];
            const expectedResult = [
              {
                label: "filterLabels.productLine",
                name: "productLine",
                options: [{ label: "category-name", value: "category-code" }],
                value: []
              }
            ];
            inputDataItems.push(baseProduct);
            const pageCategory = createCategory({
              categoryType: "some-category"
            });
            const result = getFilters("", inputDataItems, pageCategory);
            expect(result).toEqual(expectedResult);
          });
        });
      });
      describe("And showBrandFilter parameter is provided", () => {
        describe("And showBrandFilter parameter is true", () => {
          describe("And Brand category is present", () => {
            it("returns Brand filters", () => {
              const inputDataItems: Array<Product> = Array<Product>();
              const baseProduct = createBaseProduct();
              baseProduct.categories = [
                createCategory({ categoryType: "Brand" })
              ];
              const expectedResult = [
                {
                  label: "filterLabels.brand",
                  name: "brand",
                  options: [{ label: "category-name", value: "category-code" }],
                  value: []
                }
              ];
              inputDataItems.push(baseProduct);

              const result = getFilters("", inputDataItems, null, true);
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And Brand category is NOT present", () => {
            it("returns Brand filters", () => {
              const inputDataItems: Array<Product> = Array<Product>();
              const baseProduct = createBaseProduct();
              baseProduct.categories = [
                createCategory({ categoryType: "Brand-not-present" })
              ];
              const expectedResult = [];
              inputDataItems.push(baseProduct);

              const result = getFilters("", inputDataItems, null, true);
              expect(result).toEqual(expectedResult);
            });
          });
        });
      });
    });
  });

  describe("combineVariantClassifications tests", () => {
    describe("When base and variant classifications are null", () => {
      it("returns empty array as result", () => {
        const result = combineVariantClassifications(
          createBaseProduct({
            classifications: null
          }),
          createVariantOption()
        );
        expect(result).toEqual([]);
      });
    });
    describe("When base classifications are null", () => {
      it("returns variant classification and feature values product feature values", () => {
        const result = combineVariantClassifications(
          createBaseProduct({
            classifications: null
          }),
          createVariantOption({
            classifications: [
              createClassification({
                code: "variant-class-1",
                name: "variant-class-1",
                features: [
                  createFeature({
                    code: "variant-feature-1",
                    featureValues: [
                      {
                        value: "variant-feature-value-1",
                        code: "variant-feature-value-code-1"
                      }
                    ]
                  })
                ]
              })
            ]
          })
        );
        expect(result).toEqual([
          {
            name: "variant-class-1",
            code: "variant-class-1",
            features: [
              {
                name: "classification-feature-name",
                code: "variant-feature-1",
                featureValues: [
                  {
                    value: "variant-feature-value-1",
                    code: "variant-feature-value-code-1"
                  }
                ],
                featureUnit: {
                  name: "classification-feature-feature-unit-name",
                  symbol: "classification-feature-feature-unit-symbol",
                  unitType: "classification-feature-feature-unit-unit-type"
                }
              }
            ]
          }
        ]);
      });
    });
    describe("When variant classifications are null", () => {
      it("returns base classification and feature values product feature values", () => {
        const result = combineVariantClassifications(
          createBaseProduct({
            classifications: [
              createClassification({
                code: "base-class-1",
                name: "base-class-1",
                features: [
                  createFeature({
                    code: "base-feature-1",
                    featureValues: [
                      {
                        value: "base-feature-value-1",
                        code: "base-feature-value-code-1"
                      }
                    ]
                  })
                ]
              })
            ]
          }),
          createVariantOption()
        );
        expect(result).toEqual([
          {
            name: "base-class-1",
            code: "base-class-1",
            features: [
              {
                name: "classification-feature-name",
                code: "base-feature-1",
                featureValues: [
                  {
                    value: "base-feature-value-1",
                    code: "base-feature-value-code-1"
                  }
                ],
                featureUnit: {
                  name: "classification-feature-feature-unit-name",
                  symbol: "classification-feature-feature-unit-symbol",
                  unitType: "classification-feature-feature-unit-unit-type"
                }
              }
            ]
          }
        ]);
      });
    });
    describe("When base and variant both classifications are present", () => {
      describe("And both classificaitons are unique", () => {
        it("returns both classification and their feature values", () => {
          const result = combineVariantClassifications(
            createBaseProduct({
              classifications: [
                createClassification({
                  code: "base-class-1",
                  name: "base-class-1",
                  features: [
                    createFeature({
                      code: "base-feature-1",
                      featureValues: [
                        {
                          value: "base-feature-value-1",
                          code: "base-feature-value-code-1"
                        }
                      ]
                    })
                  ]
                })
              ]
            }),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "variant-class-1",
                  name: "variant-class-1",
                  features: [
                    createFeature({
                      code: "variant-feature-1",
                      featureValues: [
                        {
                          value: "variant-feature-value-1",
                          code: "variant-feature-value-code-1"
                        }
                      ]
                    })
                  ]
                })
              ]
            })
          );
          expect(result).toEqual([
            {
              name: "variant-class-1",
              code: "variant-class-1",
              features: [
                {
                  name: "classification-feature-name",
                  code: "variant-feature-1",
                  featureValues: [
                    {
                      value: "variant-feature-value-1",
                      code: "variant-feature-value-code-1"
                    }
                  ],
                  featureUnit: {
                    name: "classification-feature-feature-unit-name",
                    symbol: "classification-feature-feature-unit-symbol",
                    unitType: "classification-feature-feature-unit-unit-type"
                  }
                }
              ]
            },
            {
              name: "base-class-1",
              code: "base-class-1",
              features: [
                {
                  name: "classification-feature-name",
                  code: "base-feature-1",
                  featureValues: [
                    {
                      value: "base-feature-value-1",
                      code: "base-feature-value-code-1"
                    }
                  ],
                  featureUnit: {
                    name: "classification-feature-feature-unit-name",
                    symbol: "classification-feature-feature-unit-symbol",
                    unitType: "classification-feature-feature-unit-unit-type"
                  }
                }
              ]
            }
          ]);
        });
      });
      describe("And both classificaitons are same", () => {
        it("returns variant classification and their feature values", () => {
          const result = combineVariantClassifications(
            createBaseProduct({
              classifications: [
                createClassification({
                  code: "class-1",
                  name: "class-1",
                  features: [
                    createFeature({
                      code: "feature-1",
                      featureValues: [
                        {
                          value: "feature-value-1",
                          code: "feature-value-code-1"
                        }
                      ]
                    })
                  ]
                })
              ]
            }),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "class-1",
                  name: "class-1",
                  features: [
                    createFeature({
                      code: "feature-1",
                      featureValues: [
                        {
                          value: "variant-feature-value-1",
                          code: "variant-feature-value-code-1"
                        }
                      ]
                    })
                  ]
                })
              ]
            })
          );

          expect(result).toEqual([
            {
              name: "class-1",
              code: "class-1",
              features: [
                {
                  name: "classification-feature-name",
                  code: "feature-1",
                  featureValues: [
                    {
                      value: "variant-feature-value-1",
                      code: "variant-feature-value-code-1"
                    }
                  ],
                  featureUnit: {
                    name: "classification-feature-feature-unit-name",
                    symbol: "classification-feature-feature-unit-symbol",
                    unitType: "classification-feature-feature-unit-unit-type"
                  }
                }
              ]
            }
          ]);
        });
      });
      describe("And both classificaitons are scoringWeightAttributes", () => {
        it("returns product scoringWeightAttributes and its values", () => {
          const result = combineVariantClassifications(
            createBaseProduct({
              classifications: [
                createClassification({
                  code: "scoringWeightAttributes",
                  name: "scoringWeightAttributes",
                  features: [
                    createFeature({
                      code: "scoringWeightAttributes.scoringweight",
                      featureUnit: {
                        name: "point",
                        symbol: "p",
                        unitType: "point"
                      },
                      featureValues: [
                        {
                          value: "9999"
                        }
                      ]
                    })
                  ]
                })
              ]
            }),
            createVariantOption({
              classifications: [
                createClassification({
                  code: "scoringWeightAttributes",
                  name: "scoringWeightAttributes",
                  features: [
                    createFeature({
                      code: "scoringWeightAttributes.scoringweight",
                      featureUnit: {
                        name: "point",
                        symbol: "p",
                        unitType: "point"
                      },
                      featureValues: [
                        {
                          value: "974"
                        }
                      ]
                    })
                  ]
                })
              ]
            })
          );
          expect(result).toEqual([
            {
              name: "scoringWeightAttributes",
              code: "scoringWeightAttributes",
              features: [
                {
                  name: "classification-feature-name",
                  code: "scoringWeightAttributes.scoringweight",
                  featureValues: [{ value: "9999" }],
                  featureUnit: { name: "point", symbol: "p", unitType: "point" }
                }
              ]
            }
          ]);
        });
      });
    });
  });

  describe("getPlpFilters function", () => {
    it("should return empty filters, when allowedFilters is null", () => {
      const baseProduct = createBaseProduct();
      expect(
        getPlpFilters({
          products: [baseProduct],
          allowedFilters: null
        })
      ).toStrictEqual([]);
    });

    it("should return empty filters, when products are null", () => {
      expect(
        getPlpFilters({
          products: null,
          allowedFilters: []
        })
      ).toStrictEqual([]);
    });
    it("should work when no filters allowed", () => {
      const baseProduct = createBaseProduct();
      expect(
        getPlpFilters({
          products: [baseProduct],
          allowedFilters: []
        })
      ).toStrictEqual([]);
    });
    describe("category filters tests", () => {
      it("should work when BrandFilter", () => {
        const baseProduct = createBaseProduct();
        baseProduct.categories = [
          createCategory({
            categoryType: "Brand",
            code: "AeroDeck",
            name: "AeroDeck"
          })
        ];

        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Brand"]
          })
        ).toStrictEqual([
          {
            name: "plpFilter.Brand",
            label: "",
            options: [
              {
                value: "AeroDeck",
                label: "AeroDeck"
              }
            ]
          }
        ]);
      });
      it("should work when Category filter", () => {
        const baseProduct = createBaseProduct();
        baseProduct.categories = [
          createCategory({
            categoryType: "Category",
            code: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål"
          }),
          createCategory({
            categoryType: "Category",
            code: "PRODUCTS_NO",
            name: "Produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "ROOF_NO",
            name: "Takprodukter"
          }),
          createCategory({
            categoryType: "Category",
            code: "TILES_STEELROOF_NO",
            name: "Ståltak produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "PITCHEDROOF_NO",
            name: "Skråtak"
          })
        ];
        expect(
          getPlpFilters({
            products: [baseProduct],
            allowedFilters: ["Category"]
          })
        ).toStrictEqual([
          {
            name: "plpFilter.Category",
            label: "",
            options: [
              { label: "Produkter", value: "PRODUCTS_NO" },
              { label: "Skråtak", value: "PITCHEDROOF_NO" },
              { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
              { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
              { label: "Takprodukter", value: "ROOF_NO" }
            ]
          }
        ]);
      });
      it("should work when Category filter with single option", () => {
        const baseProduct = createBaseProduct();
        baseProduct.categories = [
          createCategory({
            categoryType: "Category",
            code: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål"
          }),
          createCategory({
            categoryType: "Category",
            code: "PRODUCTS_NO",
            name: "Produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "ROOF_NO",
            name: "Takprodukter"
          }),
          createCategory({
            categoryType: "Category",
            code: "TILES_STEELROOF_NO",
            name: "Ståltak produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "PITCHEDROOF_NO",
            name: "Skråtak"
          })
        ];

        expect(
          getPlpFilters({
            pimClassificationNamespace: "",
            products: [baseProduct],
            allowedFilters: ["Category | PITCHEDROOF_NO"]
          })
        ).toStrictEqual([
          {
            name: "plpFilter.Category",
            label: "",
            options: [
              {
                value: "PITCHEDROOF_NO",
                label: "Skråtak"
              }
            ]
          }
        ]);
      });
      it("should work when Category filter with multiple options", () => {
        const baseProduct = createBaseProduct();
        baseProduct.categories = [
          createCategory({
            categoryType: "Category",
            code: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål"
          }),
          createCategory({
            categoryType: "Category",
            code: "PRODUCTS_NO",
            name: "Produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "ROOF_NO",
            name: "Takprodukter"
          }),
          createCategory({
            categoryType: "Category",
            code: "TILES_STEELROOF_NO",
            name: "Ståltak produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "PITCHEDROOF_NO",
            name: "Skråtak"
          })
        ];

        expect(
          getPlpFilters({
            pimClassificationNamespace: "",
            products: [baseProduct],
            allowedFilters: [
              "Category | PITCHEDROOF_NO",
              "Category | TILES_STEELROOF_NO"
            ]
          })
        ).toStrictEqual([
          {
            name: "plpFilter.Category",
            label: "",
            options: [
              {
                value: "PITCHEDROOF_NO",
                label: "Skråtak"
              },
              {
                value: "TILES_STEELROOF_NO",
                label: "Ståltak produkter"
              }
            ]
          }
        ]);
      });
      it("should return the whole Category options when Category filter with mixed options of Category and Category option", () => {
        const baseProduct = createBaseProduct();
        baseProduct.categories = [
          createCategory({
            categoryType: "Category",
            code: "MAINTILE_STEELROOF_NO",
            name: "Takpanne stål"
          }),
          createCategory({
            categoryType: "Category",
            code: "PRODUCTS_NO",
            name: "Produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "ROOF_NO",
            name: "Takprodukter"
          }),
          createCategory({
            categoryType: "Category",
            code: "TILES_STEELROOF_NO",
            name: "Ståltak produkter"
          }),
          createCategory({
            categoryType: "Category",
            code: "PITCHEDROOF_NO",
            name: "Skråtak"
          })
        ];

        expect(
          getPlpFilters({
            pimClassificationNamespace: "",
            products: [baseProduct],
            allowedFilters: ["Category | PITCHEDROOF_NO", "Category"]
          })
        ).toStrictEqual([
          {
            name: "plpFilter.Category",
            label: "",
            options: [
              { label: "Produkter", value: "PRODUCTS_NO" },
              { label: "Skråtak", value: "PITCHEDROOF_NO" },
              { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
              { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
              { label: "Takprodukter", value: "ROOF_NO" }
            ]
          }
        ]);

        expect(
          getPlpFilters({
            pimClassificationNamespace: "",
            products: [baseProduct],
            allowedFilters: ["Category", "Category | PITCHEDROOF_NO"]
          })
        ).toStrictEqual([
          {
            name: "plpFilter.Category",
            label: "",
            options: [
              { label: "Produkter", value: "PRODUCTS_NO" },
              { label: "Skråtak", value: "PITCHEDROOF_NO" },
              { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
              { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
              { label: "Takprodukter", value: "ROOF_NO" }
            ]
          }
        ]);
      });
      describe("multiple products with multiple categories tests", () => {
        it("should return the whole Category options when Category filter with mixed options of Category and Category option", () => {
          const baseProduct = createBaseProduct();
          baseProduct.categories = [
            createCategory({
              categoryType: "Category",
              code: "MAINTILE_STEELROOF_NO",
              name: "Takpanne stål"
            }),
            createCategory({
              categoryType: "Category",
              code: "PRODUCTS_NO",
              name: "Produkter"
            }),
            createCategory({
              categoryType: "Category",
              code: "ROOF_NO",
              name: "Takprodukter"
            }),
            createCategory({
              categoryType: "Category",
              code: "TILES_STEELROOF_NO",
              name: "Ståltak produkter"
            }),
            createCategory({
              categoryType: "Category",
              code: "PITCHEDROOF_NO",
              name: "Skråtak"
            })
          ];
          const baseProduct2 = createBaseProduct();
          baseProduct2.categories = [
            createCategory({
              categoryType: "Category",
              code: "MAINTILE_STEELROOF_NO",
              name: "Takpanne stål"
            }),
            createCategory({
              categoryType: "Category",
              code: "PRODUCTS_NO",
              name: "Produkter"
            }),
            createCategory({
              categoryType: "Category",
              code: "ROOF_NO_2",
              name: "Takprodukter_2"
            }),
            createCategory({
              categoryType: "Category",
              code: "TILES_STEELROOF_NO_2",
              name: "Ståltak produkter_2"
            }),
            createCategory({
              categoryType: "Category",
              code: "PITCHEDROOF_NO_2",
              name: "Skråtak_2"
            })
          ];

          expect(
            getPlpFilters({
              pimClassificationNamespace: "",
              products: [baseProduct, baseProduct2],
              allowedFilters: ["Category | PITCHEDROOF_NO", "Category"]
            })
          ).toStrictEqual([
            {
              name: "plpFilter.Category",
              label: "",
              options: [
                { label: "Produkter", value: "PRODUCTS_NO" },
                { label: "Skråtak", value: "PITCHEDROOF_NO" },
                { label: "Skråtak_2", value: "PITCHEDROOF_NO_2" },
                { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
                { label: "Ståltak produkter_2", value: "TILES_STEELROOF_NO_2" },
                { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
                { label: "Takprodukter", value: "ROOF_NO" },
                { label: "Takprodukter_2", value: "ROOF_NO_2" }
              ]
            }
          ]);
          expect(
            getPlpFilters({
              pimClassificationNamespace: "",
              products: [baseProduct, baseProduct2],
              allowedFilters: ["Category", "Category | PITCHEDROOF_NO"]
            })
          ).toStrictEqual([
            {
              name: "plpFilter.Category",
              label: "",
              options: [
                { label: "Produkter", value: "PRODUCTS_NO" },
                { label: "Skråtak", value: "PITCHEDROOF_NO" },
                { label: "Skråtak_2", value: "PITCHEDROOF_NO_2" },
                { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
                { label: "Ståltak produkter_2", value: "TILES_STEELROOF_NO_2" },
                { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
                { label: "Takprodukter", value: "ROOF_NO" },
                { label: "Takprodukter_2", value: "ROOF_NO_2" }
              ]
            }
          ]);
        });
      });
    });
    describe("classification features filter tests", () => {
      describe("multiple products with single classifications tests", () => {
        it("should return the classification options", () => {
          const baseProduct = createBaseProduct();
          baseProduct.classifications = [
            createClassification({
              code: "measurements.length",
              features: [
                createFeature({
                  code: "measurements.length",
                  name: "length",
                  featureValues: [{ value: "100", code: "100" }]
                })
              ]
            })
          ];

          const baseProduct2 = createBaseProduct();
          baseProduct2.classifications = [
            createClassification({
              code: "measurements.length",
              features: [
                createFeature({
                  code: "measurements.length",
                  name: "length",
                  featureValues: [{ value: "100", code: "100" }]
                })
              ]
            })
          ];

          expect(
            getPlpFilters({
              pimClassificationNamespace: "",
              products: [baseProduct, baseProduct2],
              allowedFilters: ["measurements.length"]
            })
          ).toStrictEqual([
            {
              name: "measurements.length",
              label: "length",
              options: [
                {
                  label: "100 classification-feature-feature-unit-symbol",
                  value: "100classification-feature-feature-unit-symbol",
                  sortValue: 100
                }
              ]
            }
          ]);

          expect(
            getPlpFilters({
              pimClassificationNamespace: "",
              products: [baseProduct, baseProduct2],
              allowedFilters: ["measurements.length", "measurements.width"]
            })
          ).toStrictEqual([
            {
              name: "measurements.length",
              label: "length",
              options: [
                {
                  label: "100 classification-feature-feature-unit-symbol",
                  value: "100classification-feature-feature-unit-symbol",
                  sortValue: 100
                }
              ]
            }
          ]);
        });
      });

      describe("multiple products with multiple classifications tests", () => {
        describe("and all classification names are valid", () => {
          it("should return the classification options", () => {
            const baseProduct = createBaseProduct();
            baseProduct.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    name: "length",
                    featureValues: [{ value: "100", code: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    name: "width",
                    featureValues: [{ value: "200", code: "200" }]
                  })
                ]
              })
            ];

            const baseProduct2 = createBaseProduct();
            baseProduct2.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    name: "length",
                    featureValues: [{ value: "100", code: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    name: "width",
                    featureValues: [{ value: "300", code: "300" }]
                  })
                ]
              })
            ];

            expect(
              getPlpFilters({
                pimClassificationNamespace: "",
                products: [baseProduct, baseProduct2],
                allowedFilters: ["measurements.length", "measurements.width"]
              })
            ).toStrictEqual([
              {
                name: "measurements.length",
                label: "length",
                options: [
                  {
                    label: "100 classification-feature-feature-unit-symbol",
                    value: "100classification-feature-feature-unit-symbol",
                    sortValue: 100
                  }
                ]
              },
              {
                name: "measurements.width",
                label: "width",
                options: [
                  {
                    label: "200 classification-feature-feature-unit-symbol",
                    value: "200classification-feature-feature-unit-symbol",
                    sortValue: 200
                  },
                  {
                    label: "300 classification-feature-feature-unit-symbol",
                    value: "300classification-feature-feature-unit-symbol",
                    sortValue: 300
                  }
                ]
              }
            ]);
          });
        });
        describe("and some classification names are invalid", () => {
          it("should return the valid classification options", () => {
            const baseProduct = createBaseProduct();
            baseProduct.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    name: "length",
                    featureValues: [{ value: "100", code: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    name: "width",
                    featureValues: [{ value: "200", code: "200" }]
                  })
                ]
              })
            ];

            const baseProduct2 = createBaseProduct();
            baseProduct2.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    name: "length",
                    featureValues: [{ value: "100", code: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    name: "width",
                    featureValues: [{ value: "300", code: "300" }]
                  })
                ]
              })
            ];

            expect(
              getPlpFilters({
                pimClassificationNamespace: "",
                products: [baseProduct, baseProduct2],
                allowedFilters: [
                  "measurements.length",
                  "measurements.invalid.2",
                  "measurements.width",
                  "measurements.invalid"
                ]
              })
            ).toStrictEqual([
              {
                name: "measurements.length",
                label: "length",
                options: [
                  {
                    label: "100 classification-feature-feature-unit-symbol",
                    value: "100classification-feature-feature-unit-symbol",
                    sortValue: 100
                  }
                ]
              },
              {
                name: "measurements.width",
                label: "width",
                options: [
                  {
                    label: "200 classification-feature-feature-unit-symbol",
                    value: "200classification-feature-feature-unit-symbol",
                    sortValue: 200
                  },
                  {
                    label: "300 classification-feature-feature-unit-symbol",
                    value: "300classification-feature-feature-unit-symbol",
                    sortValue: 300
                  }
                ]
              }
            ]);
          });
        });
        describe("and ALL classification names are invalid", () => {
          it("should return the empty filters", () => {
            const baseProduct = createBaseProduct();
            baseProduct.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    featureValues: [{ value: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    featureValues: [{ value: "200" }]
                  })
                ]
              })
            ];

            const baseProduct2 = createBaseProduct();
            baseProduct2.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    featureValues: [{ value: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    featureValues: [{ value: "300" }]
                  })
                ]
              })
            ];

            expect(
              getPlpFilters({
                pimClassificationNamespace: "",
                products: [baseProduct, baseProduct2],
                allowedFilters: [
                  "measurements.invalid.2",
                  "measurements.invalid",
                  "invalid.invalid"
                ]
              })
            ).toStrictEqual([]);
          });
        });
      });
    });
    describe("All Filter order test", () => {
      describe("When multiple products with multiple classifications and Categories are provided tests", () => {
        describe("and mixed filterby criteria is applied", () => {
          it("should return filters in the order of the filterby criteria", () => {
            const baseProduct = createBaseProduct();
            baseProduct.categories = [
              createCategory({
                categoryType: "Category",
                code: "MAINTILE_STEELROOF_NO",
                name: "Takpanne stål"
              }),
              createCategory({
                categoryType: "Category",
                code: "PRODUCTS_NO",
                name: "Produkter"
              }),
              createCategory({
                categoryType: "Category",
                code: "ROOF_NO",
                name: "Takprodukter"
              }),
              createCategory({
                categoryType: "Category",
                code: "TILES_STEELROOF_NO",
                name: "Ståltak produkter"
              }),
              createCategory({
                categoryType: "Category",
                code: "PITCHEDROOF_NO",
                name: "Skråtak"
              })
            ];
            baseProduct.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    name: "length",
                    featureValues: [{ value: "100", code: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    name: "width",
                    featureValues: [{ value: "200", code: "200" }]
                  })
                ]
              })
            ];

            const baseProduct2 = createBaseProduct();
            baseProduct2.categories = [
              createCategory({
                categoryType: "Category",
                code: "MAINTILE_STEELROOF_NO",
                name: "Takpanne stål"
              }),
              createCategory({
                categoryType: "Category",
                code: "PRODUCTS_NO",
                name: "Produkter"
              }),
              createCategory({
                categoryType: "Category",
                code: "ROOF_NO",
                name: "Takprodukter"
              }),
              createCategory({
                categoryType: "Category",
                code: "TILES_STEELROOF_NO",
                name: "Ståltak produkter"
              }),
              createCategory({
                categoryType: "Category",
                code: "PITCHEDROOF_NO",
                name: "Skråtak"
              })
            ];
            baseProduct2.classifications = [
              createClassification({
                code: "measurements.length",
                features: [
                  createFeature({
                    code: "measurements.length",
                    name: "length",
                    featureValues: [{ value: "100", code: "100" }]
                  })
                ]
              }),
              createClassification({
                code: "measurements.width",
                features: [
                  createFeature({
                    code: "measurements.width",
                    name: "width",
                    featureValues: [{ value: "300", code: "300" }]
                  })
                ]
              })
            ];

            //example order1
            const result1 = getPlpFilters({
              pimClassificationNamespace: "",
              products: [baseProduct, baseProduct2],
              allowedFilters: [
                "measurements.length",
                "measurements.width",
                "Category"
              ]
            });
            expect(result1).toStrictEqual([
              {
                name: "measurements.length",
                label: "length",
                options: [
                  {
                    label: "100 classification-feature-feature-unit-symbol",
                    value: "100classification-feature-feature-unit-symbol",
                    sortValue: 100
                  }
                ]
              },
              {
                name: "measurements.width",
                label: "width",
                options: [
                  {
                    label: "200 classification-feature-feature-unit-symbol",
                    value: "200classification-feature-feature-unit-symbol",
                    sortValue: 200
                  },
                  {
                    label: "300 classification-feature-feature-unit-symbol",
                    value: "300classification-feature-feature-unit-symbol",
                    sortValue: 300
                  }
                ]
              },
              {
                name: "plpFilter.Category",
                label: "",
                options: [
                  { label: "Produkter", value: "PRODUCTS_NO" },
                  { label: "Skråtak", value: "PITCHEDROOF_NO" },
                  { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
                  { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
                  { label: "Takprodukter", value: "ROOF_NO" }
                ]
              }
            ]);

            //order by different order
            const result2 = getPlpFilters({
              pimClassificationNamespace: "",
              products: [baseProduct, baseProduct2],
              allowedFilters: [
                "measurements.width",
                "Category",
                "measurements.length"
              ]
            });
            expect(result2).toStrictEqual([
              {
                name: "measurements.width",
                label: "width",
                options: [
                  {
                    label: "200 classification-feature-feature-unit-symbol",
                    value: "200classification-feature-feature-unit-symbol",
                    sortValue: 200
                  },
                  {
                    label: "300 classification-feature-feature-unit-symbol",
                    value: "300classification-feature-feature-unit-symbol",
                    sortValue: 300
                  }
                ]
              },
              {
                name: "plpFilter.Category",
                label: "",
                options: [
                  { label: "Produkter", value: "PRODUCTS_NO" },
                  { label: "Skråtak", value: "PITCHEDROOF_NO" },
                  { label: "Ståltak produkter", value: "TILES_STEELROOF_NO" },
                  { label: "Takpanne stål", value: "MAINTILE_STEELROOF_NO" },
                  { label: "Takprodukter", value: "ROOF_NO" }
                ]
              },
              {
                name: "measurements.length",
                label: "length",
                options: [
                  {
                    label: "100 classification-feature-feature-unit-symbol",
                    value: "100classification-feature-feature-unit-symbol",
                    sortValue: 100
                  }
                ]
              }
            ]);
          });
        });
      });
    });
  });

  describe("getCategoryFilters tests", () => {
    describe("and category names are euqal", () => {
      it("it returns same category name", () => {
        const inputDataItems = {
          "category-a": { name: "category-a", values: [createCategory()] },
          "category-b": { name: "category-a", values: [createCategory()] }
        };
        const expectedResult = [
          {
            label: "category-a",
            name: "category-a",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "category-a",
            name: "category-b",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          }
        ];
        const result = getCategoryFilters(inputDataItems);
        expect(result).toStrictEqual(expectedResult);
      });
    });
  });

  describe("generateUniqueDocuments tests", () => {
    describe("When result type is Simple", () => {
      describe("input documents are empty", () => {
        it("returns empty result list", () => {
          const result = generateUniqueDocuments("Simple", []);
          expect(result).toEqual([]);
        });
      });
      describe("input documents are NOT empty", () => {
        it("returns unique document list", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

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

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-link-doc-id`,
            url: `${baseUrl}pim-link-doc-url`
          });

          const pimDocument = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });

          // create duplicate pim documents
          [1, 2, 3].map(() => inputDataItems.push(pimDocument));

          // create duplicate pim link documents
          [1, 2, 3].map(() => inputDataItems.push(pimLinkDocument));

          // create duplicate contentful documents
          [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

          const result = generateUniqueDocuments("Simple", inputDataItems);

          // unique documents for expected result
          const expectedResult: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();
          expectedResult.push(pimDocument);
          expectedResult.push(pimLinkDocument);
          expectedResult.push(contenfulDocument);

          expect(result).toEqual(expectedResult);
        });
      });
    });

    describe("When result type is NOT Simple", () => {
      describe("input documents are empty", () => {
        it("returns empty result list", () => {
          const result = generateUniqueDocuments("Technical", []);
          expect(result).toEqual([]);
        });
      });
      describe("input documents are NOT empty", () => {
        it("returns document list without filtering", () => {
          const inputDataItems: DocumentResultsData =
            Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

          const baseUrl: string = "http://localhost/document/library/";

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

          const pimLinkDocument = createPimLinkDocument({
            id: `pim-link-doc-id`,
            url: `${baseUrl}pim-link-doc-url`
          });

          const pimDocument = createPimDocument({
            id: `pim-doc-id`,
            url: `${baseUrl}pim-doc-url`
          });

          // create duplicate pim documents
          [1, 2, 3].map(() => inputDataItems.push(pimDocument));

          // create duplicate pim link documents
          [1, 2, 3].map(() => inputDataItems.push(pimLinkDocument));

          // create duplicate contentful documents
          [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

          const result = generateUniqueDocuments("Technical", inputDataItems);

          expect(result).toEqual(inputDataItems);
        });
      });
    });
  });

  describe("getDocumentFilters tests", () => {
    describe("When non supported arguments are passed for filters tests", () => {
      it("Then: returns NO filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

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

        const pimLinkDocument = createPimLinkDocument({
          id: `pim-link-doc-id`,
          url: `${baseUrl}pim-link-doc-url`
        });

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`
        });

        // create duplicate pim documents
        [1, 2, 3].map(() => inputDataItems.push(pimDocument));

        // create duplicate pim link documents
        [1, 2, 3].map(() => inputDataItems.push(pimLinkDocument));

        // create duplicate contentful documents
        [1, 2, 3].map(() => inputDataItems.push(contenfulDocument));

        // ALL : Technical is not supported
        let result = getDocumentFilters(
          inputDataItems,
          "ALL",
          "Technical",
          "classificationNamespace",
          []
        );
        expect(result).toEqual([]);

        // CMS : Technical is not supported
        result = getDocumentFilters(
          inputDataItems,
          "CMS",
          "Technical",
          "classificationNamespace",
          []
        );
        expect(result).toEqual([]);
      });
    });

    describe("When 'PIM' document data is viewed in 'Simple' Page", () => {
      it("Then: returns brand and product family filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.productFamily",
            name: "productFamily",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          undefined
        ];

        inputDataItems.push(pimDocument);
        const result = getDocumentFilters(
          inputDataItems,
          "PIM",
          "Simple",
          "classificationNamespace",
          []
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'PIM' document data is viewed in 'Technical' Page", () => {
      it("Then: returns brand and product family filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.productFamily",
            name: "productFamily",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        const result = getDocumentFilters(
          inputDataItems,
          "PIM",
          "Technical",
          "classificationNamespace",
          []
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'CMS' document data is viewed in 'Card Collection' Page", () => {
      it("Then: returns brand filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        const result = getDocumentFilters(
          inputDataItems,
          "CMS",
          "Card Collection",
          "classificationNamespace",
          []
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'CMS' document data is viewed in 'Simple' Page", () => {
      it("Then: returns brand filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.assetType",
            name: "contentfulAssetType",
            options: [
              {
                label: "asset-name",
                value: "asset-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        const result = getDocumentFilters(
          inputDataItems,
          "CMS",
          "Simple",
          "classificationNamespace",
          []
        );
        expect(result).toEqual(expectedResult);
      });
    });

    describe("When 'ALL' document data is viewed in 'Simple' Page", () => {
      it("Then: returns brand filters", () => {
        const inputDataItems: DocumentResultsData =
          Array<PIMDocumentData | DocumentData | PIMLinkDocumentData>();

        const baseUrl: string = "http://localhost/document/library/";

        const pimDocument = createPimDocument({
          id: `pim-doc-id`,
          url: `${baseUrl}pim-doc-url`,
          product: createProduct({
            categories: [
              createCategory({ categoryType: "Brand" }),
              createCategory({ categoryType: "ProductFamily" })
            ],
            classifications: [createClassification()]
          })
        });

        const expectedResult = [
          {
            label: "filterLabels.assetType",
            name: "contentfulAssetType",
            options: [
              {
                label: "asset-name",
                value: "asset-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.brand",
            name: "brand",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          },
          {
            label: "filterLabels.productFamily",
            name: "productFamily",
            options: [
              {
                label: "category-name",
                value: "category-code"
              }
            ],
            value: []
          }
        ];

        inputDataItems.push(pimDocument);
        const result = getDocumentFilters(
          inputDataItems,
          "ALL",
          "Simple",
          "classificationNamespace",
          []
        );
        expect(result).toEqual(expectedResult);
      });
    });
  });

  describe("convertToURLFilters tests", () => {
    const input = (firstValue: string[]) => [
      {
        label: "Colour",
        name: "colour",
        options: [
          { label: "Grey", value: "grey", isDisabled: false },
          { label: "Red", value: "red", isDisabled: false }
        ],
        value: firstValue
      },
      {
        label: "Material",
        name: "material",
        options: [
          { label: "Slate", value: "slate", isDisabled: false },
          { label: "Clay", value: "clay", isDisabled: false }
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
      const input = [
        {
          label: "Colour",
          name: "colour",
          options: [
            { label: "Grey", value: "grey", isDisabled: false },
            { label: "Red", value: "red", isDisabled: false }
          ],
          value: ["red", "grey"]
        },
        {
          label: "Material",
          name: "material",
          options: [
            { label: "Slate", value: "slate", isDisabled: false },
            { label: "Clay", value: "clay", isDisabled: false }
          ],
          value: ["clay"]
        },
        {
          label: "Material2",
          name: "material2",
          options: [
            { label: "Slate", value: "slate", isDisabled: false },
            { label: "Clay", value: "clay", isDisabled: false }
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
