import { Product as EsProduct } from "@bmi/elasticsearch-types";
import {
  ApprovalStatus,
  createAppearanceAttributesClassification,
  createCategory,
  createClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue,
  createGeneralInformationClassification,
  createIgnorableClassifications,
  createMeasurementsClassification,
  createProduct as createPimProduct,
  createScoringWeightAttributesClassification,
  createVariantOption,
  GoodBetterBest,
  Product
} from "@bmi/pim-types";

const { PIM_CLASSIFICATION_CATALOGUE_NAMESPACE } = process.env;

const transformProduct = async (
  product: Partial<Product>
): Promise<EsProduct[]> =>
  (await import("../transformProducts")).transformProduct(product as Product);

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
    it("should transform single Categorytype 'Category'", async () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()],
        categories: [createCategory()]
      });
      const transformedProduct = await transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "Category".toUpperCase() //TODO: DXB-3449 - remove when case agnostic to be reverted!
      );
      expect(categoryAsProp).toEqual([{ code: "code", name: "name" }]);
    });

    it("should transform multiple Categorytype 'Category'", async () => {
      const product = createPimProduct({
        variantOptions: [createVariantOption()]
      });
      const transformedProduct = await transformProduct(product);
      const newFeatureValueAsProp = getDynamicPropValue(
        transformedProduct[0],
        "Category".toUpperCase() //TODO: DXB-3449 -remove when case agnostic to be reverted!
      );

      expect(newFeatureValueAsProp).toEqual([
        { code: "parent-category-code", name: "name" },
        { code: "code", name: "name" },
        { code: "BMI-brand-code", name: "name" }
      ]);
    });

    it("should transform single Categorytype 'ProductLine'", async () => {
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
      const transformedProduct = await transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "ProductLine".toUpperCase() //TODO: DXB-3449 -remove when case agnostic to be reverted!
      );
      expect(categoryAsProp).toEqual([
        { code: "RoofTiles", name: "Roof Tiles" }
      ]);
    });
    it("should transform single Categorytype 'ProductFamily'", async () => {
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
      const transformedProduct = await transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "ProductFamily".toUpperCase() //TODO: DXB-3449 -remove when case agnostic to be reverted!
      );
      expect(categoryAsProp).toEqual([{ code: "Tiles", name: "Tiles" }]);
    });

    it("should transform single Categorytype 'Brand'", async () => {
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
      const transformedProduct = await transformProduct(product);
      const categoryAsProp = getDynamicPropValue(
        transformedProduct[0],
        "Brand".toUpperCase() //TODO: DXB-3449 -remove when case agnostic to be reverted!
      );
      expect(categoryAsProp).toEqual([{ code: "Aerodek", name: "Aerodek" }]);
    });

    it("should transform All Parent Categories", async () => {
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
      const transformedProduct = await transformProduct(product);
      let categoryAsProp = getDynamicPropValue(transformedProduct[0], "BRAND");
      expect(categoryAsProp).toEqual([{ code: "Aerodek", name: "Aerodek" }]);

      categoryAsProp = getDynamicPropValue(transformedProduct[0], "BMI_BRANDS");
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
      it("uses value to generate transformed code for single feature value from a variant classification", async () => {
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
        const transformedProduct = await transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "MEASUREMENTS$WIDTH"
        );

        expect(featureNameAsProp).toEqual([
          { code: "100symbol", name: "100 symbol", value: "100" }
        ]);
      });

      it("uses value to generate transformed code for multiple feature values from a variant classification", async () => {
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
        const transformedProduct = await transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "MEASUREMENTS$HEIGHT"
        );

        expect(featureNameAsProp).toEqual([
          { code: "100symbol", name: "100 symbol" },
          { code: "200symbol", name: "200 symbol" }
        ]);
      });
    });

    describe("when feature values has 'code'", () => {
      it("uses feature code to generate transformed code for single feature value from a variant classification", async () => {
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
        const transformedProduct = await transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "APPEARANCEATTRIBUTES$COLORFAMILY"
        );

        expect(featureNameAsProp).toEqual([
          { code: "COLOUR_GREEN", name: "green" }
        ]);
      });

      it("uses feature code to generate transformed code for multiple feature values from a variant classification", async () => {
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
        const transformedProduct = await transformProduct(product);
        const featureNameAsProp = getDynamicPropValue(
          transformedProduct[0],
          "APPEARANCEATTRIBUTES$COLORFAMILY"
        );

        expect(featureNameAsProp).toEqual([
          { code: "COLOUR_GREEN", name: "green" },
          { code: "COLOUR_RED", name: "red" }
        ]);
      });
    });
    it("should transform nothing into measurementValue if not width, length or height", async () => {
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
      const transformedProduct = await transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("");
    });

    it("should transform width into measurementValue", async () => {
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
      const transformedProduct = await transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("100symbol");
    });

    it("should transform length into measurementValue", async () => {
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
      const transformedProduct = await transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("10symbol");
    });

    it("should transform height into measurementValue", async () => {
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
      const transformedProduct = await transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("1symbol");
    });

    it("should transform width, legnth and height into measurementValue", async () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "10" })]
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
      const transformedProduct = await transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("100x1x10symbol");
    });

    it("should exclude TwoOneClassificationAndFeatures", async () => {
      const product = createPimProduct({
        variantOptions: [
          createVariantOption({
            classifications: [
              ...createIgnorableClassifications,
              createMeasurementsClassification({
                features: [
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.width`,
                    featureValues: [createFeatureValue({ value: "100" })]
                  }),
                  createFeature({
                    code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/measurements.height`,
                    featureValues: [createFeatureValue({ value: "10" })]
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
      const transformedProduct = await transformProduct(product);

      expect(transformedProduct[0].measurementValue).toEqual("100x1x10symbol");
      //verify TwoOne classifications and attributes are not present iin transformed product
      expect(transformedProduct[0].bagUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].canisterUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].crateUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].cubicMeterUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].drumUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].eachUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].kilogramUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].kilometerUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].literUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].meterUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].packUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].palletUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].pieceUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].rollsUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].squareMeterUomAttributes).toEqual(undefined);
      expect(transformedProduct[0].bimAttributes).toEqual(undefined);
    });

    describe("keywords attribute", () => {
      it("should set keywords to undefined when product and variant's keywords doesn't exist", async () => {
        const product = createPimProduct({
          variantOptions: [createVariantOption()]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0].keywords).toEqual(undefined);
      });
      it("should transform product's keywords into ES keywords", async () => {
        const keywords = ["test-keyword-1", "test-keyword-2"];
        const product = createPimProduct({
          variantOptions: [createVariantOption()],
          keywords
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0].keywords).toEqual(keywords);
      });
      it("should transform variant's keywords into ES keywords", async () => {
        const keywords = ["test-keyword-1", "test-keyword-2"];
        const product = createPimProduct({
          variantOptions: [
            createVariantOption({
              keywords
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0].keywords).toEqual(keywords);
      });
      it("should transform and merge variant and product's unique keywords into ES keywords", async () => {
        const keywords = ["test-keyword-1", "test-keyword-2"];
        const product = createPimProduct({
          variantOptions: [
            createVariantOption({
              keywords
            })
          ],
          keywords: [...keywords, "test-keyword-3"]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0].keywords).toEqual([
          ...keywords,
          "test-keyword-3"
        ]);
      });
    });
  });

  describe("original transform tests", () => {
    describe("approval status scenarios", () => {
      it("should transform full product if both base and varaint approval statuses are approved, with an approved status", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Approved,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Approved
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0]["approvalStatus"]).toEqual(
          ApprovalStatus.Approved
        );
      });

      it("should transform a full product if the base product's approval status is approved and the variant status is discontinued, with a discontinued status", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Approved,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Discontinued
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0]["approvalStatus"]).toEqual(
          ApprovalStatus.Discontinued
        );
      });

      it("should not transform a full product if the base product's approval status is approved and the variant status is unapproved", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Approved,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Unapproved
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform a full product if the base product's approval status is approved and the variant status is check", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Approved,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Check
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform a full product if the base product's approval status is approved and the variant status is preview", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Approved,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Preview
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should transform full product if both base and varaint approval statuses are discontinued, with a discontinued status", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Discontinued,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Discontinued
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0]["approvalStatus"]).toEqual(
          ApprovalStatus.Discontinued
        );
      });

      it("should transform a full product if the base product's approval status is discontinued and the varaint is approved, but the variant's approval status should be discontinued", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Discontinued,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Approved
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0]["approvalStatus"]).toEqual(
          ApprovalStatus.Discontinued
        );
      });

      it("should not transform a full product if the base product's approval status is discontinued and the varaint is unapproved", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Discontinued,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Unapproved
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform a full product if the base product's approval status is discontinued and the varaint is check", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Discontinued,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Check
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform a full product if the base product's approval status is discontinued and the varaint is preview", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Discontinued,
          variantOptions: [
            createVariantOption({
              approvalStatus: ApprovalStatus.Preview
            })
          ]
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform a full product if the base product's approval status is unapproved", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Unapproved
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform a full product if the base product's approval status is preview", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Preview
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform a full product if the base product's approval status is check", async () => {
        const product = createPimProduct({
          approvalStatus: ApprovalStatus.Check
        });
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should transform full product with single variant to a single ES product", async () => {
        const product = createPimProduct();

        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toMatchSnapshot();
        expect(transformedProduct[0]["totalVariantCount"]).toEqual(1);
      });

      it("ignores products without a name", async () => {
        const product = createPimProduct({ name: undefined });

        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toEqual([]);
      });

      it("should not transform full product without Variant products", async () => {
        const product = createPimProduct();
        product.variantOptions = [];

        const transformedProduct = await transformProduct(product);
        expect(transformedProduct).toMatchSnapshot();
      });

      it("should default PIM_CLASSIFICATION_CATALOGUE_NAMESPACE if not provided", async () => {
        const pimClassificationCcatalogueNamespace =
          process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;
        delete process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE;

        const product = createPimProduct({
          categories: [
            createCategory({
              parentCategoryCode: "",
              code: "parent-category-code"
            }),
            createCategory(),
            createCategory({ categoryType: "ProductFamily" }),
            createCategory({ categoryType: "ProductLine" }),
            createCategory({
              parentCategoryCode: "BMI_Brands",
              code: "BMI-brand-code"
            }),
            createCategory({
              categoryType: "Brand",
              code: "BMI-brand-code"
            })
          ]
        });

        expect(await transformProduct(product)).toMatchSnapshot();

        process.env.PIM_CLASSIFICATION_CATALOGUE_NAMESPACE =
          pimClassificationCcatalogueNamespace;
      });

      it("should ignore variant scoringWeightAttributes", async () => {
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
        const actualScoringWeightAttributes = (
          await transformProduct(product)
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

      it("should assign variantScoringWeightInt to 0", async () => {
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
        const variantScoringWeightInt = (await transformProduct(product))[0]
          .variantScoringWeightInt;

        expect(variantScoringWeightInt).toEqual(0);
      });

      it("should assign scoringWeightInt and productScoringWeightInt to 0", async () => {
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

        const productScoringWeightInt = (await transformProduct(product))[0]
          .productScoringWeightInt;

        expect(productScoringWeightInt).toEqual(0);
      });

      describe("scoringWeightAttributes classification tests", () => {
        describe("When scoringWeightAttributes classification is not present", () => {
          it("should default scoringWeight", async () => {
            const product = createPimProduct({ classifications: [] });
            const transformedProduct = await transformProduct(product);
            expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(0);
            expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(0);
          });
        });
        describe("When scoringWeightAttributes classification is present and no feature", () => {
          describe("Product Feature is undefined", () => {
            it("should default scoringWeight", async () => {
              const product = createPimProduct({
                classifications: [
                  createScoringWeightAttributesClassification({
                    features: undefined
                  })
                ]
              });
              const transformedProduct = await transformProduct(product);
              expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(
                0
              );
              expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(
                0
              );
            });
          });
          describe("Variant Feature is undefined", () => {
            it("should default scoringWeight", async () => {
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
              const transformedProduct = await transformProduct(product);
              expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(
                0
              );
              expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(
                0
              );
            });
          });
        });
      });

      it("should index product and variant scoringWeightAttributeInt separately", async () => {
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
        const transformedProduct = await transformProduct(product);
        expect(transformedProduct[0]["productScoringWeightInt"]).toEqual(3);
        expect(transformedProduct[0]["variantScoringWeightInt"]).toEqual(2);
      });

      it("should override product appearanceAttributes classification with variant", async () => {
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
        const actualAppearanceAttributes = (
          await transformProduct(product)
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
        expect(actualAppearanceAttributes).toEqual(
          expectedAppearanceAttributes
        );
      });

      it("should override product generalInformation classification with variant", async () => {
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
        const actualGeneralInformation = (
          await transformProduct(product)
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

      it("should override product measurements classification with variant", async () => {
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
        const actualGeneralInformation = (
          await transformProduct(product)
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

      it("should handle no classifications", async () => {
        const product = createPimProduct({
          classifications: undefined,
          variantOptions: [
            createVariantOption({
              classifications: undefined
            })
          ]
        });
        expect(await transformProduct(product)).toMatchSnapshot();
      });

      it("should handle appearanceAttributes classifications with no features", async () => {
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
        expect(await transformProduct(product)).toMatchSnapshot();
      });

      it("should handle generalInformation classifications with no features", async () => {
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
        expect(await transformProduct(product)).toMatchSnapshot();
      });

      it("should handle no categories", async () => {
        const product = createPimProduct({
          categories: undefined
        });
        expect(await transformProduct(product)).toMatchSnapshot();
      });

      it("should handle no images", async () => {
        const product = createPimProduct({
          images: undefined,
          variantOptions: [
            createVariantOption({
              images: undefined
            })
          ]
        });
        expect(await transformProduct(product)).toMatchSnapshot();
      });

      it("should return an empty array if there are no variants", async () => {
        const product = createPimProduct({
          variantOptions: undefined
        });
        expect(await transformProduct(product)).toStrictEqual([]);
      });

      it("should default external product code to an empty string", async () => {
        const product = createPimProduct({
          externalProductCode: undefined,
          variantOptions: [
            createVariantOption({ externalProductCode: undefined })
          ]
        });
        expect(
          (await transformProduct(product))[0].externalProductCode
        ).toStrictEqual("");
      });

      it("should default is sample order allowed to false", async () => {
        const product = createPimProduct({
          isSampleOrderAllowed: undefined,
          variantOptions: [
            createVariantOption({ isSampleOrderAllowed: undefined })
          ]
        });
        expect(
          (await transformProduct(product))[0].isSampleOrderAllowed
        ).toStrictEqual(false);
      });
    });

    it("creates path from variant attribute if variant attrubite present and ENABLE_PDP_VARIANT_ATTRIBUTE_URL is true", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "true";

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
                featureValues: [{ value: "Gloss" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }],
                featureUnit: createFeatureUnit()
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedproducts = await transformProduct(product);
      expect(transformedproducts[0].path).toEqual(
        `/p/product-name-diameter-40mm-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("creates path from colour, texture family and materials if variant attrubite not present and ENABLE_PDP_VARIANT_ATTRIBUTE_URL is true", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "true";

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }],
                featureUnit: createFeatureUnit()
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedproducts = await transformProduct(product);
      expect(transformedproducts[0].path).toEqual(
        `/p/product-name-black-gloss-clay-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("creates path from colour, texture family and materials if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is false", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "false";

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }],
                featureUnit: createFeatureUnit()
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedProducts = await transformProduct(product);
      expect(transformedProducts[0].path).toEqual(
        `/p/product-name-black-gloss-clay-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("creates path from colour, texture family and materials if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }],
                featureUnit: createFeatureUnit()
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedProducts = await transformProduct(product);
      expect(transformedProducts[0].path).toEqual(
        `/p/product-name-black-gloss-clay-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("creates path from just colour if texture family and materials not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedProducts = await transformProduct(product);
      expect(transformedProducts[0].path).toEqual(
        `/p/product-name-black-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("creates path from just texture family if colour and materials not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedProducts = await transformProduct(product);
      expect(transformedProducts[0].path).toEqual(
        `/p/product-name-gloss-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("creates path from just materials if colour and texture family not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedProducts = await transformProduct(product);
      expect(transformedProducts[0].path).toEqual(
        `/p/product-name-clay-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("creates path using the product name if variant name is not present", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "false";

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }],
                featureUnit: createFeatureUnit()
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: undefined })
        ]
      });
      const transformedProducts = await transformProduct(product);
      expect(transformedProducts[0].path).toEqual(
        `/p/product-name-black-gloss-clay-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });

    it("transforms product correctly with productReferences", async () => {
      const pimProduct = createPimProduct({
        name: "name",
        code: "code",
        productReferences: [
          {
            referenceType: "HIP",
            target: {
              code: "base_product_reference_product_code",
              name: "base product reference product"
            },
            preselected: false
          }
        ],
        variantOptions: [
          createVariantOption({
            approvalStatus: ApprovalStatus.Approved,
            productReferences: [
              {
                referenceType: "CLIP",
                target: {
                  code: "variant_reference_product_code",
                  name: "variant reference product"
                },
                preselected: false
              }
            ]
          })
        ]
      });

      const transformedProducts = await transformProduct(pimProduct);
      const expectedProductReferences = [
        {
          type: "CLIP",
          code: "variant_reference_product_code",
          name: "variant reference product"
        },
        {
          type: "HIP",
          code: "base_product_reference_product_code",
          name: "base product reference product"
        }
      ];
      expect(transformedProducts[0].productReferences).toStrictEqual(
        expectedProductReferences
      );
    });

    it("returns correct value for productReferences if baseProduct doesn't have productReferences", async () => {
      const pimProduct = createPimProduct({
        name: "name",
        code: "code",
        productReferences: undefined,
        variantOptions: [
          createVariantOption({
            approvalStatus: ApprovalStatus.Approved,
            productReferences: [
              {
                referenceType: "CLIP",
                target: {
                  code: "variant_reference_product_code",
                  name: "variant reference product"
                },
                preselected: false
              }
            ]
          })
        ]
      });

      const transformedProducts = await transformProduct(pimProduct);
      expect(transformedProducts[0].productReferences).toStrictEqual([
        {
          type: "CLIP",
          code: "variant_reference_product_code",
          name: "variant reference product"
        }
      ]);
    });

    it("returns correct value for productReferences if only base product has productReferences", async () => {
      const pimProduct = createPimProduct({
        name: "name",
        code: "code",
        productReferences: [
          {
            referenceType: "CLIP",
            target: {
              code: "variant_reference_product_code",
              name: "variant reference product"
            },
            preselected: false
          }
        ],
        variantOptions: [
          createVariantOption({
            approvalStatus: ApprovalStatus.Approved,
            productReferences: undefined
          })
        ]
      });

      const transformedProducts = await transformProduct(pimProduct);
      expect(transformedProducts[0].productReferences).toStrictEqual([
        {
          type: "CLIP",
          code: "variant_reference_product_code",
          name: "variant reference product"
        }
      ]);
    });

    it("returns only references of variant if it contains the same reference as the base product", async () => {
      const pimProduct = createPimProduct({
        name: "name",
        code: "code",
        productReferences: [
          {
            referenceType: "CLIP",
            target: {
              code: "base_product_reference_product_code",
              name: "base product reference product"
            },
            preselected: false
          }
        ],
        variantOptions: [
          createVariantOption({
            approvalStatus: ApprovalStatus.Approved,
            productReferences: [
              {
                referenceType: "CLIP",
                target: {
                  code: "variant_reference_product_code",
                  name: "variant reference product"
                },
                preselected: false
              }
            ]
          })
        ]
      });

      const transformedProducts = await transformProduct(pimProduct);
      const expectedProductReferences = [
        {
          type: "CLIP",
          code: "variant_reference_product_code",
          name: "variant reference product"
        }
      ];
      expect(transformedProducts[0].productReferences).toStrictEqual(
        expectedProductReferences
      );
    });

    it("returns undefined for productReferences if both variant and base product don't have any product references", async () => {
      const pimProduct = createPimProduct({
        name: "name",
        code: "code",
        productReferences: undefined,
        variantOptions: [
          createVariantOption({
            approvalStatus: ApprovalStatus.Approved,
            productReferences: undefined
          })
        ]
      });

      const transformedProducts = await transformProduct(pimProduct);
      expect(transformedProducts[0].productReferences).toBeUndefined();
    });

    it("creates path using the product name if variant name is present", async () => {
      const originalEnablePdpVariantAttributeUrl =
        process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "false";

      const product = createPimProduct({
        classifications: [
          createClassification({
            code: "appearanceAttributes",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                featureValues: [{ value: "Black" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
                featureValues: [{ value: "Gloss" }],
                featureUnit: createFeatureUnit()
              }),
              createFeature({
                code: "bmiClassificationCatalog/1.0/appearanceAttributes.variantattribute",
                featureValues: [{ value: "Diameter 40mm" }],
                featureUnit: createFeatureUnit()
              })
            ]
          }),
          createClassification({
            code: "generalInformation",
            features: [
              createFeature({
                code: "bmiClassificationCatalog/1.0/generalInformation.materials",
                featureValues: [{ value: "Clay" }],
                featureUnit: createFeatureUnit()
              })
            ]
          })
        ],
        code: "code",
        name: "Product Name",
        variantOptions: [
          createVariantOption({ code: "variant-code", name: "Variant Name" })
        ]
      });
      const transformedProducts = await transformProduct(product);
      expect(transformedProducts[0].path).toEqual(
        `/p/product-name-black-gloss-clay-3464354221`
      );

      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
        originalEnablePdpVariantAttributeUrl;
    });
  });

  it("returns variants with goodBetterBest field", async () => {
    const product = createPimProduct({
      goodBetterBest: GoodBetterBest.good,
      variantOptions: [createPimProduct(), createPimProduct()]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          goodBetterBest: GoodBetterBest.good
        }),
        expect.objectContaining({
          goodBetterBest: GoodBetterBest.good
        })
      ])
    );
  });

  it("ignores roofPitch*Min, roofPitch*Max, MaxBattenDistance* and FirstRowBattenDistance* classification attributes of variant product", async () => {
    const product = createPimProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              name: "tilesAttributes",
              code: "tilesAttributes",
              features: [
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
                  featureValues: [createFeatureValue({ value: "15" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
                  featureValues: [createFeatureValue({ value: "20" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
                  featureValues: [createFeatureValue({ value: "25" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
                  featureValues: [createFeatureValue({ value: "10" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch2Min`,
                  featureValues: [createFeatureValue({ value: "20" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch2Max`,
                  featureValues: [createFeatureValue({ value: "25" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance2`,
                  featureValues: [createFeatureValue({ value: "27" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance2`,
                  featureValues: [createFeatureValue({ value: "11" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch3Min`,
                  featureValues: [createFeatureValue({ value: "25" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch3Max`,
                  featureValues: [createFeatureValue({ value: "30" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance3`,
                  featureValues: [createFeatureValue({ value: "29" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance3`,
                  featureValues: [createFeatureValue({ value: "12" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch4Min`,
                  featureValues: [createFeatureValue({ value: "30" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch4Max`,
                  featureValues: [createFeatureValue({ value: "35" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance4`,
                  featureValues: [createFeatureValue({ value: "31" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance4`,
                  featureValues: [createFeatureValue({ value: "14" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch5Min`,
                  featureValues: [createFeatureValue({ value: "35" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch5Max`,
                  featureValues: [createFeatureValue({ value: "40" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance5`,
                  featureValues: [createFeatureValue({ value: "33" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance5`,
                  featureValues: [createFeatureValue({ value: "15" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch6Min`,
                  featureValues: [createFeatureValue({ value: "40" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch6Max`,
                  featureValues: [createFeatureValue({ value: "45" })]
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance6`,
                  featureValues: [createFeatureValue({ value: "35" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                }),
                createFeature({
                  code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance6`,
                  featureValues: [createFeatureValue({ value: "16" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([
      {
        CATEGORY: [
          { code: "parent-category-code", name: "name" },
          { code: "code", name: "name" },
          { code: "BMI-brand-code", name: "name" }
        ],
        PRODUCTFAMILY: [{ code: "code", name: "name" }],
        PRODUCTLINE: [{ code: "code", name: "name" }],
        "PARENT-CATEGORY-CODE": [
          { code: "code", name: "name" },
          { code: "code", name: "name" },
          { code: "code", name: "name" }
        ],
        BMI_BRANDS: [{ code: "BMI-brand-code", name: "name" }],
        approvalStatus: "approved",
        externalProductCode: "external-product-code",
        code: "variant-code",
        isSampleOrderAllowed: true,
        summary: "Summary",
        description: "<p>Some description</p>",
        longDescription: "<p>Long description</p>",
        shortDescription: "Short description",
        productBenefits: ["product-benefits"],
        visualiserAssets: undefined,
        name: "name",
        baseProduct: { code: "base-code", name: "name" },
        brandCode: "BMI",
        images: [
          {
            allowedToDownload: true,
            assetType: "MASTER_IMAGE",
            containerId: "container-id",
            fileSize: 10,
            format: "Product-Hero-Small-Desktop-Tablet",
            mime: "image/jpeg",
            name: "name",
            realFileName: "real-file-name.jpeg",
            url: "http://localhost:8000"
          },
          {
            allowedToDownload: true,
            assetType: "MASTER_IMAGE",
            containerId: "container-id",
            fileSize: 10,
            format: "Product-Hero-Small-Desktop-Tablet",
            mime: "image/jpeg",
            name: "name",
            realFileName: "real-file-name.jpeg",
            url: "http://localhost:8000"
          }
        ],
        allCategories: [
          { code: "parent-category-code", parentCategoryCode: "" },
          { code: "code", parentCategoryCode: "parent-category-code" },
          {
            code: "code",
            parentCategoryCode: "parent-category-code"
          },
          {
            code: "code",
            parentCategoryCode: "parent-category-code"
          },
          { code: "BMI-brand-code", parentCategoryCode: "BMI_Brands" }
        ],
        classifications: [
          { code: "tilesAttributes", features: [], name: "tilesAttributes" }
        ],
        goodBetterBest: undefined,
        measurementValue: "",
        productScoringWeightInt: 0,
        variantScoringWeightInt: 0,
        totalVariantCount: 1,
        mainImage: "http://localhost:8000",
        productReferences: undefined,
        path: "/p/name-3464354221",
        subTitle: "",
        battenSpacings: [
          {
            minAngle: 15,
            maxAngle: 20,
            battenDistance: { value: 25, unit: "cm" },
            firstRowBattenDistance: { value: 10, unit: "cm" }
          },
          {
            minAngle: 20,
            maxAngle: 25,
            battenDistance: { value: 27, unit: "cm" },
            firstRowBattenDistance: { value: 11, unit: "cm" }
          },
          {
            minAngle: 25,
            maxAngle: 30,
            battenDistance: { value: 29, unit: "cm" },
            firstRowBattenDistance: { value: 12, unit: "cm" }
          },
          {
            minAngle: 30,
            maxAngle: 35,
            battenDistance: { value: 31, unit: "cm" },
            firstRowBattenDistance: { value: 14, unit: "cm" }
          },
          {
            minAngle: 35,
            maxAngle: 40,
            battenDistance: { value: 33, unit: "cm" },
            firstRowBattenDistance: { value: 15, unit: "cm" }
          },
          {
            minAngle: 40,
            maxAngle: 45,
            battenDistance: { value: 35, unit: "cm" },
            firstRowBattenDistance: { value: 16, unit: "cm" }
          }
        ]
      }
    ]);
  });

  it("ignores roofPitch*Min, roofPitch*Max, MaxBattenDistance* and FirstRowBattenDistance* classification attributes of base product", async () => {
    const product = createPimProduct({
      classifications: [
        createClassification({
          name: "tilesAttributes",
          code: "tilesAttributes",
          features: [
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Min`,
              featureValues: [createFeatureValue({ value: "15" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch1Max`,
              featureValues: [createFeatureValue({ value: "20" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance1`,
              featureValues: [createFeatureValue({ value: "25" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance1`,
              featureValues: [createFeatureValue({ value: "10" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch2Min`,
              featureValues: [createFeatureValue({ value: "20" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch2Max`,
              featureValues: [createFeatureValue({ value: "25" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance2`,
              featureValues: [createFeatureValue({ value: "27" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance2`,
              featureValues: [createFeatureValue({ value: "11" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch3Min`,
              featureValues: [createFeatureValue({ value: "25" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch3Max`,
              featureValues: [createFeatureValue({ value: "30" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance3`,
              featureValues: [createFeatureValue({ value: "29" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance3`,
              featureValues: [createFeatureValue({ value: "12" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch4Min`,
              featureValues: [createFeatureValue({ value: "30" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch4Max`,
              featureValues: [createFeatureValue({ value: "35" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance4`,
              featureValues: [createFeatureValue({ value: "31" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance4`,
              featureValues: [createFeatureValue({ value: "14" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch5Min`,
              featureValues: [createFeatureValue({ value: "35" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch5Max`,
              featureValues: [createFeatureValue({ value: "40" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance5`,
              featureValues: [createFeatureValue({ value: "33" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance5`,
              featureValues: [createFeatureValue({ value: "15" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch6Min`,
              featureValues: [createFeatureValue({ value: "40" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.roofPitch6Max`,
              featureValues: [createFeatureValue({ value: "45" })]
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.MaxBattenDistance6`,
              featureValues: [createFeatureValue({ value: "35" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: `${PIM_CLASSIFICATION_CATALOGUE_NAMESPACE}/tilesAttributes.FirstRowBattenDistance6`,
              featureValues: [createFeatureValue({ value: "16" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            })
          ]
        })
      ],
      variantOptions: [createVariantOption({ classifications: [] })]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([
      {
        CATEGORY: [
          { code: "parent-category-code", name: "name" },
          { code: "code", name: "name" },
          { code: "BMI-brand-code", name: "name" }
        ],
        PRODUCTFAMILY: [{ code: "code", name: "name" }],
        PRODUCTLINE: [{ code: "code", name: "name" }],
        "PARENT-CATEGORY-CODE": [
          { code: "code", name: "name" },
          { code: "code", name: "name" },
          { code: "code", name: "name" }
        ],
        BMI_BRANDS: [{ code: "BMI-brand-code", name: "name" }],
        approvalStatus: "approved",
        externalProductCode: "external-product-code",
        code: "variant-code",
        isSampleOrderAllowed: true,
        summary: "Summary",
        description: "<p>Some description</p>",
        longDescription: "<p>Long description</p>",
        shortDescription: "Short description",
        productBenefits: ["product-benefits"],
        visualiserAssets: undefined,
        name: "name",
        baseProduct: { code: "base-code", name: "name" },
        brandCode: "BMI",
        images: [
          {
            allowedToDownload: true,
            assetType: "MASTER_IMAGE",
            containerId: "container-id",
            fileSize: 10,
            format: "Product-Hero-Small-Desktop-Tablet",
            mime: "image/jpeg",
            name: "name",
            realFileName: "real-file-name.jpeg",
            url: "http://localhost:8000"
          },
          {
            allowedToDownload: true,
            assetType: "MASTER_IMAGE",
            containerId: "container-id",
            fileSize: 10,
            format: "Product-Hero-Small-Desktop-Tablet",
            mime: "image/jpeg",
            name: "name",
            realFileName: "real-file-name.jpeg",
            url: "http://localhost:8000"
          }
        ],
        allCategories: [
          { code: "parent-category-code", parentCategoryCode: "" },
          { code: "code", parentCategoryCode: "parent-category-code" },
          {
            code: "code",
            parentCategoryCode: "parent-category-code"
          },
          {
            code: "code",
            parentCategoryCode: "parent-category-code"
          },
          { code: "BMI-brand-code", parentCategoryCode: "BMI_Brands" }
        ],
        classifications: [
          { code: "tilesAttributes", features: [], name: "tilesAttributes" }
        ],
        goodBetterBest: undefined,
        measurementValue: "",
        productScoringWeightInt: 0,
        variantScoringWeightInt: 0,
        totalVariantCount: 1,
        mainImage: "http://localhost:8000",
        productReferences: undefined,
        path: "/p/name-3464354221",
        subTitle: "",
        battenSpacings: [
          {
            minAngle: 15,
            maxAngle: 20,
            battenDistance: { value: 25, unit: "cm" },
            firstRowBattenDistance: { value: 10, unit: "cm" }
          },
          {
            minAngle: 20,
            maxAngle: 25,
            battenDistance: { value: 27, unit: "cm" },
            firstRowBattenDistance: { value: 11, unit: "cm" }
          },
          {
            minAngle: 25,
            maxAngle: 30,
            battenDistance: { value: 29, unit: "cm" },
            firstRowBattenDistance: { value: 12, unit: "cm" }
          },
          {
            minAngle: 30,
            maxAngle: 35,
            battenDistance: { value: 31, unit: "cm" },
            firstRowBattenDistance: { value: 14, unit: "cm" }
          },
          {
            minAngle: 35,
            maxAngle: 40,
            battenDistance: { value: 33, unit: "cm" },
            firstRowBattenDistance: { value: 15, unit: "cm" }
          },
          {
            minAngle: 40,
            maxAngle: 45,
            battenDistance: { value: 35, unit: "cm" },
            firstRowBattenDistance: { value: 16, unit: "cm" }
          }
        ]
      }
    ]);
  });
});
