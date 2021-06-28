import {
  findProductBrandLogoCode,
  getMergedClassifications,
  getProductUrl,
  getValidClassification,
  getValidFeatures,
  getSizeLabel,
  findMasterImageUrl,
  getColourThumbnailUrl,
  mapGalleryImages,
  groupProductsByCategory,
  mapClassificationValues,
  TransformedClassificationsMap,
  TransformedMeasurementValue,
  TransformedClassificationValue,
  getProductAttributes,
  findAllCategories,
  findUniqueVariantClassifications,
  mapProductClassifications
} from "../product-details-transforms";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import {
  createBaseProduct,
  createVariantOption,
  createVariantOptionWithProduct
} from "../../__tests__/PimDocumentProductHelper";
import createCategory from "../../__tests__/CategoryHelper";
import { Product } from "../../components/types/ProductBaseTypes";

describe("product-details-transforms tests", () => {
  describe("getProductUrl tests", () => {
    describe("When country code and path is provided", () => {
      it("returns formatted url", () => {
        const countryCode = "en";
        const path = "test.com/product/1";
        const expectedResult = `/${countryCode}/${path}`;
        const result = getProductUrl(countryCode, path);
        expect(result).toEqual(expectedResult);
      });
    });
  });
  describe("getSizeLabel tests", () => {
    describe("When measurement is NOT provided", () => {
      describe("And withUnit is false", () => {
        it("returns null", () => {
          const result = getSizeLabel(null, false);
          expect(result).toEqual(undefined);
        });
      });
      describe("And withUnit is true", () => {
        it("returns null", () => {
          const result = getSizeLabel(null, true);
          expect(result).toEqual(undefined);
        });
      });
    });
    describe("When measurement is provided", () => {
      describe("And withUnit is false", () => {
        describe("And all measurement unit are same", () => {
          it("returns size label text without measurements", () => {
            const result = getSizeLabel(
              {
                length: {
                  name: "length",
                  value: { value: { value: "10" }, unit: "mm" }
                },
                height: {
                  name: "height",
                  value: { value: { value: "20" }, unit: "mm" }
                },
                width: {
                  name: "width",
                  value: { value: { value: "30" }, unit: "mm" }
                }
              },
              false
            );
            expect(result).toEqual("30x10x20");
          });
        });
        describe("And all measurement units are NOT same", () => {
          it("returns size label text with measurement units", () => {
            const result = getSizeLabel(
              {
                length: {
                  name: "length",
                  value: { value: { value: "10" }, unit: "in" }
                },
                height: {
                  name: "height",
                  value: { value: { value: "20" }, unit: "cm" }
                },
                width: {
                  name: "width",
                  value: { value: { value: "30" }, unit: "mm" }
                }
              },
              false
            );
            expect(result).toEqual("30mm x 10in x 20cm");
          });
        });
      });
      describe("And withUnit is true", () => {
        describe("And All units are same", () => {
          it("returns size label text with measurements", () => {
            const result = getSizeLabel({
              length: {
                name: "length",
                value: { value: { value: "10" }, unit: "mm" }
              },
              height: {
                name: "height",
                value: { value: { value: "20" }, unit: "mm" }
              },
              width: {
                name: "width",
                value: { value: { value: "30" }, unit: "mm" }
              }
            });
            expect(result).toEqual("30x10x20mm");
          });
        });
        describe("And All units are NOT same", () => {
          it("returns size label text with first value unit of measure", () => {
            const result = getSizeLabel({
              length: {
                name: "length",
                value: { value: { value: "10" }, unit: "in" }
              },
              height: {
                name: "height",
                value: { value: { value: "20" }, unit: "cm" }
              },
              width: {
                name: "width",
                value: { value: { value: "30" }, unit: "mm" }
              }
            });
            expect(result).toEqual("30mm x 10in x 20cm");
          });
        });
      });
    });
  });
  describe("mapProductClassifications tests", () => {
    describe("When product is provided with invalid classifications", () => {
      it("returns empty object", () => {
        const result = mapProductClassifications(createBaseProduct(), "");
        expect(result).toEqual({});
      });
    });
    describe("When product is provided with valid classifications", () => {
      describe("When each feature of each classifications are null", () => {
        it("returns values with n/a  in a classification map", () => {
          const inputValue = createBaseProduct({
            images: [],
            classifications: [
              createClassification({
                name: "scoringWeight Attributes",
                code: "scoringWeightAttributes",
                features: [
                  {
                    name: "scoringweight",
                    code: "/scoringWeightAttributes.scoringweight",
                    featureValues: []
                  }
                ]
              }),
              createClassification({
                name: "appearanceAttributes",
                code: "appearanceAttributes",
                features: [
                  {
                    name: "texturefamily",
                    code: "/appearanceAttributes.texturefamily",
                    featureValues: null
                  },
                  {
                    name: "colour",
                    code: "/appearanceAttributes.colour",
                    featureValues: null
                  },
                  {
                    name: "colourfamily",
                    code: "/appearanceAttributes.colourfamily",
                    featureValues: null
                  }
                ]
              }),
              createClassification({
                name: "general Information",
                code: "generalInformation",
                features: [
                  {
                    name: "materials",
                    code: "/generalInformation.materials",
                    featureValues: null
                  }
                ]
              })
            ]
          });
          const result = mapProductClassifications(inputValue, "");
          const expectedResult = {
            "product-code": {
              scoringweight: { name: "scoringWeight Attributes" },
              texturefamily: { name: "texturefamily", value: "n/a" },
              colour: { name: "colour", value: "n/a" },
              colourfamily: { name: "colourfamily", value: "n/a" },
              materials: { name: "materials", value: "n/a" }
            }
          };
          expect(result).toEqual(expectedResult);
        });
      });

      describe("When each feature of each classifications are correctly matching", () => {
        it("returns correct values in a classification map", () => {
          const result = mapProductClassifications(
            createBaseProduct({
              images: [],
              classifications: [
                createClassification({
                  name: "scoringWeight Attributes",
                  code: "scoringWeightAttributes",
                  features: [
                    {
                      name: "scoringweight",
                      code: "/scoringWeightAttributes.scoringweight",
                      featureValues: []
                    }
                  ]
                }),
                createClassification({
                  name: "measurements",
                  code: "measurements",
                  features: [
                    {
                      name: "measurements",
                      code: "/measurements.length",
                      featureValues: [
                        {
                          value: "10",
                          code: "length"
                        }
                      ]
                    },
                    {
                      name: "measurements",
                      code: "/measurements.width",
                      featureValues: [
                        {
                          value: "100",
                          code: "width"
                        }
                      ]
                    },
                    {
                      name: "measurements",
                      code: "/measurements.height",
                      featureValues: [
                        {
                          value: "50",
                          code: "height"
                        }
                      ]
                    },
                    {
                      name: "measurements",
                      code: "/measurements.thickness",
                      featureValues: [
                        {
                          value: "5",
                          code: "thickness"
                        }
                      ]
                    }
                  ]
                }),
                createClassification({
                  name: "appearance Attributes",
                  code: "appearanceAttributes",
                  features: [
                    {
                      name: "colour",
                      code: "/appearanceAttributes.colour",
                      featureValues: [
                        {
                          value: "red",
                          code: "colour"
                        }
                      ]
                    },
                    {
                      name: "colourfamily",
                      code: "/appearanceAttributes.colourfamily",
                      featureValues: [
                        {
                          value: "dark",
                          code: "colourfamily"
                        }
                      ]
                    }
                  ]
                }),
                createClassification({
                  name: "general Information",
                  code: "generalInformation",
                  features: [
                    {
                      name: "materials",
                      code: "/generalInformation.materials",
                      featureValues: [
                        {
                          value: "test",
                          code: "materials"
                        }
                      ]
                    }
                  ]
                })
              ]
            }),
            ""
          );
          const expectedResult = {
            "product-code": {
              scoringweight: { name: "scoringWeight Attributes" },
              measurements: {
                length: {
                  name: "measurements",
                  value: { value: { value: "10", code: "length" } }
                },
                width: {
                  name: "measurements",
                  value: { value: { value: "100", code: "width" } }
                },
                height: {
                  name: "measurements",
                  value: { value: { value: "50", code: "height" } }
                },
                thickness: {
                  name: "measurements",
                  value: { value: { value: "5", code: "thickness" } }
                }
              },
              colour: {
                name: "colour",
                value: { value: "red", code: "colour" }
              },
              colourfamily: {
                name: "colourfamily",
                value: { value: "dark", code: "colourfamily" }
              },
              materials: {
                name: "materials",
                value: { value: "test", code: "materials" }
              }
            }
          };
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
  describe("findUniqueVariantClassifications tests", () => {
    describe("When VariantOptionWithProduct is provided", () => {
      describe("And it does not contain valid classifications", () => {
        it("returns empty object", () => {
          const result = findUniqueVariantClassifications(
            createVariantOptionWithProduct(),
            ""
          );
          expect(result).toEqual({});
        });
      });
      describe("And it contains valid classifications", () => {
        describe("And classifications has values", () => {
          it("returns correct object", () => {
            const inputValue = createVariantOptionWithProduct({
              _product: createBaseProduct({
                images: [],
                variantOptions: [
                  createVariantOption({
                    classifications: [
                      createClassification({
                        name: "scoringWeight Attributes",
                        code: "scoringWeightAttributes",
                        features: [
                          {
                            name: "scoringweight",
                            code: "/scoringWeightAttributes.scoringweight",
                            featureValues: [
                              {
                                value: "1",
                                code: "scoringweight"
                              }
                            ]
                          }
                        ]
                      }),
                      createClassification({
                        name: "measurements",
                        code: "measurements",
                        features: [
                          {
                            name: "measurements",
                            code: "/measurements.length",
                            featureValues: [
                              {
                                value: "10",
                                code: "length"
                              }
                            ]
                          },
                          {
                            name: "measurements",
                            code: "/measurements.width",
                            featureValues: [
                              {
                                value: "100",
                                code: "width"
                              }
                            ]
                          },
                          {
                            name: "measurements",
                            code: "/measurements.height",
                            featureValues: [
                              {
                                value: "50",
                                code: "height"
                              }
                            ]
                          },
                          {
                            name: "measurements",
                            code: "/measurements.thickness",
                            featureValues: [
                              {
                                value: "5",
                                code: "thickness"
                              }
                            ]
                          }
                        ]
                      }),
                      createClassification({
                        name: "appearance Attributes",
                        code: "appearanceAttributes",
                        features: [
                          {
                            name: "colour",
                            code: "/appearanceAttributes.colour",
                            featureValues: [
                              {
                                value: "red",
                                code: "colour"
                              }
                            ]
                          }
                        ]
                      })
                    ]
                  })
                ]
              })
            });
            const expectedResult = {
              scoringweight: {
                name: "scoringWeight Attributes",
                value: {
                  code: "scoringweight",
                  value: "1"
                }
              }
            };
            const result = findUniqueVariantClassifications(inputValue, "");
            expect(result).toEqual(expectedResult);
          });
        });
        describe("And classifications does not have values", () => {
          it("returns correct object", () => {
            const inputValue = createVariantOptionWithProduct({
              _product: createBaseProduct({
                images: [],
                variantOptions: [
                  createVariantOption({
                    classifications: [
                      createClassification({
                        name: "scoringWeight Attributes",
                        code: "scoringWeightAttributes",
                        features: [
                          {
                            name: "scoringweight",
                            code: "/scoringWeightAttributes.scoringweight",
                            featureValues: []
                          }
                        ]
                      }),
                      createClassification({
                        name: "measurements",
                        code: "measurements",
                        features: [
                          {
                            name: "measurements",
                            code: "/measurements.length",
                            featureValues: [
                              {
                                value: "10",
                                code: "length"
                              }
                            ]
                          },
                          {
                            name: "measurements",
                            code: "/measurements.width",
                            featureValues: [
                              {
                                value: "100",
                                code: "width"
                              }
                            ]
                          },
                          {
                            name: "measurements",
                            code: "/measurements.height",
                            featureValues: [
                              {
                                value: "50",
                                code: "height"
                              }
                            ]
                          },
                          {
                            name: "measurements",
                            code: "/measurements.thickness",
                            featureValues: [
                              {
                                value: "5",
                                code: "thickness"
                              }
                            ]
                          }
                        ]
                      }),
                      createClassification({
                        name: "appearance Attributes",
                        code: "appearanceAttributes",
                        features: [
                          {
                            name: "colour",
                            code: "/appearanceAttributes.colour",
                            featureValues: [
                              {
                                value: "red",
                                code: "colour"
                              }
                            ]
                          }
                        ]
                      })
                    ]
                  })
                ]
              })
            });
            const expectedResult = {
              scoringweight: { name: "scoringWeight Attributes" }
            };
            const result = findUniqueVariantClassifications(inputValue, "");
            expect(result).toEqual(expectedResult);
          });
        });
      });
    });
  });
  describe("findAllCategories tests", () => {
    describe("When list product is empty array", () => {
      it("returns empty object", () => {
        const result = findAllCategories([]);
        expect(result).toEqual({});
      });
    });
    describe("when list product is populated", () => {
      describe("And all products do NOT contain variant options", () => {
        it("returns empty object", () => {
          const result = findAllCategories([
            createBaseProduct(),
            createBaseProduct()
          ]);
          expect(result).toEqual({});
        });
      });
      describe("And some products contains variant options", () => {
        describe("And products has valid categories", () => {
          it("returns category map object", () => {
            const inputValue = [
              createBaseProduct({
                categories: [
                  createCategory({
                    categoryType: "Category",
                    code: "category-z",
                    name: "category-z",
                    parentCategoryCode: ""
                  }),
                  createCategory({
                    categoryType: "Category",
                    code: "category-1",
                    name: "category-1",
                    parentCategoryCode: "category-z"
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
                    code: "category-aa",
                    name: "category-aa",
                    parentCategoryCode: "category-a"
                  })
                ],
                variantOptions: [createVariantOption()]
              }),
              createBaseProduct()
            ];
            const expectedResult = {
              "category-z": {
                name: "category-z",
                values: [
                  {
                    name: "category-1",
                    categoryType: "Category",
                    code: "category-1",
                    parentCategoryCode: "category-z"
                  }
                ]
              },
              "category-a": {
                name: "category-a",
                values: [
                  {
                    name: "category-aa",
                    categoryType: "Category",
                    code: "category-aa",
                    parentCategoryCode: "category-a"
                  }
                ]
              }
            };
            const result = findAllCategories(inputValue);
            expect(result).toEqual(expectedResult);
          });
        });

        describe("And products has NO valid categories", () => {
          it("returns category map object", () => {
            const inputValue = [
              createBaseProduct({
                categories: [],
                variantOptions: [createVariantOption()]
              }),
              createBaseProduct()
            ];
            const expectedResult = {};
            const result = findAllCategories(inputValue);
            expect(result).toEqual(expectedResult);
          });
        });
      });
    });
  });
  //very long function (getProductAttributes)!!
  //starting some initial tests but need to add more tests!!
  describe("getProductAttributes tests", () => {
    describe("when productClassifications is empty object", () => {
      it("returns minimum result", () => {
        const result = getProductAttributes(
          {},
          createBaseProduct(),
          "no",
          { size: "Size" },
          { path: "somepath" }
        );
        const expectedResult = [
          { name: undefined, type: "thumbnails", variants: [] },
          { name: undefined, type: "chips", variants: [] },
          { name: "Size", type: "chips", variants: [] }
        ];
        expect(result).toEqual(expectedResult);
      });
    });
    describe("when productClassifications is NOT empty object", () => {
      describe("And self product is a Product object", () => {
        describe("And color props are populated on classifications", () => {
          describe("And color is selected", () => {
            it("returns color prop as selected in result", () => {
              const productClassifications = {
                "product-code-1": {
                  colour: {
                    name: "colour",
                    value: { value: "red", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct({ code: "product-code-1" });
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                {
                  name: "colour",
                  type: "thumbnails",
                  variants: [{ label: "red", isSelected: true }]
                },
                { type: "chips", variants: [] },
                { name: "Size", type: "chips", variants: [] }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And color is NOT selected", () => {
            it("returns color prop result", () => {
              const productClassifications = {
                props: {
                  colour: {
                    name: "colour",
                    value: { value: "red", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct();
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                {
                  name: "colour",
                  type: "thumbnails",
                  variants: [{ label: "red", isSelected: null }]
                },
                { type: "chips", variants: [] },
                { name: "Size", type: "chips", variants: [] }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
        });
        describe("And measurements props are populated on classifications", () => {
          describe("And product measurements is selected", () => {
            it("returns measurements prop result", () => {
              const productClassifications = {
                "product-code-1": {
                  measurements: {
                    length: {
                      name: "length",
                      value: { value: { value: "10" }, unit: "mm" }
                    },
                    height: {
                      name: "height",
                      value: { value: { value: "20" }, unit: "mm" }
                    },
                    width: {
                      name: "width",
                      value: { value: { value: "30" }, unit: "mm" }
                    }
                  }
                }
              };
              const selfProduct = createBaseProduct({ code: "product-code-1" });
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                { type: "thumbnails", variants: [] },
                { type: "chips", variants: [] },
                {
                  name: "Size",
                  type: "chips",
                  variants: [{ label: "30x10x20mm", isSelected: true }]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And product measurements is not selected", () => {
            it("returns measurements prop result", () => {
              const productClassifications = {
                props: {
                  measurements: {
                    length: {
                      name: "length",
                      value: { value: { value: "10" }, unit: "mm" }
                    },
                    height: {
                      name: "height",
                      value: { value: { value: "20" }, unit: "mm" }
                    },
                    width: {
                      name: "width",
                      value: { value: { value: "30" }, unit: "mm" }
                    }
                  }
                }
              };
              const selfProduct = createBaseProduct();
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                { type: "thumbnails", variants: [] },
                { type: "chips", variants: [] },
                {
                  name: "Size",
                  type: "chips",
                  variants: [{ label: "30x10x20mm", isSelected: false }]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
        });
        describe("And texturefamily props are populated on classifications", () => {
          describe("And texturefamily is selected", () => {
            it("returns texturefamily prop as selected in result", () => {
              const productClassifications = {
                "product-code-1": {
                  texturefamily: {
                    name: "texturefamily",
                    value: { value: "smooth", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct({
                code: "product-code-1",
                classifications: [
                  createClassification({
                    name: "texturefamily",
                    code: "texturefamily"
                  })
                ]
              });
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                { type: "thumbnails", variants: [] },
                {
                  name: "texturefamily",
                  type: "chips",
                  variants: [{ label: "smooth", isSelected: true }]
                },
                { name: "Size", type: "chips", variants: [] }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And texturefamily is NOT selected", () => {
            it("returns texturefamily prop result", () => {
              const productClassifications = {
                props: {
                  colour: {
                    name: "texturefamily",
                    value: { value: "smooth", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct();
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                {
                  name: "texturefamily",
                  type: "thumbnails",
                  variants: [{ label: "smooth", isSelected: null }]
                },
                { type: "chips", variants: [] },
                { name: "Size", type: "chips", variants: [] }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
        });

        describe("And colourfamily props are populated on classifications", () => {
          describe("And colourfamily is selected", () => {
            it("returns colourfamily prop as selected in result", () => {
              const productClassifications = {
                "product-code-1": {
                  colourfamily: {
                    name: "colourfamily",
                    value: { value: "smooth", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct({
                code: "product-code-1",
                classifications: [
                  createClassification({
                    name: "colourfamily",
                    code: "colourfamily"
                  })
                ]
              });
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                { type: "thumbnails", variants: [] },
                { type: "chips", variants: [] },
                { name: "Size", type: "chips", variants: [] }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And colourfamily is NOT selected", () => {
            it("returns colourfamily prop result", () => {
              const productClassifications = {
                props: {
                  colour: {
                    name: "colourfamily",
                    value: { value: "smooth", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct();
              const result = getProductAttributes(
                productClassifications,
                selfProduct,
                "no",
                { size: "Size" },
                { path: "somepath" }
              );
              const expectedResult = [
                {
                  name: "colourfamily",
                  type: "thumbnails",
                  variants: [{ label: "smooth", isSelected: null }]
                },
                { type: "chips", variants: [] },
                { name: "Size", type: "chips", variants: [] }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
        });
      });
    });
  });
  describe("findMasterImageUrl tests", () => {
    describe("when master image asset exists", () => {
      it("returns master image url value", () => {
        const result = findMasterImageUrl([
          {
            realFileName:
              "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
            assetType: "NOT_MASTER_IMAGE",
            mime: "image/jpeg",
            url: "http://nowhere.com",
            allowedToDownload: true,
            containerId: "container_Zanda Arktis normalstein1.jpg",
            fileSize: 28390,
            name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
            format: "Product-Listing-Card-Large-Desktop"
          }
        ]);
        expect(result).toEqual(undefined);
      });
    });
    describe("when master image exists", () => {
      it("returns master image url value", () => {
        const result = findMasterImageUrl([
          {
            realFileName:
              "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
            assetType: "MASTER_IMAGE",
            mime: "image/jpeg",
            url: "http://nowhere.com",
            allowedToDownload: true,
            containerId: "container_Zanda Arktis normalstein1.jpg",
            fileSize: 28390,
            name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
            format: "Product-Listing-Card-Large-Desktop"
          }
        ]);
        expect(result).toEqual("http://nowhere.com");
      });
    });
  });
  describe("getColourThumbnailUrl tests", () => {
    describe("when master image exists", () => {
      it("returns master image url value", () => {
        const result = getColourThumbnailUrl([
          {
            realFileName:
              "Product-Color-Selector-Mobile_Zanda Arktis normalstein1.jpg",
            assetType: "NOT_MASTER_IMAGE",
            mime: "image/jpeg",
            url: "http://nowhere.com",
            allowedToDownload: true,
            containerId: "container_Zanda Arktis normalstein1.jpg",
            fileSize: 28390,
            name: "Product-Color-Selector-Mobile_Zanda Arktis normalstein1",
            format: "Product-Color-Selector-Mobile"
          }
        ]);
        expect(result).toEqual(undefined);
      });
    });
    describe("when master image asset exists", () => {
      it("returns master image url value", () => {
        const result = getColourThumbnailUrl([
          {
            realFileName:
              "Product-Color-Selector-Mobile_Zanda Arktis normalstein1.jpg",
            assetType: "MASTER_IMAGE",
            mime: "image/jpeg",
            url: "http://nowhere.com",
            allowedToDownload: true,
            containerId: "container_Zanda Arktis normalstein1.jpg",
            fileSize: 28390,
            name: "Product-Color-Selector-Mobile_Zanda Arktis normalstein1",
            format: "Product-Color-Selector-Mobile"
          }
        ]);
        expect(result).toEqual("http://nowhere.com");
      });
    });
  });
  describe("mapGalleryImages tests", () => {
    describe("when Gallery images are empty", () => {
      it("returns empty result", () => {
        const result = mapGalleryImages([]);
        expect(result).toEqual([]);
      });
    });
    describe("when master images are present", () => {
      it("returns master image result", () => {
        const inputData = [
          {
            realFileName:
              "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
            assetType: "GALLERY",
            mime: "image/jpeg",
            url: "http://nowhere.com",
            allowedToDownload: true,
            containerId: "container_Zanda Arktis normalstein1.jpg",
            fileSize: 28390,
            name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
            format: "Product-Listing-Card-Large-Desktop"
          },
          {
            realFileName:
              "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
            assetType: "GALLERY",
            mime: "image/jpeg",
            url: "http://nowhere.com",
            allowedToDownload: true,
            containerId: "container_Zanda Arktis normalstein1.jpg",
            fileSize: 28390,
            name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
            format: "Product-Hero-Small-Desktop-Tablet"
          },
          {
            realFileName:
              "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
            assetType: "GALLERY",
            mime: "image/jpeg",
            url: "http://nowhere.com",
            allowedToDownload: true,
            containerId: "container_Zanda Arktis normalstein1.jpg",
            fileSize: 28390,
            name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
            format: "Product-Color-Selector-Mobile"
          }
        ];
        const expectedResult = [
          {
            altText:
              "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
            mainSource: "http://nowhere.com",
            thumbnail: "http://nowhere.com"
          }
        ];
        const result = mapGalleryImages(inputData);
        expect(result).toEqual(expectedResult);
      });
    });
  });
  describe("groupProductsByCategory tests", () => {
    describe("When Product data is NOT provided", () => {
      it("returns empty object", () => {
        const result = groupProductsByCategory([]);
        expect(result).toEqual({});
      });
    });
    describe("When Product list is provided", () => {
      describe("And categories are null", () => {
        it("returns empty object", () => {
          const baseProduct = createBaseProduct({
            documents: [],
            classifications: [],
            categories: null,
            variantOptions: []
          });
          const inputData: Array<Product> = [baseProduct, baseProduct];
          const result = groupProductsByCategory(inputData);
          expect(result).toEqual({});
        });
      });
      describe("And categories are populated", () => {
        it("returns products grouped by categoies", () => {
          const baseProduct = createBaseProduct({
            documents: [],
            classifications: [],
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
              })
            ],
            variantOptions: []
          });

          const expectedResult = {
            "category-z": [
              {
                code: "product-code",
                externalProductCode: "external-product-code",
                name: "product-name",
                description: "product-description",
                images: [],
                assets: [],
                productBenefits: [],
                categories: [
                  {
                    name: "category-z",
                    categoryType: "Category",
                    code: "category-z",
                    parentCategoryCode: ""
                  },
                  {
                    name: "category-2",
                    categoryType: "Category",
                    code: "category-2",
                    parentCategoryCode: "category-z"
                  }
                ],
                classifications: [],
                variantOptions: [],
                documents: [],
                breadcrumbs: null
              },
              {
                code: "product-code",
                externalProductCode: "external-product-code",
                name: "product-name",
                description: "product-description",
                images: [],
                assets: [],
                productBenefits: [],
                categories: [
                  {
                    name: "category-z",
                    categoryType: "Category",
                    code: "category-z",
                    parentCategoryCode: ""
                  },
                  {
                    name: "category-2",
                    categoryType: "Category",
                    code: "category-2",
                    parentCategoryCode: "category-z"
                  }
                ],
                classifications: [],
                variantOptions: [],
                documents: [],
                breadcrumbs: null
              }
            ]
          };
          const inputData: Array<Product> = [baseProduct, baseProduct];
          const result = groupProductsByCategory(inputData);
          expect(result).toEqual(expectedResult);
        });
      });
    });
  });
  describe("mapClassificationValues tests", () => {
    describe("When classifiction map is empty object", () => {
      it("returns empty string", () => {
        const result = mapClassificationValues({});
        expect(result).toEqual("");
      });
    });
    describe("When classifiction map is unexpected keys", () => {
      it("returns empty string", () => {
        const inputValue: TransformedClassificationsMap = {
          notRecognised: {
            name: "not_recognised",
            value: { value: "test", code: "test" }
          }
        };
        const result = mapClassificationValues(inputValue);
        expect(result).toEqual("");
      });
    });
    describe("When classifiction map is exptected keys", () => {
      describe("And measurement Classification is provided", () => {
        it("returns value for measurements", () => {
          const measurementValue: TransformedMeasurementValue = {
            length: {
              name: "length",
              value: { value: { value: "10" }, unit: "mm" }
            },
            height: {
              name: "height",
              value: { value: { value: "20" }, unit: "mm" }
            },
            width: {
              name: "width",
              value: { value: { value: "30" }, unit: "mm" }
            }
          };

          const inputValue: TransformedClassificationsMap = {
            measurements: measurementValue
          };
          const result = mapClassificationValues(inputValue);
          expect(result).toEqual("30x10x20mm");
        });
      });
      describe("And colour Classification is provided", () => {
        describe("And colour value is n/a", () => {
          it("returns n/a for colour", () => {
            const colourValue: TransformedClassificationValue = {
              name: "colour",
              value: "n/a"
            };

            const inputValue: TransformedClassificationsMap = {
              colour: colourValue
            };
            const result = mapClassificationValues(inputValue);
            expect(result).toEqual("n/a");
          });
        });
        describe("And colour value is object is provided", () => {
          it("returns value for colour", () => {
            const colourValue: TransformedClassificationValue = {
              name: "colour",
              value: { value: "red", code: "code" }
            };

            const inputValue: TransformedClassificationsMap = {
              colour: colourValue
            };
            const result = mapClassificationValues(inputValue);
            expect(result).toEqual("red");
          });
        });
      });
      describe("And texturefamily Classification is provided", () => {
        describe("And texturefamily value is n/a", () => {
          it("returns n/a for texturefamily", () => {
            const measurementValue: TransformedClassificationValue = {
              name: "texturefamily",
              value: "n/a"
            };

            const inputValue: TransformedClassificationsMap = {
              texturefamily: measurementValue
            };
            const result = mapClassificationValues(inputValue);
            expect(result).toEqual("n/a");
          });
        });
        describe("And colour value is an object", () => {
          it("returns value for texturefamily", () => {
            const measurementValue: TransformedClassificationValue = {
              name: "texturefamily",
              value: { value: "smooth", code: "code" }
            };

            const inputValue: TransformedClassificationsMap = {
              texturefamily: measurementValue
            };
            const result = mapClassificationValues(inputValue);
            expect(result).toEqual("smooth");
          });
        });
      });
    });
  });
  describe("findProductBrandLogoCode tests", () => {
    describe("When Product with BMI Brands is NOT provided", () => {
      it("returns brand logo code", () => {
        const result = findProductBrandLogoCode(
          createBaseProduct({
            categories: [
              createCategory({
                code: "ICOPAL",
                parentCategoryCode: "NOT_BMI_BRANDS_CATEGORY"
              })
            ]
          })
        );
        expect(result).toEqual(undefined);
      });
    });
    describe("When Product with BMI Brands is provided", () => {
      it("returns brand logo code", () => {
        const result = findProductBrandLogoCode(
          createBaseProduct({
            categories: [
              createCategory({
                code: "ICOPAL",
                parentCategoryCode: "BMI_Brands"
              })
            ]
          })
        );
        expect(result).toEqual("ICOPAL");
      });
    });
  });
  describe("getMergedClassifications tests", () => {
    describe("When emtpy classifications are provided", () => {
      it("returns empty results", () => {
        const result = getMergedClassifications(
          "",
          createBaseProduct({ classifications: undefined }),
          createBaseProduct({ classifications: undefined })
        );
        expect(result).toEqual([]);
      });
    });
    describe("When classifications on self product and parent prodcut then", () => {
      it("returns merged classifications results", () => {
        const expectedResult = [
          {
            name: "classification-name",
            code: "classification-code",
            features: [
              {
                name: "classification-feature-name",
                code: "classification-feature-code",
                featureValues: [
                  {
                    value: "classification-feature-feature-value-value",
                    code: "classification-feature-feature-value-code"
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
            name: "classification-name",
            code: "product-code-1",
            features: [
              {
                name: "classification-feature-name",
                code: "classification-feature-code",
                featureValues: [
                  {
                    value: "classification-feature-feature-value-value",
                    code: "classification-feature-feature-value-code"
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
        ];
        const result = getMergedClassifications(
          "",
          createBaseProduct(),
          createBaseProduct({
            classifications: [createClassification({ code: "product-code-1" })]
          })
        );
        expect(result).toEqual(expectedResult);
      });
    });
  });
  describe("getValidClassification tests", () => {
    describe("When emtpy classifications are provided", () => {
      it("returns empty results", () => {
        const result = getValidClassification("", []);
        expect(result).toEqual([]);
      });
    });
    describe("When Classifications with ONLY ignored attributes are provided", () => {
      it("removes ignored classifications", () => {
        const classification1 = createClassification({
          features: [
            createFeature({
              code: "/scoringWeightAttributes.scoringweight",
              name: "scoringweight"
            })
          ]
        });
        const classification2 = createClassification({
          features: [
            createFeature({
              code: "/appearanceAttributes.colourfamily",
              name: "colourfamily"
            })
          ]
        });
        const result = getValidClassification("", [
          classification1,
          classification2
        ]);
        expect(result).toEqual([]);
      });
    });
    describe("When Classifications with mixed ignored attributes are provided", () => {
      it("returns valid classifications", () => {
        const classification1 = createClassification({
          features: [
            createFeature({
              code: "/scoringWeightAttributes.scoringweight",
              name: "scoringweight"
            })
          ]
        });
        const classification2 = createClassification({
          features: [
            createFeature({
              code: "/appearanceAttributes.colourfamily",
              name: "colourfamily"
            })
          ]
        });
        const classification3 = createClassification({
          features: [
            createFeature({
              code: "/appearanceAttributes.weight",
              name: "weight"
            })
          ]
        });
        const result = getValidClassification("", [
          classification1,
          classification2,
          classification3
        ]);
        expect(result).toEqual([classification3]);
      });
    });
  });
  describe("getValidFeatures tests", () => {
    describe("When emtpy features are provided", () => {
      it("returns empty results", () => {
        const result = getValidFeatures("", []);
        expect(result).toEqual([]);
      });
    });

    describe("When features with ONLY ignored attributes are provided", () => {
      it("removes ignored features", () => {
        const feature1 = createFeature({
          code: "/scoringWeightAttributes.scoringweight",
          name: "scoringweight"
        });
        const feature2 = createFeature({
          code: "/appearanceAttributes.colourfamily",
          name: "colourfamily"
        });
        const result = getValidFeatures("", [feature1, feature2]);
        expect(result).toEqual([]);
      });
    });

    describe("When features with mixed ignored attributes are provided", () => {
      it("returns valid features", () => {
        const feature1 = createFeature({
          code: "/scoringWeightAttributes.scoringweight",
          name: "scoringweight"
        });
        const feature2 = createFeature({
          code: "/appearanceAttributes.colourfamily",
          name: "colourfamily"
        });
        const feature3 = createFeature({
          code: "/appearanceAttributes.weight",
          name: "weight"
        });
        const result = getValidFeatures("", [feature1, feature2, feature3]);
        expect(result).toEqual([feature3]);
      });
    });
  });
});
