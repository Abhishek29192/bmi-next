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
  getProductFamilyFilterFromDocuments,
  getTextureFilterFromDocuments,
  sortAlphabeticallyBy,
  updateFilterValue,
  getCategoryFilters
} from "../utils/filters";
import { Product } from "../components/types/ProductBaseTypes";
import createPimDocument from "./PimDocumentHelper";
import createPimLinkDocument from "./PimLinkDocumentHelper";
import createContentfuldocument from "./ContentfulDocumentHelper";
import createProduct, {
  createBaseProduct,
  createVariantOption
} from "./PimDocumentProductHelper";
import createCategory from "./CategoryHelper";
import createClassification from "./ClassificationHelper";
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
              categories: undefined
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
        expect(result).toEqual(expectedResult);
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
          "classificationNamespace"
        );
        expect(result).toEqual([]);

        // CMS : Technical is not supported
        result = getDocumentFilters(
          inputDataItems,
          "CMS",
          "Technical",
          "classificationNamespace"
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
          "classificationNamespace"
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
          "classificationNamespace"
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
          "classificationNamespace"
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
          "classificationNamespace"
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
          "classificationNamespace"
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

    it("clears filters correctly", () => {
      const result = convertToURLFilters(input(undefined));
      expect(result).toEqual([]);
    });
  });
});
