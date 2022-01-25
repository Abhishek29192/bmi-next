import mockConsole from "jest-mock-console";
import {
  Product,
  createAppearanceAttributesClassification,
  createFeature,
  createFeatureValue,
  createGeneralInformationClassification,
  createMeasurementsClassification,
  createScoringWeightAttributesClassification,
  createVariantOption,
  createProduct as createPimProduct,
  createCategory
} from "@bmi/pim-types";
import { ProductVariant } from "../es-model";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

const transformProduct = (product: Partial<Product>): ProductVariant[] =>
  require("../transformProducts").transformProduct(product as Product);

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

const getDynamicPropValue = (obj: any, prop: string): any => {
  const result = Object.keys(obj).filter((key) => key === prop);
  return result.length > 0 ? obj[result[0]] : undefined;
};

describe("transformProduct", () => {
  describe("stratigic transform tests", () => {
    it("should transform single Categorytype 'Category'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [createCategory()]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "Category"
      );
      expect(categoryAsProp).toEqual([{ code: "code", name: "name" }]);
    });

    it("should transform multiple Categorytype 'Category'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()]
      });
      const transformedProduct = transformProduct(product);
      const newFeatureValueAsProp = getDynamicPropValue(
        transformedProduct[0],
        "Category"
      );

      expect(newFeatureValueAsProp).toEqual([
        { code: "parent-category-code", name: "name" },
        { code: "code", name: "name" },
        { code: "BMI-brand-code", name: "name" }
      ]);
    });

    it("should transform single Categorytype 'ProductLine'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [
          createCategory({
            categoryType: "ProductLine",
            code: "RoofTiles",
            name: "Roof Tiles"
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "ProductLine"
      );
      expect(categoryAsProp).toEqual([
        { code: "RoofTiles", name: "Roof Tiles" }
      ]);
    });
    it("should transform single Categorytype 'ProductFamily'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [
          createCategory({
            categoryType: "ProductFamily",
            code: "Tiles",
            name: "Tiles"
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "ProductFamily"
      );
      expect(categoryAsProp).toEqual([{ code: "Tiles", name: "Tiles" }]);
    });

    it("should transform single Categorytype 'Brand'", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [
          createCategory({
            categoryType: "Brand",
            code: "Aerodek",
            name: "Aerodek"
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "Brand"
      );
      expect(categoryAsProp).toEqual([{ code: "Aerodek", name: "Aerodek" }]);
    });

    it("should transform All Parent Categories", () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [
          createCategory({
            categoryType: "Brand",
            code: "Aerodek",
            name: "Aerodek",
            parentCategoryCode: "BMI_Brands"
          }),
          createCategory({
            categoryType: "Category",
            code: "CONCRETE_NO",
            name: "Betongtakstein",
            parentCategoryCode: "PITCHEDROOF_NO"
          }),
          createCategory({
            categoryType: "Category",
            code: "MAINTILE_CONCRETE_NO",
            name: "Normalstein",
            parentCategoryCode: "CONCRETE_NO"
          }),
          createCategory({
            categoryType: "Category",
            code: "ROOF_NO",
            name: "Takprodukter",
            parentCategoryCode: "PRODUCTS_NO"
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      let categoryAsProp = getDynamicPropValue(transformedProduct[0], "Brand");
      expect(categoryAsProp).toEqual([{ code: "Aerodek", name: "Aerodek" }]);

      categoryAsProp = getDynamicPropValue(transformedProduct[0], "BMI_Brands");
      expect(categoryAsProp).toEqual([{ code: "Aerodek", name: "Aerodek" }]);

      categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "PITCHEDROOF_NO"
      );
      expect(categoryAsProp).toEqual([
        { code: "CONCRETE_NO", name: "Betongtakstein" }
      ]);

      categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "CONCRETE_NO"
      );
      expect(categoryAsProp).toEqual([
        { code: "MAINTILE_CONCRETE_NO", name: "Normalstein" }
      ]);

      categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "PRODUCTS_NO"
      );
      expect(categoryAsProp).toEqual([
        { code: "ROOF_NO", name: "Takprodukter" }
      ]);
    });

    describe("when feature values do not have 'code'", () => {
      it("uses value to generate transformed code for single feature value from a variant classification", () => {
        const product = createPimProduct({
          variantOptions: [
            createVariantOption({
              classifications: [
                createMeasurementsClassification({
                  features: [
                    createFeature({
                      code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                      featureValues: [
                        createFeatureValue({ code: undefined, value: "100" })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        });
        const transformedProduct = transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "measurements.width"
        );

        expect(featureNameAsProp).toEqual([
          { code: "100symbol", name: "100 symbol" }
        ]);
      });

      it("uses value to generate transformed code for multiple feature values from a variant classification", () => {
        const product = createPimProduct({
          variantOptions: [
            createVariantOption({
              classifications: [
                createMeasurementsClassification({
                  features: [
                    createFeature({
                      code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                      featureValues: [
                        createFeatureValue({ code: undefined, value: "100" }),
                        createFeatureValue({ code: undefined, value: "200" })
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        });
        const transformedProduct = transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "measurements.height"
        );

        expect(featureNameAsProp).toEqual([
          { code: "100symbol", name: "100 symbol" },
          { code: "200symbol", name: "200 symbol" }
        ]);
      });
    });

    describe("when feature values has 'code'", () => {
      it("uses feature code to generate transformed code for single feature value from a variant classification", () => {
        const product = createPimProduct({
          variantOptions: [
            createVariantOption({
              classifications: [
                createMeasurementsClassification({
                  features: [
                    createFeature({
                      code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colorFamily`,
                      featureValues: [
                        createFeatureValue({
                          code: "COLOUR_GREEN",
                          value: "green"
                        })
                      ],
                      featureUnit: undefined
                    })
                  ]
                })
              ]
            })
          ]
        });
        const transformedProduct = transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "appearanceAttributes.colorFamily"
        );

        expect(featureNameAsProp).toEqual([
          { code: "COLOUR_GREEN", name: "green" }
        ]);
      });

      it("uses feature code to generate transformed code for multiple feature values from a variant classification", () => {
        const product = createPimProduct({
          variantOptions: [
            createVariantOption({
              classifications: [
                createMeasurementsClassification({
                  features: [
                    createFeature({
                      code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colorFamily`,
                      featureValues: [
                        createFeatureValue({
                          code: "COLOUR_GREEN",
                          value: "green"
                        }),
                        createFeatureValue({ code: "COLOUR_RED", value: "red" })
                      ],
                      featureUnit: undefined
                    })
                  ]
                })
              ]
            })
          ]
        });
        const transformedProduct = transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "appearanceAttributes.colorFamily"
        );

        expect(featureNameAsProp).toEqual([
          { code: "COLOUR_GREEN", name: "green" },
          { code: "COLOUR_RED", name: "red" }
        ]);
      });
    });
    it("should transform nothing into measurementValue if not width, length or height", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.something`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toBeUndefined();
    });

    it("should transform width into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("100symbol");
    });

    it("should transform length into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.length`,
                    featureValues: [createFeatureValue({ value: "10" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("10symbol");
    });

    it("should transform height into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "1" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("1symbol");
    });

    it("should transform width, legnth and height into measurementValue", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "10" })]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.length`,
                    featureValues: [createFeatureValue({ value: "1" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("10x100x1symbol");
    });
  });

  describe("original transform tests", () => {
    it("should transform full product with single variant to a single ES product", () => {
      const product = createPimProduct();

      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should transform product with colourfamilyCode,colourfamilyValue,texturefamilyCode,texturefamilyValue equal undefined if appearanceClassifications.features === undefined", () => {
      const product = createPimProduct({
        classifications: [
          createAppearanceAttributesClassification({
            features: undefined
          })
        ]
      });

      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].colourfamilyCode).toEqual(undefined);
      expect(transformedProduct[0].colourfamilyValue).toEqual(undefined);
      expect(transformedProduct[0].texturefamilyCode).toEqual(undefined);
      expect(transformedProduct[0].texturefamilyValue).toEqual(undefined);
    });

    it("should transform product with materialsCode,materialsValue equal undefined if generalInformationClassification.features === undefined", () => {
      const product = createPimProduct({
        classifications: [
          createGeneralInformationClassification({
            features: undefined
          })
        ]
      });

      const transformedProduct = transformProduct(product);

      expect(transformedProduct[0].materialsCode).toEqual(undefined);
      expect(transformedProduct[0].materialsValue).toEqual(undefined);
    });

    it("should default PIM_CLASSIFICATION_CATALOGUE_NAMESPACE if not provided", () => {
      const pimClassificationCcatalogueNamespace =
        process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;
      delete process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;

      const product = createPimProduct();

      expect(transformProduct(product)).toMatchSnapshot();

      process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE =
        pimClassificationCcatalogueNamespace;
    });

    it("should ignore variant scoringWeightAttributes", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createScoringWeightAttributesClassification({
                features: [
                  createFeature({
                    featureValues: [createFeatureValue({ value: "2.0" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualScoringWeightAttributes = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "scoringWeightAttributes"
      );
      const expectedScoringWeightAttributes = product.classifications!.filter(
        (classification) => classification.code === "scoringWeightAttributes"
      );
      expect(expectedScoringWeightAttributes).not.toEqual(
        product.variantOptions!.filter((variant) =>
          variant.classifications!.filter(
            (classification) =>
              classification.code === "scoringWeightAttributes"
          )
        )
      );
      expect(actualScoringWeightAttributes).toEqual(
        expectedScoringWeightAttributes
      );
    });

    it("should assign variantScoringWeightInt to 0", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createScoringWeightAttributesClassification({
                features: [
                  createFeature({
                    featureValues: [createFeatureValue({ value: "tValue" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const variantScoringWeightInt =
        transformProduct(product)[0].variantScoringWeightInt;

      expect(variantScoringWeightInt).toEqual(0);
    });

    it("should assign scoringWeightInt and productScoringWeightInt to 0", () => {
      const product = createPimProduct({
        classifications: [
          createScoringWeightAttributesClassification({
            features: [
              createFeature({
                featureValues: [createFeatureValue({ value: "tValue" })]
              })
            ]
          })
        ]
      });
      const scoringWeightInt = transformProduct(product)[0].scoringWeightInt;
      const productScoringWeightInt =
        transformProduct(product)[0].productScoringWeightInt;

      expect(scoringWeightInt).toEqual(0);
      expect(productScoringWeightInt).toEqual(0);
    });

    describe("scoringWeightAttributes classification tests", () => {
      describe("When scoringWeightAttributes classification is not present", () => {
        it("should default scoringWeight", () => {
          const product = createPimProduct({ classifications: [] });
          const transformedProduct = transformProduct(product);
          expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(0);
          expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(0);
          expect(transformedProduct[0]["scoringWeightInt"]).toEqual(0);
        });
      });
      describe("When scoringWeightAttributes classification is present and no feature", () => {
        describe("Product Feature is undefined", () => {
          it("should default scoringWeight", () => {
            const product = createPimProduct({
              classifications: [
                createScoringWeightAttributesClassification({
                  features: undefined
                })
              ]
            });
            const transformedProduct = transformProduct(product);
            expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(0);
            expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(0);
            expect(transformedProduct[0]["scoringWeightInt"]).toEqual(0);
          });
        });
        describe("Variant Feature is undefined", () => {
          it("should default scoringWeight", () => {
            const product = createPimProduct({
              classifications: [
                createScoringWeightAttributesClassification({
                  features: undefined
                })
              ],
              variantOptions: [
                createVariantOption({
                  classifications: [
                    createScoringWeightAttributesClassification({
                      features: undefined
                    })
                  ]
                })
              ]
            });
            const transformedProduct = transformProduct(product);
            expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(0);
            expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(0);
            expect(transformedProduct[0]["scoringWeightInt"]).toEqual(0);
          });
        });
      });
    });

    it("should index product and variant scoringWeightAttributeInt separately", () => {
      const product = createPimProduct({
        classifications: [
          createScoringWeightAttributesClassification({
            features: [
              createFeature({
                featureValues: [createFeatureValue({ value: "3.0" })]
              })
            ]
          })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createScoringWeightAttributesClassification({
                features: [
                  createFeature({
                    featureValues: [createFeatureValue({ value: "2.0" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const transformedProduct = transformProduct(product);
      expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(3);
      expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(2);
      expect(transformedProduct[0]["scoringWeightInt"]).toEqual(3);
    });

    it("should override product appearanceAttributes classification with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createAppearanceAttributesClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.colourfamily`,
                    featureValues: [
                      createFeatureValue({ code: "GREEN", value: "green" })
                    ]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/appearanceAttributes.texturefamily`,
                    featureValues: [createFeatureValue({ value: "matte" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualAppearanceAttributes = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "appearanceAttributes"
      );
      const expectedAppearanceAttributes = product.variantOptions!.flatMap(
        (variant) =>
          variant.classifications!.filter(
            (classification) => classification.code === "appearanceAttributes"
          )
      );
      expect(expectedAppearanceAttributes).not.toEqual(
        product.classifications!.filter(
          (classification) => classification.code === "appearanceAttributes"
        )
      );
      expect(actualAppearanceAttributes).toEqual(expectedAppearanceAttributes);
    });

    it("should override product generalInformation classification with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createGeneralInformationClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/generalInformation.materials`,
                    featureValues: [createFeatureValue({ value: "clay" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualGeneralInformation = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "generalInformation"
      );
      const expectedGeneralInformation = product.variantOptions!.flatMap(
        (variantOption) =>
          variantOption.classifications!.filter(
            (classification) => classification.code === "generalInformation"
          )
      );
      expect(expectedGeneralInformation).not.toEqual(
        product.classifications!.filter(
          (classification) => classification.code === "generalInformation"
        )
      );
      expect(actualGeneralInformation).toEqual(expectedGeneralInformation);
    });

    it("should override product measurements classification with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  })
                ]
              })
            ]
          })
        ]
      });
      const actualGeneralInformation = transformProduct(
        product
      )[0].classifications.filter(
        (classification) => classification.code === "measurements"
      );
      const expectedGeneralInformation = product.variantOptions!.flatMap(
        (variantOption) =>
          variantOption.classifications!.filter(
            (classification) => classification.code === "measurements"
          )
      );
      expect(expectedGeneralInformation).not.toEqual(
        product.classifications!.filter(
          (classification) => classification.code === "measurements"
        )
      );
      expect(actualGeneralInformation).toEqual(expectedGeneralInformation);
    });

    it("should override product approvalStatus with variant", () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            approvalStatus: "unapproved"
          })
        ]
      });
      const actualApprovalStatus = transformProduct(product)[0].approvalStatus;
      const expectedApprovalStatus = product.variantOptions![0].approvalStatus;
      expect(expectedApprovalStatus).not.toEqual(product.approvalStatus);
      expect(actualApprovalStatus).toEqual(expectedApprovalStatus);
    });

    it("should handle no classifications", () => {
      const product = createPimProduct({
        classifications: undefined,
        variantOptions: [
          createVariantOption({
            classifications: undefined
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle appearanceAttributes classifications with no features", () => {
      const product = createPimProduct({
        classifications: [
          createAppearanceAttributesClassification({ features: undefined })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createAppearanceAttributesClassification({
                features: undefined
              })
            ]
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle generalInformation classifications with no features", () => {
      const product = createPimProduct({
        classifications: [
          createGeneralInformationClassification({ features: undefined })
        ],
        variantOptions: [
          createVariantOption({
            classifications: [
              createGeneralInformationClassification({
                features: undefined
              })
            ]
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle no categories", () => {
      const product = createPimProduct({
        categories: undefined
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should handle no images", () => {
      const product = createPimProduct({
        images: undefined,
        variantOptions: [
          createVariantOption({
            images: undefined
          })
        ]
      });
      expect(transformProduct(product)).toMatchSnapshot();
    });

    it("should return an empty array if there are no variants", () => {
      const product = createPimProduct({
        variantOptions: undefined
      });
      expect(transformProduct(product)).toStrictEqual([]);
    });
  });
});
