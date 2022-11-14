import {
  createCategory,
  createClassification,
  createFeature,
  createFeatureUnit,
  createProduct,
  createVariantOption
} from "@bmi/pim-types";
import {
  getCategoryFilters,
  getClassificationsFilters
} from "../filterHelpers";

describe("getCategoryFilters", () => {
  it("should uppercase filter group value", () => {
    const categories = [
      createCategory({
        categoryType: "Brand",
        parentCategoryCode: undefined,
        code: "AeroDek",
        name: "BMI AeroDek"
      }),
      createCategory({
        categoryType: "Category",
        parentCategoryCode: undefined,
        code: "Products_NO",
        name: "Products"
      })
    ];

    const categoryFilters = getCategoryFilters(categories);

    expect(categoryFilters).toEqual({
      BRAND: [{ code: "AeroDek", name: "BMI AeroDek" }],
      CATEGORY: [{ code: "Products_NO", name: "Products" }]
    });
  });

  it("should group categories by the category type", () => {
    const categories = [
      createCategory({
        categoryType: "Brand",
        parentCategoryCode: undefined,
        code: "AeroDek",
        name: "BMI AeroDek"
      }),
      createCategory({
        categoryType: "Brand",
        parentCategoryCode: undefined,
        code: "Icopal",
        name: "BMI Icopal"
      })
    ];

    const categoryFilters = getCategoryFilters(categories);

    expect(categoryFilters).toEqual({
      BRAND: [
        { code: "AeroDek", name: "BMI AeroDek" },
        { code: "Icopal", name: "BMI Icopal" }
      ]
    });
  });

  it("should group categories by the parent category code", () => {
    const categories = [
      createCategory({
        categoryType: "Category",
        parentCategoryCode: "Products_NO",
        code: "Pitched_Roof_Products",
        name: "Pitched Roof Products"
      }),
      createCategory({
        categoryType: "Category",
        parentCategoryCode: "Products_NO",
        code: "Flat_Roof_Products",
        name: "Flat Roof Products"
      })
    ];

    const categoryFilters = getCategoryFilters(categories);

    expect(categoryFilters).toEqual({
      CATEGORY: [
        { code: "Pitched_Roof_Products", name: "Pitched Roof Products" },
        { code: "Flat_Roof_Products", name: "Flat Roof Products" }
      ],
      PRODUCTS_NO: [
        { code: "Pitched_Roof_Products", name: "Pitched Roof Products" },
        { code: "Flat_Roof_Products", name: "Flat Roof Products" }
      ]
    });
  });
});

describe("getClassificationFilters", () => {
  it("should return empty object if no classificaitons on the product or variant options", () => {
    const product = createProduct({
      classifications: undefined,
      variantOptions: [createVariantOption({ classifications: undefined })]
    });

    const classificationFilters = getClassificationsFilters(product);

    expect(classificationFilters).toEqual({});
  });

  it("should return texture family from product classifications", () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "appearanceAttributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
              featureValues: [{ code: "gloss", value: "Gloss" }],
              featureUnit: createFeatureUnit()
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: undefined
        })
      ]
    });

    const classificationFilters = getClassificationsFilters(product);

    expect(classificationFilters).toEqual({
      "APPEARANCEATTRIBUTES.TEXTUREFAMILY": [{ code: "gloss", name: "Gloss" }]
    });
  });

  it("should return texture family from variant options classifications", () => {
    const product = createProduct({
      classifications: undefined,
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
                  featureValues: [{ code: "gloss", value: "Gloss" }],
                  featureUnit: createFeatureUnit()
                })
              ]
            })
          ]
        })
      ]
    });

    const classificationFilters = getClassificationsFilters(product);

    expect(classificationFilters).toEqual({
      "APPEARANCEATTRIBUTES.TEXTUREFAMILY": [{ code: "gloss", name: "Gloss" }]
    });
  });

  it("should return deduped texture family from product and variant options classifications", () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "appearanceAttributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
              featureValues: [{ code: "gloss", value: "Gloss" }],
              featureUnit: createFeatureUnit()
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
                  featureValues: [{ code: "gloss", value: "Gloss" }],
                  featureUnit: createFeatureUnit()
                })
              ]
            })
          ]
        })
      ]
    });

    const classificationFilters = getClassificationsFilters(product);

    expect(classificationFilters).toEqual({
      "APPEARANCEATTRIBUTES.TEXTUREFAMILY": [{ code: "gloss", name: "Gloss" }]
    });
  });

  it("should return all texture family values from product and variant options classifications", () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "appearanceAttributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
              featureValues: [{ code: "matte", value: "Matte" }],
              featureUnit: createFeatureUnit()
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
                  featureValues: [{ code: "gloss", value: "Gloss" }],
                  featureUnit: createFeatureUnit()
                })
              ]
            })
          ]
        }),
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.textureFamily",
                  featureValues: [{ code: "satin", value: "Satin" }],
                  featureUnit: createFeatureUnit()
                })
              ]
            })
          ]
        })
      ]
    });

    const classificationFilters = getClassificationsFilters(product);

    expect(classificationFilters).toEqual({
      "APPEARANCEATTRIBUTES.TEXTUREFAMILY": [
        { code: "matte", name: "Matte" },
        { code: "gloss", name: "Gloss" },
        { code: "satin", name: "Satin" }
      ]
    });
  });

  it("should ignore classifications that aren't texture family", () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "appearanceAttributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
              featureValues: [{ code: "antique_red", value: "Antique Red" }],
              featureUnit: createFeatureUnit()
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourFamily",
                  featureValues: [{ code: "red", value: "Red" }],
                  featureUnit: createFeatureUnit()
                })
              ]
            })
          ]
        }),
        createVariantOption({
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [{ code: "100", value: "100" }],
                  featureUnit: createFeatureUnit({ symbol: "mm" })
                })
              ]
            })
          ]
        })
      ]
    });

    const classificationFilters = getClassificationsFilters(product);

    expect(classificationFilters).toEqual({});
  });
});
