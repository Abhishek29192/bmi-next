import { Link } from "gatsby";
import {
  findAllCategories,
  findMasterImageUrl,
  findProductBrandLogoCode,
  findUniqueVariantClassifications,
  getColourThumbnailUrl,
  getMergedClassifications,
  getProductAttributes,
  getProductUrl,
  getSizeLabel,
  getValidClassification,
  getValidFeatures,
  groupProductsByCategory,
  mapClassificationValues,
  mapGalleryImages,
  mapProductClassifications,
  TransformedClassificationsMap,
  TransformedClassificationValue,
  TransformedMeasurementValue
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
import {
  ClassificationCodeEnum,
  ImageAssetTypesEnum,
  Product,
  Image
} from "../../components/types/pim";

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
          const result = getSizeLabel({}, false);
          expect(result).toEqual("");
        });
      });
      describe("And withUnit is true", () => {
        it("returns null", () => {
          const result = getSizeLabel({}, true);
          expect(result).toEqual("");
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
            expect(result).toEqual("10x20x30");
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
            expect(result).toEqual("10in x 20cm x 30mm");
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
            expect(result).toEqual("10x20x30mm");
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
            expect(result).toEqual("10in x 20cm x 30mm");
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
                name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
                code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
                features: [
                  {
                    name: "scoringweight",
                    code: "/scoringWeightAttributes.scoringweight",
                    featureValues: []
                  }
                ]
              }),
              createClassification({
                name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
                name: ClassificationCodeEnum.GENERAL_INFORMATION,
                code: ClassificationCodeEnum.GENERAL_INFORMATION,
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
            "variant-code": {
              scoringweight: {
                name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
              },
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
                  name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
                  code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
                  features: [
                    {
                      name: "scoringweight",
                      code: "/scoringWeightAttributes.scoringweight",
                      featureValues: []
                    }
                  ]
                }),
                createClassification({
                  name: ClassificationCodeEnum.MEASUREMENTS,
                  code: ClassificationCodeEnum.MEASUREMENTS,
                  features: [
                    {
                      name: ClassificationCodeEnum.MEASUREMENTS,
                      code: "/measurements.length",
                      featureValues: [
                        {
                          value: "10",
                          code: "length"
                        }
                      ]
                    },
                    {
                      name: ClassificationCodeEnum.MEASUREMENTS,
                      code: "/measurements.width",
                      featureValues: [
                        {
                          value: "100",
                          code: "width"
                        }
                      ]
                    },
                    {
                      name: ClassificationCodeEnum.MEASUREMENTS,
                      code: "/measurements.height",
                      featureValues: [
                        {
                          value: "50",
                          code: "height"
                        }
                      ]
                    },
                    {
                      name: ClassificationCodeEnum.MEASUREMENTS,
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
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
                  name: ClassificationCodeEnum.GENERAL_INFORMATION,
                  code: ClassificationCodeEnum.GENERAL_INFORMATION,
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
            "variant-code": {
              scoringweight: {
                name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
              },
              measurements: {
                length: {
                  name: ClassificationCodeEnum.MEASUREMENTS,
                  value: { value: { value: "10", code: "length" } }
                },
                width: {
                  name: ClassificationCodeEnum.MEASUREMENTS,
                  value: { value: { value: "100", code: "width" } }
                },
                height: {
                  name: ClassificationCodeEnum.MEASUREMENTS,
                  value: { value: { value: "50", code: "height" } }
                },
                thickness: {
                  name: ClassificationCodeEnum.MEASUREMENTS,
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
                        name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
                        code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
                        name: ClassificationCodeEnum.MEASUREMENTS,
                        code: ClassificationCodeEnum.MEASUREMENTS,
                        features: [
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
                            code: "/measurements.length",
                            featureValues: [
                              {
                                value: "10",
                                code: "length"
                              }
                            ]
                          },
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
                            code: "/measurements.width",
                            featureValues: [
                              {
                                value: "100",
                                code: "width"
                              }
                            ]
                          },
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
                            code: "/measurements.height",
                            featureValues: [
                              {
                                value: "50",
                                code: "height"
                              }
                            ]
                          },
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
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
                        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
                name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
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
                        name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
                        code: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES,
                        features: [
                          {
                            name: "scoringweight",
                            code: "/scoringWeightAttributes.scoringweight",
                            featureValues: []
                          }
                        ]
                      }),
                      createClassification({
                        name: ClassificationCodeEnum.MEASUREMENTS,
                        code: ClassificationCodeEnum.MEASUREMENTS,
                        features: [
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
                            code: "/measurements.length",
                            featureValues: [
                              {
                                value: "10",
                                code: "length"
                              }
                            ]
                          },
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
                            code: "/measurements.width",
                            featureValues: [
                              {
                                value: "100",
                                code: "width"
                              }
                            ]
                          },
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
                            code: "/measurements.height",
                            featureValues: [
                              {
                                value: "50",
                                code: "height"
                              }
                            ]
                          },
                          {
                            name: ClassificationCodeEnum.MEASUREMENTS,
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
                        name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                        code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
                name: ClassificationCodeEnum.SCORING_WEIGHT_ATTRIBUTES
              }
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
    const getProductAttributesWithCommonParams = (
      productClassifications,
      selfProduct,
      variantCodeToPathMap
    ) =>
      getProductAttributes(
        productClassifications,
        selfProduct,
        "no",
        { size: "Size", variantattribute: "variantattribute" },
        variantCodeToPathMap || { "product-code-1": "somepath" },
        {
          color: "unavaialbeMicroCopy",
          size: "unavaialbeMicroCopy 2",
          variantattribute: "unavaialbeMicroCopy 3",
          texturefamily: "unavaialbeMicroCopy 4"
        }
      );
    const action = {
      linkComponent: Link,
      model: "routerLink",
      to: "/no/somepath"
    };
    describe("when productClassifications is empty object", () => {
      it("returns minimum result", () => {
        const result = getProductAttributesWithCommonParams(
          {},
          createBaseProduct(),
          null
        );
        const expectedResult = [
          {
            name: undefined,
            type: "thumbnails",
            unavailableMicroCopy: "unavaialbeMicroCopy",
            variants: []
          },
          {
            name: undefined,
            type: "chips",
            unavailableMicroCopy: "unavaialbeMicroCopy 4",
            variants: []
          },
          {
            name: "Size",
            type: "chips",
            unavailableMicroCopy: "unavaialbeMicroCopy 2",
            variants: []
          },
          {
            name: "variantattribute",
            type: "chips",
            unavailableMicroCopy: "unavaialbeMicroCopy 3",
            variants: []
          }
        ];
        expect(result).toEqual(expectedResult);
      });
    });
    describe("when productClassifications is NOT empty object", () => {
      describe("And self product is a Product object", () => {
        describe("And should return availability corretly", () => {
          it("for colour", () => {
            const productClassifications = {
              "product-code-1": {
                colour: {
                  name: "colour",
                  value: { value: "red" }
                },
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "smooth", code: "code2" }
                }
              },
              "product-code-2": {
                colour: {
                  name: "colour",
                  value: { value: "black" }
                },
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "unsmooth", code: "code4" }
                }
              },
              "product-code-3": {
                colour: {
                  name: "colour",
                  value: { value: "red" }
                },
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "unsmooth", code: "code4" }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath",
                "product-code-3": "somepath"
              }
            );
            const expectedResult = [
              {
                name: "colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: [
                  {
                    label: "black",
                    isSelected: false,
                    availability: false,
                    action
                  },
                  { label: "red", isSelected: true, availability: true }
                ]
              },
              {
                name: "texturefamily",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: [
                  { label: "smooth", isSelected: true, availability: true },
                  {
                    label: "unsmooth",
                    isSelected: false,
                    availability: true,
                    action
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: []
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: []
              }
            ];
            expect(result).toEqual(expectedResult);
          });
          it("for 1 hierarchy", () => {
            const productClassifications = {
              "product-code-1": {
                colour: {
                  name: "colour",
                  value: { value: "red" }
                },
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
              },
              "product-code-2": {
                colour: {
                  name: "colour",
                  value: { value: "black" }
                },
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
                    value: { value: { value: "40" }, unit: "mm" }
                  }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath"
              }
            );
            const expectedResult = [
              {
                name: "colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: [
                  {
                    label: "black",
                    isSelected: false,
                    availability: false,
                    action
                  },
                  { label: "red", isSelected: true, availability: true }
                ]
              },
              {
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: []
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: [
                  { label: "10x20x30mm", isSelected: true, availability: true },
                  {
                    label: "10x20x40mm",
                    isSelected: false,
                    availability: false,
                    action
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: []
              }
            ];
            expect(result).toEqual(expectedResult);
          });
          it("for 2 hierarchies", () => {
            const productClassifications = {
              "product-code-1": {
                colour: {
                  name: "colour",
                  value: { value: "red" }
                },
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "smooth", code: "code4" }
                },
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
              },
              "product-code-2": {
                colour: {
                  name: "colour",
                  value: { value: "black" }
                },
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "smooth", code: "code4" }
                },
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
                    value: { value: { value: "40" }, unit: "mm" }
                  }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath"
              }
            );
            const expectedResult = [
              {
                name: "colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: [
                  {
                    label: "black",
                    isSelected: false,
                    availability: false,
                    action
                  },
                  { label: "red", isSelected: true, availability: true }
                ]
              },
              {
                name: "texturefamily",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: [
                  { label: "smooth", isSelected: true, availability: true }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: [
                  { label: "10x20x30mm", isSelected: true, availability: true },
                  {
                    label: "10x20x40mm",
                    isSelected: false,
                    availability: false,
                    action
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: []
              }
            ];
            expect(result).toEqual(expectedResult);
          });
          it("for 3 hierarchies", () => {
            const productClassifications = {
              "product-code-1": {
                colour: {
                  name: "colour",
                  value: { value: "red" }
                },
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "smooth", code: "code4" }
                },
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
                },
                variantattribute: {
                  name: "variantattribute",
                  value: { value: "14 kg Eimer" }
                }
              },
              "product-code-2": {
                colour: {
                  name: "colour",
                  value: { value: "black" }
                },
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "smooth", code: "code4" }
                },
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
                },
                variantattribute: {
                  name: "variantattribute",
                  value: { value: "14 kg Eimer 2" }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath"
              }
            );
            const expectedResult = [
              {
                name: "colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: [
                  {
                    label: "black",
                    isSelected: false,
                    availability: false,
                    action
                  },
                  { label: "red", isSelected: true, availability: true }
                ]
              },
              {
                name: "texturefamily",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: [
                  { label: "smooth", isSelected: true, availability: true }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: [
                  { label: "10x20x30mm", isSelected: true, availability: true }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: [
                  {
                    label: "14 kg Eimer",
                    isSelected: true,
                    availability: true
                  },
                  {
                    label: "14 kg Eimer 2",
                    isSelected: false,
                    availability: false,
                    action
                  }
                ]
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });
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
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  name: "colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: [
                    { label: "red", isSelected: true, availability: true }
                  ]
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And color is NOT selected", () => {
            it("returns color prop result", () => {
              const productClassifications = {
                "product-code-1": {
                  colour: {
                    name: "colour",
                    value: { value: "red", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct();
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  name: "colour",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: [
                    { label: "red", isSelected: null, availability: true }
                  ]
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const productClassifications = {
              "product-code-1": {
                colour: {
                  name: "colour",
                  value: { value: "red", code: "code" }
                }
              },
              "product-code-2": {
                colour: {
                  name: "colour",
                  value: { value: "black", code: "code2" }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              { "product-code-1": "somepath", "product-code-2": "somepath" }
            );
            const expectedResult = [
              {
                name: "colour",
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: [
                  {
                    label: "black",
                    isSelected: false,
                    availability: true,
                    action
                  },
                  {
                    label: "red",
                    isSelected: true,
                    availability: true
                  }
                ]
              },
              {
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: []
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: []
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: []
              }
            ];
            expect(result).toEqual(expectedResult);
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
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: []
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: [
                    {
                      label: "10x20x30mm",
                      isSelected: true,
                      availability: true
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
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
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: []
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: [
                    {
                      label: "10x20x30mm",
                      isSelected: false,
                      availability: false
                    }
                  ]
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const productClassifications = {
              "product-code-1": {
                measurements: {
                  length: {
                    name: "length",
                    value: { value: { value: "10" }, unit: "mm" }
                  },
                  height: {
                    name: "height",
                    value: { value: { value: "10" }, unit: "mm" }
                  }
                }
              },
              "product-code-2": {
                measurements: {
                  length: {
                    name: "length",
                    value: { value: { value: "10" }, unit: "mm" }
                  },
                  height: {
                    name: "height",
                    value: { value: { value: "20" }, unit: "mm" }
                  }
                }
              },
              "product-code-3": {
                measurements: {
                  length: {
                    name: "length",
                    value: { value: { value: "5" }, unit: "mm" }
                  },
                  height: {
                    name: "height",
                    value: { value: { value: "30" }, unit: "mm" }
                  }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath",
                "product-code-3": "somepath"
              }
            );
            const expectedResult = [
              {
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: []
              },
              {
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: []
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: [
                  {
                    label: "5x30mm",
                    isSelected: false,
                    availability: true,
                    action
                  },
                  {
                    label: "10x10mm",
                    isSelected: true,
                    availability: true
                  },
                  {
                    label: "10x20mm",
                    isSelected: false,
                    availability: true,
                    action
                  }
                ]
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: []
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });
        describe("And texturefamily props are populated on classifications", () => {
          describe("And texturefamily is selected", () => {
            it("returns texturefamily prop as selected in result", () => {
              const productClassifications = {
                "product-code-1": {
                  texturefamily: {
                    name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                    value: { value: "smooth", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct({
                code: "product-code-1",
                classifications: [
                  createClassification({
                    name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                    code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE
                  })
                ]
              });
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: []
                },
                {
                  name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: [
                    { label: "smooth", isSelected: true, availability: true }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And texturefamily is NOT selected", () => {
            it("returns texturefamily prop result", () => {
              const productClassifications = {
                "product-code-1": {
                  texturefamily: {
                    name: "texturefamily",
                    value: { value: "smooth", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct();
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: []
                },
                {
                  name: "texturefamily",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: [
                    {
                      label: "smooth",
                      isSelected: null,
                      availability: true
                    }
                  ]
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const productClassifications = {
              "product-code-1": {
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "unsmooth", code: "code" }
                }
              },
              "product-code-2": {
                texturefamily: {
                  name: "texturefamily",
                  value: { value: "smooth", code: "code2" }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath"
              }
            );
            const expectedResult = [
              {
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: []
              },
              {
                name: "texturefamily",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: [
                  {
                    label: "smooth",
                    isSelected: false,
                    availability: true,
                    action
                  },
                  {
                    label: "unsmooth",
                    isSelected: true,
                    availability: true
                  }
                ]
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: []
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: []
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });

        describe("And colourfamily props are populated on classifications", () => {
          describe("And colourfamily is selected", () => {
            it("returns colourfamily prop as selected in result", () => {
              const productClassifications = {
                "product-code-1": {
                  colourfamily: {
                    name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                    value: { value: "smooth", code: "code" }
                  }
                }
              };
              const selfProduct = createBaseProduct({
                code: "product-code-1",
                classifications: [
                  createClassification({
                    name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
                    code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE
                  })
                ]
              });
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: []
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
                }
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
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  name: "colourfamily",
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: [
                    { label: "smooth", isSelected: null, availability: true }
                  ]
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: []
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const productClassifications = {
              "product-code-1": {
                colour: {
                  name: "colourfamily",
                  value: { value: "unsmooth", code: "code" }
                }
              },
              "product-code-2": {
                colour: {
                  name: "colourfamily",
                  value: { value: "smooth", code: "code2" }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath"
              }
            );
            const expectedResult = [
              {
                name: "colourfamily",
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: [
                  {
                    label: "smooth",
                    isSelected: false,
                    availability: true,
                    action
                  },
                  {
                    label: "unsmooth",
                    isSelected: true,
                    availability: true
                  }
                ]
              },
              {
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: []
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: []
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: []
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });

        describe("And variantattribute props are populated on classifications", () => {
          const productClassifications = {
            "product-code-1": {
              variantattribute: {
                name: "variantattribute",
                value: { value: "14 kg Eimer", code: "code" }
              }
            }
          };
          describe("And product variantattribute is selected", () => {
            it("returns variantattribute prop result", () => {
              const selfProduct = createBaseProduct({ code: "product-code-1" });
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: []
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: [
                    {
                      label: "14 kg Eimer",
                      isSelected: true,
                      availability: true
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          describe("And product variantattribute is not selected", () => {
            it("returns variantattribute prop result", () => {
              const selfProduct = createBaseProduct();
              const result = getProductAttributesWithCommonParams(
                productClassifications,
                selfProduct,
                null
              );
              const expectedResult = [
                {
                  type: "thumbnails",
                  unavailableMicroCopy: "unavaialbeMicroCopy",
                  variants: []
                },
                {
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 4",
                  variants: []
                },
                {
                  name: "Size",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 2",
                  variants: []
                },
                {
                  name: "variantattribute",
                  type: "chips",
                  unavailableMicroCopy: "unavaialbeMicroCopy 3",
                  variants: [
                    {
                      label: "14 kg Eimer",
                      isSelected: false,
                      availability: true
                    }
                  ]
                }
              ];
              expect(result).toEqual(expectedResult);
            });
          });
          it("returns sorted Product Attributes", () => {
            const productClassifications = {
              "product-code-1": {
                variantattribute: {
                  name: "variantattribute",
                  value: { value: "Glossy", code: "code" }
                }
              },
              "product-code-2": {
                variantattribute: {
                  name: "variantattribute",
                  value: { value: "Fine Mineral Granules", code: "code2" }
                }
              }
            };
            const selfProduct = createBaseProduct({ code: "product-code-1" });
            const result = getProductAttributesWithCommonParams(
              productClassifications,
              selfProduct,
              {
                "product-code-1": "somepath",
                "product-code-2": "somepath"
              }
            );
            const expectedResult = [
              {
                type: "thumbnails",
                unavailableMicroCopy: "unavaialbeMicroCopy",
                variants: []
              },
              {
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 4",
                variants: []
              },
              {
                name: "Size",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 2",
                variants: []
              },
              {
                name: "variantattribute",
                type: "chips",
                unavailableMicroCopy: "unavaialbeMicroCopy 3",
                variants: [
                  {
                    label: "Fine Mineral Granules",
                    isSelected: false,
                    availability: true,
                    action
                  },
                  {
                    label: "Glossy",
                    isSelected: true,
                    availability: true
                  }
                ]
              }
            ];
            expect(result).toEqual(expectedResult);
          });
        });
      });
    });
  });
  describe("findMasterImageUrl tests", () => {
    it("returns undefined if null provided", () => {
      const result = findMasterImageUrl(null);
      expect(result).toEqual(undefined);
    });
    it("returns undefined when master image does not exist", () => {
      const result = findMasterImageUrl([
        {
          realFileName:
            "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
          assetType: ImageAssetTypesEnum.GALLERY,
          mime: "image/jpeg",
          url: "http://nowhere.com",
          allowedToDownload: true,
          containerId: "container_Zanda Arktis normalstein1.jpg",
          fileSize: 28390,
          name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
          format: "Product-Listing-Card-Small-Desktop-Tablet"
        }
      ]);
      expect(result).toEqual(undefined);
    });
    it("returns master image URL when when master image exists", () => {
      const result = findMasterImageUrl([
        {
          realFileName:
            "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
          assetType: ImageAssetTypesEnum.MASTER_IMAGE,
          mime: "image/jpeg",
          url: "http://nowhere.com",
          allowedToDownload: true,
          containerId: "container_Zanda Arktis normalstein1.jpg",
          fileSize: 28390,
          name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
          format: "Product-Listing-Card-Small-Desktop-Tablet"
        }
      ]);
      expect(result).toEqual("http://nowhere.com");
    });
    it("returns small-desktop-tablet format when master image exists", () => {
      const result = findMasterImageUrl([
        {
          realFileName:
            "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
          assetType: ImageAssetTypesEnum.MASTER_IMAGE,
          mime: "image/jpeg",
          url: "http://product-listing-card-large-desktop.com",
          allowedToDownload: true,
          containerId: "container_Zanda Arktis normalstein1.jpg",
          fileSize: 28390,
          name: "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1",
          format: "Product-Listing-Card-Large-Desktop"
        },
        {
          realFileName:
            "Product-Listing-Card-Small-Desktop-Tablet_Zanda Arktis normalstein1.jpg",
          assetType: ImageAssetTypesEnum.MASTER_IMAGE,
          mime: "image/jpeg",
          url: "http://product-listing-card-small-desktop-tablet.com",
          allowedToDownload: true,
          containerId: "container_Zanda Arktis normalstein1.jpg",
          fileSize: 28390,
          name: "Product-Listing-Card-Small-Desktop-Tablet_Zanda Arktis normalstein1",
          format: "Product-Listing-Card-Small-Desktop-Tablet"
        }
      ]);
      expect(result).toEqual(
        "http://product-listing-card-small-desktop-tablet.com"
      );
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
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
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
      describe("And some images format is null", () => {
        it("returns master image with format only", () => {
          const inputData: Image[] = [
            {
              realFileName: "Turmalin-monestein-Turmalin-monestein.jpg",
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              mime: "image/jpeg",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h0c/h7b/8796944990238/Turmalin-monestein-Turmalin-monestein.jpg",
              allowedToDownload: true,
              containerId:
                "Container_for_00002817_297006141_Turmalin_ridge_tile_engobed_black_Turmalin-monestein-Turmalin-monestein.jpg",
              fileSize: 36723,
              name: "Turmalin-monestein-Turmalin-monestein",
              format: null
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 30668,
              name: "297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h0f/h4f/8805394972702/297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-grey.jpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: null
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 56614,
              name: "Web_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h60/hb8/9003278794782/Web-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Web_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Web"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 58265,
              name: "Print_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h71/hbb/9003278860318/Print-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greytiff",
              containerId: "container_Mønestein turmalin",
              mime: "image/tiff",
              realFileName:
                "Print_297006251_Turmalin Ridge tile K Glazed Zeder grey.tiff",
              format: "Print"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 23116,
              name: "Product-Color-Selector-Mobile_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h13/ha7/9003278270494/Product-Color-Selector-Mobile-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Color-Selector-Mobile_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Color-Selector-Mobile"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 59645,
              name: "Product-Hero-Large-Desktop_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h52/ha6/9003278204958/Product-Hero-Large-Desktop-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Hero-Large-Desktop_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Hero-Large-Desktop"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 27196,
              name: "Product-Listing-Card-Large-Desktop_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h11/haa/9003278336030/Product-Listing-Card-Large-Desktop-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Listing-Card-Large-Desktop_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Listing-Card-Large-Desktop"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 39516,
              name: "Product-Hero-Small-Desktop-Tablet_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h22/had/9003278401566/Product-Hero-Small-Desktop-Tablet-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Hero-Small-Desktop-Tablet_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Hero-Small-Desktop-Tablet"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 36171,
              name: "Product-Color-Selector-Large-Desktop_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/he1/hb0/9003278532638/Product-Color-Selector-Large-Desktop-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Color-Selector-Large-Desktop_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Color-Selector-Large-Desktop"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 27688,
              name: "Product-Hero-Mobile_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/hd0/had/9003278467102/Product-Hero-Mobile-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Hero-Mobile_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Hero-Mobile"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 21808,
              name: "Product-Listing-Card-Mobile_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h9f/hb7/9003278729246/Product-Listing-Card-Mobile-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Listing-Card-Mobile_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Listing-Card-Mobile"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 27688,
              name: "Product-Color-Selector-Small-Desktop-Tablet_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h90/hb1/9003278598174/Product-Color-Selector-Small-Desktop-Tablet-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Color-Selector-Small-Desktop-Tablet_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Color-Selector-Small-Desktop-Tablet"
            },
            {
              allowedToDownload: true,
              assetType: ImageAssetTypesEnum.MASTER_IMAGE,
              fileSize: 21312,
              name: "Product-Listing-Card-Small-Desktop-Tablet_297006251_Turmalin Ridge tile K Glazed Zeder grey",
              url: "https://bmipimngqa.azureedge.net/sys-master-hybris-media/ha0/hb4/9003278663710/Product-Listing-Card-Small-Desktop-Tablet-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              containerId: "container_Mønestein turmalin",
              mime: "image/jpeg",
              realFileName:
                "Product-Listing-Card-Small-Desktop-Tablet_297006251_Turmalin Ridge tile K Glazed Zeder grey.jpg",
              format: "Product-Listing-Card-Small-Desktop-Tablet"
            }
          ];
          const expectedResult = [
            {
              altText: "297006251_Turmalin Ridge tile K Glazed Zeder grey",
              mainSource:
                "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h22/had/9003278401566/Product-Hero-Small-Desktop-Tablet-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg",
              thumbnail:
                "https://bmipimngqa.azureedge.net/sys-master-hybris-media/h13/ha7/9003278270494/Product-Color-Selector-Mobile-297006251-Turmalin-Ridge-tile-K-Glazed-Zeder-greyjpg"
            }
          ];
          const result = mapGalleryImages(inputData);
          expect(result).toEqual(expectedResult);
        });
      });
      describe("And All images have format specified", () => {
        it("returns master image result", () => {
          const inputData: Image[] = [
            {
              realFileName:
                "Product-Listing-Card-Large-Desktop_Zanda Arktis normalstein1.jpg",
              assetType: ImageAssetTypesEnum.GALLERY,
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
              assetType: ImageAssetTypesEnum.GALLERY,
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
              assetType: ImageAssetTypesEnum.GALLERY,
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
        it("returns products grouped by categories", () => {
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
            "category-z": [baseProduct, baseProduct]
          };
          const inputData: Array<Product> = [baseProduct, baseProduct];
          const result = groupProductsByCategory(inputData);
          expect(result).toEqual(expectedResult);
        });
      });
    });
    describe("And are populated without correctly formed category tree", () => {
      it("returns empty object", () => {
        const baseProduct = createBaseProduct({
          documents: [],
          classifications: [],
          categories: [
            createCategory({
              categoryType: "Category",
              code: "category-z",
              name: "category-z",
              parentCategoryCode: ""
            })
          ],
          variantOptions: []
        });

        const expectedResult = {};
        const inputData: Array<Product> = [baseProduct, baseProduct];
        const result = groupProductsByCategory(inputData);
        expect(result).toEqual(expectedResult);
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
          expect(result).toEqual("10x20x30mm");
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
                categoryType: "Brands"
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
            name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
            name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            code: ClassificationCodeEnum.MEASUREMENTS,
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
            classifications: [
              createClassification({
                code: ClassificationCodeEnum.MEASUREMENTS
              })
            ]
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
