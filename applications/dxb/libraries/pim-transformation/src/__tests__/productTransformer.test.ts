import {
  ApprovalStatus,
  createAsset,
  createCategory,
  createClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue,
  createFullyPopulatedProduct,
  createFullyPopulatedVariantOption,
  createIgnorableClassifications,
  createImage,
  createProduct,
  createVariantOption,
  GoodBetterBest,
  Product
} from "@bmi/pim-types";
import { jest } from "@jest/globals";
import { getSizeLabel } from "../productTransformer.js";

jest.mock("@bmi-digital/functions-logger");

const transformProduct = async (
  product: Product,
  allowPreviewStatus?: boolean
) =>
  (await import("../productTransformer.js")).transformProduct(
    product,
    allowPreviewStatus
  );

beforeEach(() => {
  process.env.ENABLE_SAMPLE_ORDERING = "true";
  process.env.ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING = "false";
});

describe("transformProduct", () => {
  test("should return measurement values in order: width, length, height, thickness", async () => {
    const product = createProduct({ approvalStatus: ApprovalStatus.Approved });
    const transformedProducts = await transformProduct(product);

    const measurement = transformedProducts[0].measurements;

    expect(Object.keys(measurement)).toEqual([
      "length",
      "width",
      "height",
      "thickness",
      "volume",
      "label"
    ]);

    expect(measurement?.width?.value).toEqual("20");
    expect(measurement?.length?.value).toEqual("10");
    expect(measurement?.height?.value).toEqual("30");
    expect(measurement?.thickness?.value).toEqual("40");
    expect(measurement?.label).toEqual("20x10x30x40mm");
  });

  it("getSizeLabel should return concatenated measurements in the correct format", () => {
    const width = { value: "10", unit: "cm" };
    const length = { value: "20", unit: "cm" };
    const height = { value: "30", unit: "cm" };
    const thickness = { value: "40", unit: "cm" };

    const sizeLabel = getSizeLabel(width, length, height, thickness);

    expect(sizeLabel).toEqual("10x20x30x40cm");
  });

  it("transforms a product with no variants", async () => {
    const product = createProduct({ variantOptions: undefined });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([]);
  });

  it("ignores products without a name", async () => {
    const product = createProduct({ name: undefined });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([]);
  });

  it("ignores products with status of check", async () => {
    const product = createProduct({ approvalStatus: ApprovalStatus.Check });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([]);
  });

  it("ignores products with status of unapproved", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Unapproved
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([]);
  });

  it("ignores products with status of preview", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([]);
  });

  it("transforms a single variant option with minimal data when status is approved", async () => {
    const product = createProduct({ approvalStatus: ApprovalStatus.Approved });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("transforms a single variant option with minimal data when status is discontinued", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Discontinued
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("transforms a fully populated product with approved status", async () => {
    const product = createFullyPopulatedProduct();
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("transforms a fully populated product with discontinued status", async () => {
    const product = createFullyPopulatedProduct({
      approvalStatus: ApprovalStatus.Discontinued
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("transforms a fully populated product with base discontinued status and variant approved", async () => {
    const product = createFullyPopulatedProduct({
      approvalStatus: ApprovalStatus.Discontinued,
      variantOptions: [
        createFullyPopulatedVariantOption({
          approvalStatus: ApprovalStatus.Approved
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("transforms a fully populated product with base approved status and variant discontinued", async () => {
    const product = createFullyPopulatedProduct({
      approvalStatus: ApprovalStatus.Approved,
      variantOptions: [
        createFullyPopulatedVariantOption({
          approvalStatus: ApprovalStatus.Discontinued
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("uses the variant external product code when product external product code is defined", async () => {
    const variant = createVariantOption({
      externalProductCode: "variant-external-product-code"
    });
    const product = createProduct({
      externalProductCode: "product-external-product-code",
      variantOptions: [variant]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].externalProductCode).toEqual(
      variant.externalProductCode
    );
  });

  it("uses the product external product code when variant external product code is undefined", async () => {
    const product = createProduct({
      externalProductCode: "product-external-product-code",
      variantOptions: [createVariantOption({ externalProductCode: undefined })]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].externalProductCode).toEqual(
      product.externalProductCode
    );
  });

  it("transforms a fully populated product with unit of measurement symbols", async () => {
    const product = createFullyPopulatedProduct();
    const classification2 = createClassification({
      features: undefined
    });
    const classification1 = createClassification({
      code: "measurements",
      name: "Measurements",
      features: [
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.length",
          name: "Length",
          featureValues: [createFeatureValue({ code: undefined, value: "1" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.width",
          name: "width",
          featureValues: [createFeatureValue({ code: undefined, value: "2" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.height",
          name: "Height",
          featureValues: [createFeatureValue({ code: undefined, value: "3" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.thickness",
          name: "Thickness",
          featureValues: [createFeatureValue({ code: undefined, value: "4" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.volume",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.grossweight",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.netweight",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: {
            name: "milimeters",
            symbol: "mm",
            unitType: "metric"
          }
        }),
        createFeature({
          code: "bmiClassificationCatalog/1.0/measurements.weightperpallet",
          name: "Volume",
          featureValues: [createFeatureValue({ code: undefined, value: "5" })],
          featureUnit: undefined
        })
      ]
    });
    product.classifications = [classification1, classification2];
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("transforms a product with multiple variant options into multiple products", async () => {
    const product = createFullyPopulatedProduct({
      variantOptions: [
        createFullyPopulatedVariantOption({ code: "variant1" }),
        createFullyPopulatedVariantOption({ code: "variant2" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("ignores check approval status base products", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Check,
      variantOptions: [createVariantOption()]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toHaveLength(0);
  });

  it("ignores unapproved approval status base products", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Unapproved,
      variantOptions: [createVariantOption()]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toHaveLength(0);
  });

  it("ignores non-approved variant options", async () => {
    const product = createFullyPopulatedProduct({
      variantOptions: [
        createFullyPopulatedVariantOption({
          code: "variant1",
          approvalStatus: ApprovalStatus.Approved
        }),
        createFullyPopulatedVariantOption({
          code: "variant2",
          approvalStatus: ApprovalStatus.Check
        }),
        createFullyPopulatedVariantOption({
          code: "variant3",
          approvalStatus: ApprovalStatus.Unapproved
        }),
        createFullyPopulatedVariantOption({
          code: "variant3",
          approvalStatus: ApprovalStatus.Preview
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].relatedVariants).toHaveLength(0);
  });

  it("handles a product with documents but no categories", async () => {
    const product = createProduct({
      categories: undefined,
      assets: [createAsset()]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].documents[0]).toEqual({
      assetType: "ASSEMBLY_INSTRUCTIONS",
      extension: "pdf",
      fileSize: 10,
      format: "application/pdf",
      id: "2583923841",
      isLinkDocument: false,
      productBaseCode: "base-code",
      productCategories: [],
      productName: "name",
      realFileName: "real-file-name.pdf",
      title: "name",
      url: "http://localhost:8000"
    });
  });

  it("uses only the base scoring weight, not the variant scoring weight", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "scoringWeightAttributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
              featureValues: [createFeatureValue({ value: "100" })]
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "scoringWeightAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/scoringWeightAttributes.scoringweight",
                  featureValues: [createFeatureValue({ value: "50" })]
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].baseScoringWeight).toEqual(100);
  });

  it("ignores Channel categories", async () => {
    const brandCategory = createCategory({
      categoryType: "Brand"
    });
    const product = createProduct({
      categories: [
        brandCategory,
        createCategory({
          categoryType: "Channel"
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].categories).toEqual([brandCategory]);
  });

  it("filtered out categories without name from group", async () => {
    const parentCategory = createCategory({
      categoryType: "Category",
      code: "parent-category",
      name: "parent-category",
      parentCategoryCode: ""
    });
    const product = createProduct({
      categories: [
        parentCategory,
        createCategory({
          categoryType: "Category",
          code: "parent-category",
          name: undefined,
          parentCategoryCode: ""
        }),
        createCategory({
          categoryType: "Category",
          code: "child-category",
          name: "Child Category",
          parentCategoryCode: "parent-category"
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].groups).toEqual([
      {
        code: parentCategory.code,
        label: parentCategory.name
      }
    ]);
  });

  it("overwrites base classification features with variant classification features of the same feature code", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          name: "base classification name",
          features: [
            createFeature({
              name: "base feature name",
              featureValues: [createFeatureValue({ value: "base value" })]
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              name: "variant classification name",
              features: [
                createFeature({
                  name: "variant feature name",
                  featureValues: [
                    createFeatureValue({ value: "variant value" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].classifications).toEqual([
      {
        name: "variant classification name",
        features: [
          {
            name: "variant feature name",
            value: "variant value symbol"
          }
        ]
      }
    ]);
  });

  it("handles classifications and features being only on either the base or variant", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "base-only",
          name: "base only classification name",
          features: [
            createFeature({
              code: "base-only-feature",
              name: "base only feature name"
            })
          ]
        }),
        createClassification({
          code: "both",
          name: "both base classification name",
          features: [
            createFeature({
              code: "base-feature"
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "variant-only",
              name: "variant only classification name",
              features: [
                createFeature({
                  code: "variant-only-feature",
                  name: "variant only feature name"
                })
              ]
            }),
            createClassification({
              code: "both",
              name: "both variant classification name",
              features: [
                createFeature({
                  code: "variant-feature",
                  name: "both variant feature name"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].classifications).toEqual([
      {
        features: [
          {
            name: "base only feature name",
            value: "value symbol"
          }
        ],
        name: "base only classification name"
      },
      {
        features: [
          {
            name: "both variant feature name",
            value: "value symbol"
          },
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "both variant classification name"
      },
      {
        features: [
          {
            name: "variant only feature name",
            value: "value symbol"
          }
        ],
        name: "variant only classification name"
      }
    ]);
  });

  it("ignores colourfamily classifications on classifications but keeps them on filters When there are more than one variants", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "appearanceAttributes",
          name: "Appearance",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
              name: "Colour",
              featureValues: [createFeatureValue({ value: "Rustic Red" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily",
              name: "Colour Family",
              featureValues: [createFeatureValue({ value: "Red" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.TextureFamily",
              name: "Texture Family",
              featureValues: [createFeatureValue({ value: "Matt" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.VariantAttribute",
              name: "Variant Attribute",
              featureValues: [
                createFeatureValue({ value: "Rustic Red Matt 1x2x3x4x5" })
              ],
              featureUnit: undefined
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              name: "Appearance",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                  name: "Colour",
                  featureValues: [createFeatureValue({ value: "Rustic Red" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily",
                  name: "Colour Family",
                  featureValues: [createFeatureValue({ value: "Red" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.TextureFamily",
                  name: "Texture Family",
                  featureValues: [createFeatureValue({ value: "Matt" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.VariantAttribute",
                  name: "Variant Attribute",
                  featureValues: [
                    createFeatureValue({ value: "Rustic Red Matt 1x2x3x4x5" })
                  ],
                  featureUnit: undefined
                })
              ]
            })
          ]
        }),
        createVariantOption({
          classifications: [
            createClassification({
              code: "appearanceAttributes",
              name: "Appearance",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.colour",
                  name: "Colour",
                  featureValues: [createFeatureValue({ value: "Rustic Red" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily",
                  name: "Colour Family",
                  featureValues: [createFeatureValue({ value: "Red" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.TextureFamily",
                  name: "Texture Family",
                  featureValues: [createFeatureValue({ value: "Matt" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/appearanceAttributes.VariantAttribute",
                  name: "Variant Attribute",
                  featureValues: [
                    createFeatureValue({ value: "Rustic Red Matt 1x2x3x4x5" })
                  ],
                  featureUnit: undefined
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].filters).toEqual([
      {
        filterCode: "appearanceAttributes.colour",
        name: "Colour",
        value: "Rustic Red",
        code: "code",
        groupLabel: "Colour",
        parentFilterCode: "",
        isCategory: false
      },
      {
        filterCode: "appearanceAttributes.colourfamily",
        name: "Colour Family",
        value: "Red",
        code: "code",
        groupLabel: "Colour Family",
        parentFilterCode: "",
        isCategory: false
      },
      {
        filterCode: "appearanceAttributes.TextureFamily",
        name: "Texture Family",
        value: "Matt",
        code: "code",
        groupLabel: "Texture Family",
        parentFilterCode: "",
        isCategory: false
      },
      {
        filterCode: "appearanceAttributes.VariantAttribute",
        name: "Variant Attribute",
        value: "Rustic Red Matt 1x2x3x4x5",
        code: "code",
        groupLabel: "Variant Attribute",
        parentFilterCode: "",
        isCategory: false
      },
      {
        filterCode: "Category",
        name: "name",
        value: "parent-category-code",
        code: "parent-category-code",
        parentFilterCode: "",
        isCategory: true
      },
      {
        filterCode: "Category",
        name: "name",
        value: "code",
        code: "code",
        parentFilterCode: "parent-category-code",
        groupLabel: "name",
        isCategory: true
      },
      {
        filterCode: "ProductFamily",
        name: "name",
        value: "code",
        code: "code",
        parentFilterCode: "parent-category-code",
        groupLabel: "name",
        isCategory: true
      },
      {
        filterCode: "ProductLine",
        name: "name",
        value: "code",
        code: "code",
        parentFilterCode: "parent-category-code",
        groupLabel: "name",
        isCategory: true
      },
      {
        filterCode: "Category",
        name: "name",
        value: "BMI-brand-code",
        code: "BMI-brand-code",
        parentFilterCode: "BMI_Brands",
        isCategory: true
      }
    ]);
    expect(transformedProducts[0].classifications).toEqual([
      {
        features: [
          {
            name: "Colour",
            value: "Rustic Red"
          },
          {
            name: "Texture Family",
            value: "Matt"
          },
          {
            name: "Variant Attribute",
            value: "Rustic Red Matt 1x2x3x4x5"
          }
        ],
        name: "Appearance"
      }
    ]);
  });

  it("handles classifications not being present on the related variants", async () => {
    const product = createProduct({
      classifications: undefined,
      variantOptions: [
        createVariantOption({
          code: "variant1",
          classifications: undefined
        }),
        createVariantOption({
          code: "variant2",
          classifications: undefined
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toHaveLength(2);
  });

  it("handles classifications without features", async () => {
    const product = createProduct({
      classifications: [createClassification({ features: undefined })],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          classifications: undefined
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].filters).toEqual([
      {
        code: "parent-category-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "",
        value: "parent-category-code"
      },
      {
        code: "code",
        filterCode: "Category",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductFamily",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductLine",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "BMI-brand-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "BMI_Brands",
        value: "BMI-brand-code"
      }
    ]);
  });

  it("handles classifications with empty list of features", async () => {
    const product = createProduct({
      classifications: [createClassification({ features: [] })],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          classifications: []
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].filters).toEqual([
      {
        code: "parent-category-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "",
        value: "parent-category-code"
      },
      {
        code: "code",
        filterCode: "Category",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductFamily",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductLine",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "BMI-brand-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "BMI_Brands",
        value: "BMI-brand-code"
      }
    ]);
  });

  it("handles classifications with feature filter codes without `/`", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          features: [createFeature({ code: "featureCodeWithoutSlash" })]
        })
      ],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          classifications: undefined
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toHaveLength(1);
    expect(transformedProducts[0].filters).toEqual([
      {
        code: "code",
        filterCode: "featureCodeWithoutSlash",
        groupLabel: "name",
        isCategory: false,
        name: "name",
        parentFilterCode: "",
        unit: "symbol",
        value: "value"
      },
      {
        code: "parent-category-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "",
        value: "parent-category-code"
      },
      {
        code: "code",
        filterCode: "Category",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductFamily",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "code",
        filterCode: "ProductLine",
        groupLabel: "name",
        isCategory: true,
        name: "name",
        parentFilterCode: "parent-category-code",
        value: "code"
      },
      {
        code: "BMI-brand-code",
        filterCode: "Category",
        groupLabel: undefined,
        isCategory: true,
        name: "name",
        parentFilterCode: "BMI_Brands",
        value: "BMI-brand-code"
      }
    ]);
  });

  it("use variant long description for description", async () => {
    const product = createProduct({
      description: "base description",
      variantOptions: [
        createVariantOption({
          longDescription: "variant long description"
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].description).toEqual(
      "variant long description"
    );
  });

  it("use base description for description if variant long description is undefined", async () => {
    const product = createProduct({
      description: "base description",
      variantOptions: [
        createVariantOption({
          longDescription: undefined
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].description).toEqual("base description");
  });

  it("set isSampleOrderAllowed to true if variant is true", async () => {
    const product = createProduct({
      isSampleOrderAllowed: false,
      variantOptions: [
        createVariantOption({
          isSampleOrderAllowed: true
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(true);
  });

  it("set isSampleOrderAllowed to false if variant is false and base is true", async () => {
    const product = createProduct({
      isSampleOrderAllowed: true,
      variantOptions: [
        createVariantOption({
          isSampleOrderAllowed: false
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("set isSampleOrderAllowed to false if variant is undefined and base is undefined", async () => {
    const product = createProduct({
      isSampleOrderAllowed: undefined,
      variantOptions: [
        createVariantOption({
          isSampleOrderAllowed: undefined
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("set isSampleOrderAllowed to false if variant is true and base is true and ENABLE_SAMPLE_ORDERING is false", async () => {
    process.env.ENABLE_SAMPLE_ORDERING = "false";
    const product = createProduct({
      isSampleOrderAllowed: true,
      variantOptions: [
        createVariantOption({
          isSampleOrderAllowed: true
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("set isSampleOrderAllowed to false if variant is true and base is true and ENABLE_SAMPLE_ORDERING is not set", async () => {
    delete process.env.ENABLE_SAMPLE_ORDERING;
    const product = createProduct({
      isSampleOrderAllowed: true,
      variantOptions: [
        createVariantOption({
          isSampleOrderAllowed: true
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].isSampleOrderAllowed).toEqual(false);
  });

  it("use variant product benefits if available", async () => {
    const product = createProduct({
      productBenefits: ["base-product-benefit"],
      variantOptions: [
        createVariantOption({
          productBenefits: ["variant-product-benefit"]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].productBenefits).toEqual(
      product.variantOptions![0].productBenefits
    );
  });

  it("use variant product benefits if empty array", async () => {
    const product = createProduct({
      productBenefits: ["base-product-benefit"],
      variantOptions: [
        createVariantOption({
          productBenefits: []
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].productBenefits).toEqual(
      product.variantOptions![0].productBenefits
    );
  });

  it("use base product benefits if variant product variants isn't available", async () => {
    const product = createProduct({
      productBenefits: ["base-product-benefit"],
      variantOptions: [
        createVariantOption({
          productBenefits: undefined
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].productBenefits).toEqual(
      product.productBenefits
    );
  });

  it("handles classification without features", async () => {
    const classification = createClassification({ features: undefined });
    const product = createProduct({
      classifications: [classification],
      variantOptions: [
        createVariantOption({
          classifications: [classification]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].classifications).toEqual([]);
  });

  it("filters out unwanted classification features from base product", async () => {
    const product = createProduct({
      classifications: createIgnorableClassifications,
      variantOptions: [
        createVariantOption({
          classifications: []
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].classifications).toMatchSnapshot();
  });

  it("filters out unwanted classification features from variant", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: createIgnorableClassifications
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].classifications).toMatchSnapshot();
  });

  it("handles video asset without URL", async () => {
    const asset = createAsset({ assetType: "VIDEO", url: undefined });
    const product = createProduct({
      assets: [asset]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].videos).toEqual([
      {
        label: asset.name,
        previewMedia: null,
        subtitle: null,
        title: "",
        videoRatio: null,
        videoUrl: ""
      }
    ]);
  });

  it("handles video asset of just YouTube ID", async () => {
    const asset = createAsset({ assetType: "VIDEO", url: "3901c0ds7oo" });
    const product = createProduct({
      assets: [asset]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].videos).toEqual([
      {
        label: asset.name,
        previewMedia: null,
        subtitle: null,
        title: "",
        videoRatio: null,
        videoUrl: "https://www.youtube.com/watch?v=3901c0ds7oo"
      }
    ]);
  });

  it("handles brand category without an image", async () => {
    const brand = createCategory({ categoryType: "Brand", image: undefined });
    const product = createProduct({
      categories: [brand]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].brand).toEqual({
      code: brand.code,
      name: brand.name,
      logo: undefined
    });
  });

  it("handles products without images", async () => {
    const product = createProduct({
      images: undefined,
      variantOptions: [
        createVariantOption({
          code: "variant1",
          images: [
            createImage({
              assetType: "MASTER_IMAGE",
              format: undefined,
              url: "http://localhost:8000/variant1",
              name: "Variant 1 Image"
            }),
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Hero-Small-Desktop-Tablet",
              url: "http://localhost:8000/variant1-main"
            }),
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Color-Selector-Mobile",
              url: "http://localhost:8000/variant1-thumbnail"
            })
          ]
        }),
        createVariantOption({
          code: "variant2",
          images: [
            createImage({
              assetType: "MASTER_IMAGE",
              format: undefined,
              url: "http://localhost:8000/variant2",
              name: "Variant 2 Image"
            }),
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Hero-Small-Desktop-Tablet",
              url: "http://localhost:8000/variant2-main"
            }),
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Color-Selector-Mobile",
              url: "http://localhost:8000/variant2-thumbnail"
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].masterImage).toEqual({
      mainSource: "http://localhost:8000/variant1-main",
      thumbnail: "http://localhost:8000/variant1-thumbnail",
      altText: "Variant 1 Image"
    });
    expect(transformedProducts[0].relatedVariants[0].thumbnail).toEqual(
      "http://localhost:8000/variant2-thumbnail"
    );
    expect(transformedProducts[1].masterImage).toEqual({
      mainSource: "http://localhost:8000/variant2-main",
      thumbnail: "http://localhost:8000/variant2-thumbnail",
      altText: "Variant 2 Image"
    });
    expect(transformedProducts[1].relatedVariants[0].thumbnail).toEqual(
      "http://localhost:8000/variant1-thumbnail"
    );
  });

  it("handles variants without images", async () => {
    const product = createProduct({
      images: [
        createImage({
          assetType: "MASTER_IMAGE",
          format: undefined,
          url: "http://localhost:8000/main",
          name: "Image"
        }),
        createImage({
          assetType: "MASTER_IMAGE",
          format: "Product-Hero-Small-Desktop-Tablet",
          url: "http://localhost:8000/main"
        }),
        createImage({
          assetType: "MASTER_IMAGE",
          format: "Product-Color-Selector-Mobile",
          url: "http://localhost:8000/thumbnail"
        })
      ],
      variantOptions: [
        createVariantOption({ code: "variant1", images: undefined }),
        createVariantOption({ code: "variant2", images: undefined })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].masterImage).toEqual({
      mainSource: "http://localhost:8000/main",
      thumbnail: "http://localhost:8000/thumbnail",
      altText: "Image"
    });
    expect(transformedProducts[0].relatedVariants[0].thumbnail).toEqual(
      "http://localhost:8000/thumbnail"
    );
    expect(transformedProducts[1].masterImage).toEqual({
      mainSource: "http://localhost:8000/main",
      thumbnail: "http://localhost:8000/thumbnail",
      altText: "Image"
    });
    expect(transformedProducts[1].relatedVariants[0].thumbnail).toEqual(
      "http://localhost:8000/thumbnail"
    );
  });

  it("handles missing master images", async () => {
    const product = createProduct({
      images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
        }),
        createVariantOption({
          code: "variant2",
          images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].masterImage).toEqual(undefined);
    expect(transformedProducts[0].relatedVariants[0].thumbnail).toEqual(
      undefined
    );
    expect(transformedProducts[1].masterImage).toEqual(undefined);
    expect(transformedProducts[1].relatedVariants[0].thumbnail).toEqual(
      undefined
    );
  });

  it("handles missing master image without format", async () => {
    const product = createProduct({
      images: [
        createImage({
          assetType: "MASTER_IMAGE",
          format: "Product-Hero-Small-Desktop-Tablet"
        }),
        createImage({
          assetType: "MASTER_IMAGE",
          format: "Product-Color-Selector-Mobile"
        })
      ],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          images: [
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Hero-Small-Desktop-Tablet"
            }),
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Color-Selector-Mobile"
            })
          ]
        }),
        createVariantOption({
          code: "variant2",
          images: [
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Hero-Small-Desktop-Tablet"
            }),
            createImage({
              assetType: "MASTER_IMAGE",
              format: "Product-Color-Selector-Mobile"
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].masterImage).toEqual({
      mainSource: "http://localhost:8000",
      thumbnail: "http://localhost:8000",
      altText: "name"
    });
    expect(transformedProducts[0].relatedVariants[0].thumbnail).toEqual(
      "http://localhost:8000"
    );
    expect(transformedProducts[1].relatedVariants[0].thumbnail).toEqual(
      "http://localhost:8000"
    );
  });

  it("handles missing gallery images", async () => {
    const product = createProduct({
      images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
        }),
        createVariantOption({
          code: "variant2",
          images: [createImage({ assetType: "TECHNICAL_DRAWINGS" })]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].galleryImages).toEqual([]);
  });

  it("handles gallery images with missing image and altText without format", async () => {
    const product = createProduct({
      images: [
        createImage({
          assetType: "GALLERY",
          format: "Product-Hero-Small-Desktop-Tablet"
        }),
        createImage({
          assetType: "GALLERY",
          format: "Product-Color-Selector-Mobile"
        })
      ],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          images: [
            createImage({
              assetType: "GALLERY",
              format: "Product-Hero-Small-Desktop-Tablet"
            }),
            createImage({
              assetType: "GALLERY",
              format: "Product-Color-Selector-Mobile"
            })
          ]
        }),
        createVariantOption({
          code: "variant2",
          images: [
            createImage({
              assetType: "GALLERY",
              format: "Product-Hero-Small-Desktop-Tablet"
            }),
            createImage({
              assetType: "GALLERY",
              format: "Product-Color-Selector-Mobile"
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].galleryImages).toEqual([
      {
        mainSource: "http://localhost:8000",
        thumbnail: "http://localhost:8000",
        altText: "name"
      }
    ]);
  });

  it("handles measurements with different unit symbols", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: "mm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "3" })],
                  featureUnit: createFeatureUnit({ symbol: "mm" })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "4" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].measurements.label).toEqual("4cm x 3mm");
  });

  it("handles measurements with missing featureUnit", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: undefined
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "3" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "4" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.height",
                  featureValues: [createFeatureValue({ value: "5" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.thickness",
                  featureValues: [createFeatureValue({ value: "6" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.volume",
                  featureValues: [createFeatureValue({ value: "7" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                  featureValues: [createFeatureValue({ value: "8" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                  featureValues: [createFeatureValue({ value: "9" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                  featureValues: [createFeatureValue({ value: "10" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                  featureValues: [createFeatureValue({ value: "11" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                  featureValues: [createFeatureValue({ value: "12" })],
                  featureUnit: undefined
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].measurements.label).toEqual("4x3x5x6");
    expect(transformedProducts[0].measurements.length!.unit).toEqual("");
    expect(transformedProducts[0].measurements.width!.unit).toEqual("");
    expect(transformedProducts[0].measurements.height!.unit).toEqual("");
    expect(transformedProducts[0].measurements.thickness!.unit).toEqual("");
    expect(transformedProducts[0].measurements.volume!.unit).toEqual("");
    expect(transformedProducts[0].weight.grossWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.netWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPallet!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPiece!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerSqm!.unit).toEqual("");
  });

  it("handles measurements with missing unit symbols", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: undefined })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: createFeatureUnit({ symbol: undefined })
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "3" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "4" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.height",
                  featureValues: [createFeatureValue({ value: "5" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.thickness",
                  featureValues: [createFeatureValue({ value: "6" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.volume",
                  featureValues: [createFeatureValue({ value: "7" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                  featureValues: [createFeatureValue({ value: "8" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                  featureValues: [createFeatureValue({ value: "9" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                  featureValues: [createFeatureValue({ value: "10" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                  featureValues: [createFeatureValue({ value: "11" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                  featureValues: [createFeatureValue({ value: "11" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].measurements.label).toEqual("4x3x5x6");
    expect(transformedProducts[0].measurements.length!.unit).toEqual("");
    expect(transformedProducts[0].measurements.width!.unit).toEqual("");
    expect(transformedProducts[0].measurements.height!.unit).toEqual("");
    expect(transformedProducts[0].measurements.thickness!.unit).toEqual("");
    expect(transformedProducts[0].measurements.volume!.unit).toEqual("");
    expect(transformedProducts[0].weight.grossWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.netWeight!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPallet!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerPiece!.unit).toEqual("");
    expect(transformedProducts[0].weight.weightPerSqm!.unit).toEqual("");
  });

  it("handles measurements on related variants with different unit symbols", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: "mm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "3" })],
                  featureUnit: createFeatureUnit({ symbol: "mm" })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "4" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                })
              ]
            })
          ]
        }),
        createVariantOption({
          code: "variant2",
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "5" })],
                  featureUnit: createFeatureUnit({ symbol: "mm" })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "6" })],
                  featureUnit: createFeatureUnit({ symbol: "cm" })
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(
      transformedProducts[0].relatedVariants[0].measurements.label
    ).toEqual("6cm x 5mm");
  });

  it("handles measurements on related variants with missing featureUnit", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: undefined
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "3" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "4" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.height",
                  featureValues: [createFeatureValue({ value: "5" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.thickness",
                  featureValues: [createFeatureValue({ value: "6" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.volume",
                  featureValues: [createFeatureValue({ value: "7" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                  featureValues: [createFeatureValue({ value: "8" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                  featureValues: [createFeatureValue({ value: "9" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                  featureValues: [createFeatureValue({ value: "10" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                  featureValues: [createFeatureValue({ value: "11" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                  featureValues: [createFeatureValue({ value: "12" })],
                  featureUnit: undefined
                })
              ]
            })
          ]
        }),
        createVariantOption({
          code: "variant2",
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "13" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "14" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.height",
                  featureValues: [createFeatureValue({ value: "15" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.thickness",
                  featureValues: [createFeatureValue({ value: "16" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.volume",
                  featureValues: [createFeatureValue({ value: "17" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                  featureValues: [createFeatureValue({ value: "18" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                  featureValues: [createFeatureValue({ value: "19" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                  featureValues: [createFeatureValue({ value: "20" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                  featureValues: [createFeatureValue({ value: "21" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                  featureValues: [createFeatureValue({ value: "22" })],
                  featureUnit: undefined
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(
      transformedProducts[0].relatedVariants[0].measurements.label
    ).toEqual("14x13x15x16");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.length!.unit
    ).toEqual("");

    expect(
      transformedProducts[0].relatedVariants[0].measurements.width!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.height!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.thickness!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.volume!.unit
    ).toEqual("");
  });

  it("handles measurements on related varaints with missing unit symbols", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: undefined })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: createFeatureUnit({ symbol: undefined })
            })
          ]
        })
      ],
      variantOptions: [
        createVariantOption({
          code: "variant1",
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "3" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "4" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.height",
                  featureValues: [createFeatureValue({ value: "5" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.thickness",
                  featureValues: [createFeatureValue({ value: "6" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.volume",
                  featureValues: [createFeatureValue({ value: "7" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                  featureValues: [createFeatureValue({ value: "8" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                  featureValues: [createFeatureValue({ value: "9" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                  featureValues: [createFeatureValue({ value: "10" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                  featureValues: [createFeatureValue({ value: "11" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                  featureValues: [createFeatureValue({ value: "12" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                })
              ]
            })
          ]
        }),
        createVariantOption({
          code: "variant2",
          classifications: [
            createClassification({
              code: "measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.length",
                  featureValues: [createFeatureValue({ value: "13" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.width",
                  featureValues: [createFeatureValue({ value: "14" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.height",
                  featureValues: [createFeatureValue({ value: "15" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.thickness",
                  featureValues: [createFeatureValue({ value: "16" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/measurements.volume",
                  featureValues: [createFeatureValue({ value: "17" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.grossweight",
                  featureValues: [createFeatureValue({ value: "18" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                  featureValues: [createFeatureValue({ value: "19" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpallet",
                  featureValues: [createFeatureValue({ value: "20" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightperpiece",
                  featureValues: [createFeatureValue({ value: "21" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.weightpersqm",
                  featureValues: [createFeatureValue({ value: "22" })],
                  featureUnit: createFeatureUnit({ symbol: undefined })
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(
      transformedProducts[0].relatedVariants[0].measurements.label
    ).toEqual("14x13x15x16");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.length!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.width!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.height!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.thickness!.unit
    ).toEqual("");
    expect(
      transformedProducts[0].relatedVariants[0].measurements.volume!.unit
    ).toEqual("");
  });

  it("creates measurements label without length", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.height",
              featureValues: [createFeatureValue({ value: "3" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.thickness",
              featureValues: [createFeatureValue({ value: "4" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].measurements.label).toEqual("2x3x4cm");
  });

  it("creates measurements label without width", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.height",
              featureValues: [createFeatureValue({ value: "3" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.thickness",
              featureValues: [createFeatureValue({ value: "4" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].measurements.label).toEqual("1x3x4cm");
  });

  it("creates measurements label without height", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.thickness",
              featureValues: [createFeatureValue({ value: "4" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].measurements.label).toEqual("2x1x4cm");
  });

  it("creates measurements label without thickness", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureValues: [createFeatureValue({ value: "1" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureValues: [createFeatureValue({ value: "2" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/measurements.height",
              featureValues: [createFeatureValue({ value: "3" })],
              featureUnit: createFeatureUnit({ symbol: "cm" })
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].measurements.label).toEqual("2x1x3cm");
  });

  it("creates path from variant attribute if variant attrubite present and ENABLE_PDP_VARIANT_ATTRIBUTE_URL is true", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "true";

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-diameter-40mm-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-diameter-40mm-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-diameter-40mm-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-diameter-40mm-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from colour, texture family and materials if variant attrubite not present and ENABLE_PDP_VARIANT_ATTRIBUTE_URL is true", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "true";

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from colour, texture family and materials if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is false", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "false";

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from colour, texture family and materials if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from just colour if texture family and materials not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-black-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-black-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-black-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from just texture family if colour and materials not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-gloss-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-gloss-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-gloss-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-gloss-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path from just materials if colour and texture family not provided if ENABLE_PDP_VARIANT_ATTRIBUTE_URL is not set", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    delete process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-clay-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-clay-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-clay-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-clay-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path using the product name if variant name is not present", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "false";

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: undefined }),
        createVariantOption({ code: "variant-code-2", name: undefined })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  it("creates path using the product name if variant name is present", async () => {
    const originalEnablePdpVariantAttributeUrl =
      process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL;
    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL = "false";

    const product = createProduct({
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
        createVariantOption({ code: "variant-code-1", name: "Variant Name" }),
        createVariantOption({ code: "variant-code-2", name: "Variant Name" })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[0].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].path).toEqual(
      `/p/product-name-black-gloss-clay-2669911658`
    );
    expect(transformedProducts[1].relatedVariants[0].path).toEqual(
      `/p/product-name-black-gloss-clay-2526773877`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });

  // TODO: Remove test case - DXB-3449
  it("is case-insensitive for base product classification codes", async () => {
    const product = createFullyPopulatedProduct({
      classifications: [
        createClassification({
          code: "ScoringWeightAttributes",
          name: "Scoring",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/ScoringWeightAttributes.ScoringWeight",
              name: "Scoring Weight",
              featureValues: [
                createFeatureValue({ code: undefined, value: "100" })
              ]
            })
          ]
        }),
        createClassification({
          code: "AppearanceAttributes",
          name: "Appearance",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/AppearanceAttributes.Colour",
              name: "Colour",
              featureValues: [createFeatureValue({ value: "Rustic Red" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/AppearanceAttributes.ColourFamily",
              name: "Colour Family",
              featureValues: [createFeatureValue({ value: "Red" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/AppearanceAttributes.TextureFamily",
              name: "Texture Family",
              featureValues: [createFeatureValue({ value: "Matt" })],
              featureUnit: undefined
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/AppearanceAttributes.VariantAttribute",
              name: "Variant Attribute",
              featureValues: [
                createFeatureValue({ value: "Rustic Red Matt 1x2x3x4x5" })
              ],
              featureUnit: undefined
            })
          ]
        }),
        createClassification({
          code: "GeneralInformation",
          name: "General",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/GeneralInformation.Materials",
              name: "Material",
              featureValues: [createFeatureValue({ value: "Clay" })],
              featureUnit: undefined
            })
          ]
        }),
        createClassification({
          code: "Measurements",
          name: "Measurements",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/Measurements.Length",
              name: "Length",
              featureValues: [
                createFeatureValue({ code: undefined, value: "1" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/Measurements.Width",
              name: "width",
              featureValues: [
                createFeatureValue({ code: undefined, value: "2" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/Measurements.Height",
              name: "Height",
              featureValues: [
                createFeatureValue({ code: undefined, value: "3" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/Measurements.Thickness",
              name: "Thickness",
              featureValues: [
                createFeatureValue({ code: undefined, value: "4" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/Measurements.Volume",
              name: "Volume",
              featureValues: [
                createFeatureValue({ code: undefined, value: "5" })
              ]
            })
          ]
        }),
        createClassification({
          code: "WeightAttributes",
          name: "Weight",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/WeightAttributes.GrossWeight",
              featureValues: [
                createFeatureValue({ code: undefined, value: "1" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/WeightAttributes.NetWeight",
              featureValues: [
                createFeatureValue({ code: undefined, value: "2" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/WeightAttributes.WeightPerPallet",
              featureValues: [
                createFeatureValue({ code: undefined, value: "3" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/WeightAttributes.WeightPerPiece",
              featureValues: [
                createFeatureValue({ code: undefined, value: "4" })
              ]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/WeightAttributes.WeightPerSqm",
              featureValues: [
                createFeatureValue({ code: undefined, value: "5" })
              ]
            })
          ]
        })
      ],
      variantOptions: [
        createFullyPopulatedVariantOption({
          classifications: []
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  // TODO: Remove test case - DXB-3449
  it("is case-insensitive for varaint option classification codes", async () => {
    const product = createFullyPopulatedProduct({
      classifications: [],
      variantOptions: [
        createFullyPopulatedVariantOption({
          classifications: [
            createClassification({
              code: "ScoringWeightAttributes",
              name: "Scoring",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/ScoringWeightAttributes.ScoringWeight",
                  name: "Scoring Weight",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "10" })
                  ]
                })
              ]
            }),
            createClassification({
              code: "AppearanceAttributes",
              name: "Appearance",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/AppearanceAttributes.Colour",
                  name: "Colour",
                  featureValues: [
                    createFeatureValue({ value: "Shadow Black" })
                  ],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/AppearanceAttributes.ColourFamily",
                  name: "Colour Family",
                  featureValues: [createFeatureValue({ value: "Black" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/AppearanceAttributes.TextureFamily",
                  name: "Texture Family",
                  featureValues: [createFeatureValue({ value: "Gloss" })],
                  featureUnit: undefined
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/AppearanceAttributes.VariantAttribute",
                  name: "Variant Attribute",
                  featureValues: [
                    createFeatureValue({
                      value: "Shadow Black Gloss 6x7x8x9x10"
                    })
                  ],
                  featureUnit: undefined
                })
              ]
            }),
            createClassification({
              code: "GeneralInformation",
              name: "General",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/GeneralInformation.Materials",
                  name: "Material",
                  featureValues: [createFeatureValue({ value: "Concrete" })],
                  featureUnit: undefined
                })
              ]
            }),
            createClassification({
              code: "Measurements",
              name: "Measurements",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/Measurements.Length",
                  name: "Length",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "6" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/Measurements.Width",
                  name: "Width",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "7" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/Measurements.Height",
                  name: "Height",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "8" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/Measurements.Thickness",
                  name: "Thickness",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "9" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/Measurements.Volume",
                  name: "Volume",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "10" })
                  ]
                })
              ]
            }),
            createClassification({
              code: "WeightAttributes",
              name: "Weight",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/WeightAttributes.GrossWeight",
                  name: "Gross Weight",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "6" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/weightAttributes.netweight",
                  name: "Net Weight",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "7" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/WeightAttributes.WeightPerPallet",
                  name: "Weight per Pallet",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "8" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/WeightAttributes.WeightPerPiece",
                  name: "Weight per Piece",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "9" })
                  ]
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/WeightAttributes.WeightPerSqm",
                  name: "Weight per sq m",
                  featureValues: [
                    createFeatureValue({ code: undefined, value: "10" })
                  ]
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchSnapshot();
  });

  it("ignore bimAttributes classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "bimAttributes",
              name: "bimAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/bimAttributes.productPageURL",
                  name: "bimAttributes"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore bimAttributes classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "bimAttributes",
          name: "bimAttributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/bimAttributes.productPageURL",
              name: "bimAttributes"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore fabDisProductInformation classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "fabDisProductInformation",
              name: "fabDisProductInformation",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisProductInformation.MANUFACTURER",
                  name: "fabDisProductInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisProductInformation.IDENTIFIER30",
                  name: "fabDisProductInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisProductInformation.IDENTIFIER240",
                  name: "fabDisProductInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisProductInformation.DOUANE",
                  name: "fabDisProductInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisProductInformation.SECT",
                  name: "fabDisProductInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisProductInformation.SECTU",
                  name: "fabDisProductInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisProductInformation.MADE",
                  name: "fabDisProductInformation"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore fabDisProductInformation classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "fabDisProductInformation",
          name: "fabDisProductInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisProductInformation.MANUFACTURER",
              name: "fabDisProductInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisProductInformation.IDENTIFIER30",
              name: "fabDisProductInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisProductInformation.IDENTIFIER240",
              name: "fabDisProductInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisProductInformation.DOUANE",
              name: "fabDisProductInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisProductInformation.SECT",
              name: "fabDisProductInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisProductInformation.SECTU",
              name: "fabDisProductInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisProductInformation.MADE",
              name: "fabDisProductInformation"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore fabDisPricingInformation classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "fabDisPricingInformation",
              name: "fabDisPricingInformation",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.DATETARIF",
                  name: "fabDisPricingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.TARIFD",
                  name: "fabDisPricingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.QMC",
                  name: "fabDisPricingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.MUL",
                  name: "fabDisPricingInformation"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore fabDisPricingInformation classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "fabDisPricingInformation",
          name: "fabDisPricingInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.DATETARIF",
              name: "fabDisPricingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.TARIFD",
              name: "fabDisPricingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.QMC",
              name: "fabDisPricingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPricingInformation.MUL",
              name: "fabDisPricingInformation"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore fabDisOrderInformation classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "fabDisOrderInformation",
              name: "fabDisOrderInformation",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.UB",
                  name: "fabDisOrderInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.QMC",
                  name: "fabDisOrderInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.MUL",
                  name: "fabDisOrderInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.QMVT",
                  name: "fabDisOrderInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.ST",
                  name: "fabDisOrderInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.DELAY",
                  name: "fabDisOrderInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.DATESTA",
                  name: "fabDisOrderInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.DLSR",
                  name: "fabDisOrderInformation"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore fabDisOrderInformation classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "fabDisOrderInformation",
          name: "fabDisOrderInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.UB",
              name: "fabDisOrderInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.QMC",
              name: "fabDisOrderInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.MUL",
              name: "fabDisOrderInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.QMVT",
              name: "fabDisOrderInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.ST",
              name: "fabDisOrderInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.DELAY",
              name: "fabDisOrderInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.DATESTA",
              name: "fabDisOrderInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisOrderInformation.DLSR",
              name: "fabDisOrderInformation"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore fabDisSupplierAndDistributorInformation classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "fabDisSupplierAndDistributorInformation",
              name: "fabDisSupplierAndDistributorInformation",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.EDI",
                  name: "fabDisSupplierAndDistributorInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFANT",
                  name: "fabDisSupplierAndDistributorInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.DATEREC",
                  name: "fabDisSupplierAndDistributorInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFE",
                  name: "fabDisSupplierAndDistributorInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFNEW",
                  name: "fabDisSupplierAndDistributorInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFOLD",
                  name: "fabDisSupplierAndDistributorInformation"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore fabDisSupplierAndDistributorInformation classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "fabDisSupplierAndDistributorInformation",
          name: "fabDisSupplierAndDistributorInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.EDI",
              name: "fabDisSupplierAndDistributorInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFANT",
              name: "fabDisSupplierAndDistributorInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.DATEREC",
              name: "fabDisSupplierAndDistributorInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFE",
              name: "fabDisSupplierAndDistributorInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFNEW",
              name: "fabDisSupplierAndDistributorInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisSupplierAndDistributorInformation.REFOLD",
              name: "fabDisSupplierAndDistributorInformation"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore fabDisCategoryInformation classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "fabDisCategoryInformation",
              name: "fabDisCategoryInformation",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT1",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT1L",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT2",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT2L",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT3",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT3L",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT4",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT4L",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT5",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT5L",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM1",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM1L",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM2",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM2L",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM3",
                  name: "fabDisCategoryInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM3L",
                  name: "fabDisCategoryInformation"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore fabDisCategoryInformation classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "fabDisCategoryInformation",
          name: "fabDisCategoryInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT1",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT1L",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT2",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT2L",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT3",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT3L",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT4",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT4L",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT5",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.MKT5L",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM1",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM1L",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM2",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM2L",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM3",
              name: "fabDisCategoryInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisCategoryInformation.FAM3L",
              name: "fabDisCategoryInformation"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore fabDisPackagingInformation classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "fabDisPackagingInformation",
              name: "fabDisPackagingInformation",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.QCT",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.GTIN14",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.HAUT",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.HAUTU",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.LARG",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.LARGU",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.PROF",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.PROFU",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.POIDS",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.POIDSU",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.VOL",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.VOLU",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.CONSI",
                  name: "fabDisPackagingInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.STACK",
                  name: "fabDisPackagingInformation"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore fabDisPackagingInformation classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "fabDisPackagingInformation",
          name: "fabDisPackagingInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.QCT",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.GTIN14",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.HAUT",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.HAUTU",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.LARG",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.LARGU",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.PROF",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.PROFU",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.POIDS",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.POIDSU",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.VOL",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.VOLU",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.CONSI",
              name: "fabDisPackagingInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisPackagingInformation.STACK",
              name: "fabDisPackagingInformation"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore fabDisAssetInformation classifications from variant product", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "fabDisAssetInformation",
              name: "fabDisAssetInformation",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.CODVAL",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.NUM",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.URL",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.URLT",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RTYP",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNUM",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNAT",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RCOD",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNBR",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RTEXTE",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RDATE",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RVAL",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RVU",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNOM",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RURL",
                  name: "fabDisAssetInformation"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RURLT",
                  name: "fabDisAssetInformation"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([]);
  });

  it("ignore fabDisAssetInformation classifications from product", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "fabDisAssetInformation",
          name: "fabDisAssetInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.CODVAL",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.NUM",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.URL",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.URLT",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RTYP",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNUM",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNAT",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RCOD",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNBR",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RTEXTE",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RDATE",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RVAL",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RVU",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RNOM",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RURL",
              name: "fabDisAssetInformation"
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/fabDisAssetInformation.RURLT",
              name: "fabDisAssetInformation"
            })
          ]
        })
      ],
      variantOptions: [createVariantOption()]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].classifications).toEqual([
      {
        features: [
          {
            name: "name",
            value: "value symbol"
          }
        ],
        name: "name"
      }
    ]);
  });

  it("ignore webtools-related classifications", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "tilesAttributes",
              name: "tilesAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.brokenBond",
                  name: "Broken Bond"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.eaveGauge",
                  name: "Eave gauge"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.eaveGaugeStartAngle",
                  name: "Eave Gauge Start Angle"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.eaveGaugeEndAngle",
                  name: "Eave Gage End Angle"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.maxGaugeStartAngle",
                  name: "Max Gauge Start Angle"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.maxGaugeEndAngle",
                  name: "Max Gauge End Angle"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpace",
                  name: "Ridge Space"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpaceStartAngle",
                  name: "Ridge Space Start Angle"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.ridgeSpaceEndAngle",
                  name: "Ridge Space End Angle"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.verticalOverlap",
                  name: "Vertical Overlap"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.horizontalOverlap",
                  name: "Horizontal Overlap"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.horizontalOffset",
                  name: "Horizontal Offset"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.snowFenceActive",
                  name: "Show Fence Active"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.largeTile",
                  name: "Large Tile"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.thicknessReduction",
                  name: "Thickness Reduction"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.invert",
                  name: "Invert"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.invertY",
                  name: "invertY"
                })
              ]
            }),
            createClassification({
              code: "underlayAttributes",
              name: "underlayAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/underlayAttributes.minSupportedPitch",
                  name: "Minimum supported pitch"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/underlayAttributes.overlap",
                  name: "Overlap"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].classifications).toEqual([]);
  });

  it("returns false for isVisualiserAvailable if needed category doesn't exist", async () => {
    const product = createProduct({
      categories: []
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].isVisualiserAvailable).toBe(false);
  });

  it("returns false for isVisualiserAvailable if product doesn't have visualiserAssets", async () => {
    const product = createProduct({
      classifications: [],
      visualiserAssets: undefined,
      categories: [
        createCategory({ categoryType: "Channel", code: "VISUALISER" })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].isVisualiserAvailable).toBe(false);
  });

  it("returns false for isVisualiserAvailable if product doesn't have requied visualiserAssets", async () => {
    const product = createProduct({
      classifications: [],
      visualiserAssets: [createAsset({ assetType: "CERTIFICATES" })],
      categories: [
        createCategory({ categoryType: "Channel", code: "VISUALISER" })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].isVisualiserAvailable).toBe(false);
  });

  it("returns false for isVisualiserAvailable if generalInformation.classification doesn't exist", async () => {
    const product = createProduct({
      classifications: [],
      visualiserAssets: [
        createAsset({ assetType: "HIGH_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "LOW_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "METALLIC_ROUGHNESS_MAP_REFERENCE" }),
        createAsset({ assetType: "NORMAL_MAP_REFERENCE" }),
        createAsset({ assetType: "RIDGE_REFERENCE" })
      ],
      categories: [
        createCategory({ categoryType: "Channel", code: "VISUALISER" })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].isVisualiserAvailable).toBe(false);
  });

  it("returns false for isVisualiserAvailable if generalInformation doesn't have classification feature", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "generalInformation",
          name: "generalInformation",
          features: undefined
        })
      ],
      visualiserAssets: [
        createAsset({ assetType: "HIGH_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "LOW_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "METALLIC_ROUGHNESS_MAP_REFERENCE" }),
        createAsset({ assetType: "NORMAL_MAP_REFERENCE" }),
        createAsset({ assetType: "RIDGE_REFERENCE" }),
        createAsset({ assetType: "DIFFUSE_MAP_REFERENCE" })
      ],
      categories: [
        createCategory({ categoryType: "Channel", code: "VISUALISER" })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].isVisualiserAvailable).toBe(false);
  });

  it("returns false for isVisualiserAvailable if generalInformation.classification !==  clay/metal/concrete", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "generalInformation",
          name: "generalInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/generalInformation.classification",
              name: "generalInformation",
              featureValues: [{ code: "code", value: "mock" }]
            })
          ]
        })
      ],
      categories: [
        createCategory({ categoryType: "Channel", code: "VISUALISER" })
      ],
      visualiserAssets: [
        createAsset({ assetType: "HIGH_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "LOW_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "METALLIC_ROUGHNESS_MAP_REFERENCE" }),
        createAsset({ assetType: "NORMAL_MAP_REFERENCE" }),
        createAsset({ assetType: "RIDGE_REFERENCE" }),
        createAsset({ assetType: "DIFFUSE_MAP_REFERENCE" })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].isVisualiserAvailable).toBe(false);
  });

  it("returns true for isVisualiserAvailable", async () => {
    const product = createProduct({
      classifications: [
        createClassification({
          code: "generalInformation",
          name: "generalInformation",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/generalInformation.classification",
              name: "generalInformation",
              featureValues: [{ code: "code", value: "clay" }]
            })
          ]
        }),
        createClassification({
          code: "tilesAttributes",
          name: "Tiles Attributes",
          features: [
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.verticalOverlap",
              name: "tilesAttributes",
              featureValues: [{ value: "10" }]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.horizontalOverlap",
              name: "tilesAttributes",
              featureValues: [{ value: "10" }]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.horizontalOffset",
              name: "tilesAttributes",
              featureValues: [{ value: "10" }]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.snowFenceActive",
              name: "tilesAttributes",
              featureValues: [{ value: "10" }]
            }),
            createFeature({
              code: "bmiClassificationCatalog/1.0/tilesAttributes.largeTile",
              name: "tilesAttributes",
              featureValues: [{ value: "true" }]
            })
          ]
        })
      ],
      categories: [
        createCategory({ categoryType: "Channel", code: "VISUALISER" })
      ],
      visualiserAssets: [
        createAsset({ assetType: "HIGH_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "LOW_DETAIL_MESH_REFERENCE" }),
        createAsset({ assetType: "METALLIC_ROUGHNESS_MAP_REFERENCE" }),
        createAsset({ assetType: "NORMAL_MAP_REFERENCE" }),
        createAsset({ assetType: "RIDGE_REFERENCE" }),
        createAsset({ assetType: "DIFFUSE_MAP_REFERENCE" })
      ]
    });
    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].isVisualiserAvailable).toBe(true);
  });

  it("should ignore assets of base product if variant has assets", async () => {
    const product = createProduct({
      assets: [createAsset({ assetType: "AWARDS" })],
      variantOptions: [
        createVariantOption({
          assets: [createAsset({ assetType: "ASSEMBLY_INSTRUCTIONS" })]
        })
      ]
    });

    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].documents.length).toBe(1);
    expect(transformedProduct[0].documents[0].assetType).toBe(
      "ASSEMBLY_INSTRUCTIONS"
    );
  });

  it("should use assets of base product if variant has no assets", async () => {
    const product = createProduct({
      assets: [createAsset({ assetType: "AWARDS" })],
      variantOptions: [
        createVariantOption({
          assets: undefined
        })
      ]
    });

    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0].documents.length).toBe(1);
    expect(transformedProduct[0].documents[0].assetType).toBe("AWARDS");
  });

  it("returns assets-dependant fields correctly if both assets and categoryAssets fields are not defined", async () => {
    const product = createProduct({
      assets: undefined,
      categoryAssets: undefined,
      variantOptions: [
        createVariantOption({
          assets: undefined,
          categoryAssets: undefined
        })
      ]
    });

    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0]).toEqual(
      expect.objectContaining({
        documents: [],
        awardsAndCertificateDocuments: [],
        awardsAndCertificateImages: [],
        bimIframeUrl: undefined,
        fixingToolIframeUrl: undefined,
        guaranteesAndWarrantiesImages: [],
        guaranteesAndWarrantiesLinks: [],
        specificationIframeUrl: undefined,
        videos: []
      })
    );
  });

  it("should use categoryAssets of variant product if provided", async () => {
    const product = createProduct({
      categoryAssets: [createAsset({ name: "base product asset" })],
      variantOptions: [
        createVariantOption({
          categoryAssets: [
            createAsset({
              name: "awardsAndCertificateDocument",
              assetType: "AWARDS",
              url: "https://fake-url.pdf",
              realFileName: "fake-file-name.pdf"
            }),
            createAsset({
              name: "awardsAndCertificateImages",
              assetType: "CERTIFICATES",
              url: "https://fake-url.jpg",
              realFileName: "fake-file-name.jpg"
            }),
            createAsset({
              name: "BIM",
              assetType: "BIM",
              url: "https://fake-bim-iframe-url"
            }),
            createAsset({
              name: "fixingToolIframeUrl",
              assetType: "FIXING_TOOL",
              url: "https://fake-fixing-tool-iframe-url"
            }),
            createAsset({
              name: "guaranteesAndWarrantiesImages",
              assetType: "GUARANTIES",
              realFileName: "fake-guaranties-file-name.jpg"
            }),
            createAsset({
              name: "guaranteesAndWarrantiesLinks",
              assetType: "WARRANTIES",
              url: "https://fake-warranties-url",
              realFileName: undefined
            }),
            createAsset({
              name: "specificationIframeUrl",
              assetType: "SPECIFICATION",
              url: "https://fake-specification-iframe-url"
            }),
            createAsset({
              name: "video",
              assetType: "VIDEO",
              url: "https://fake-video-url"
            })
          ]
        })
      ]
    });

    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0]).toEqual(
      expect.objectContaining({
        awardsAndCertificateDocuments: [
          {
            allowedToDownload: true,
            assetType: "AWARDS",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "awardsAndCertificateDocument",
            realFileName: "fake-file-name.pdf",
            url: "https://fake-url.pdf"
          }
        ],
        awardsAndCertificateImages: [
          {
            allowedToDownload: true,
            assetType: "CERTIFICATES",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "awardsAndCertificateImages",
            realFileName: "fake-file-name.jpg",
            url: "https://fake-url.jpg"
          }
        ],
        bimIframeUrl: "https://fake-bim-iframe-url",
        fixingToolIframeUrl: "https://fake-fixing-tool-iframe-url",
        guaranteesAndWarrantiesImages: [
          {
            allowedToDownload: true,
            assetType: "GUARANTIES",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "guaranteesAndWarrantiesImages",
            realFileName: "fake-guaranties-file-name.jpg",
            url: "http://localhost:8000"
          }
        ],
        guaranteesAndWarrantiesLinks: [
          {
            allowedToDownload: true,
            assetType: "WARRANTIES",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "guaranteesAndWarrantiesLinks",
            realFileName: undefined,
            url: "https://fake-warranties-url"
          }
        ],
        specificationIframeUrl: "https://fake-specification-iframe-url",
        videos: [
          {
            label: "video",
            previewMedia: null,
            subtitle: null,
            title: "",
            videoRatio: null,
            videoUrl: "https://fake-video-url"
          }
        ],
        documents: [
          {
            assetType: "AWARDS",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "2338814760",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "fake-file-name.pdf",
            title: "awardsAndCertificateDocument",
            url: "https://fake-url.pdf"
          },
          {
            assetType: "CERTIFICATES",
            extension: "jpg",
            fileSize: 10,
            format: "application/pdf",
            id: "3584779213",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "fake-file-name.jpg",
            title: "awardsAndCertificateImages",
            url: "https://fake-url.jpg"
          },
          {
            assetType: "BIM",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "4243930147",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "BIM",
            url: "https://fake-bim-iframe-url"
          },
          {
            assetType: "FIXING_TOOL",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "1918965534",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "fixingToolIframeUrl",
            url: "https://fake-fixing-tool-iframe-url"
          },
          {
            assetType: "GUARANTIES",
            extension: "jpg",
            fileSize: 10,
            format: "application/pdf",
            id: "2583923841",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "fake-guaranties-file-name.jpg",
            title: "guaranteesAndWarrantiesImages",
            url: "http://localhost:8000"
          },
          {
            assetType: "SPECIFICATION",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "532996341",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "specificationIframeUrl",
            url: "https://fake-specification-iframe-url"
          },
          {
            assetType: "VIDEO",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "976736365",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "video",
            url: "https://fake-video-url"
          }
        ]
      })
    );
  });

  it("should use categoryAssets of base product if categoryAssets of variant product are not provided", async () => {
    const product = createProduct({
      categoryAssets: [
        createAsset({
          name: "awardsAndCertificateDocument",
          assetType: "AWARDS",
          url: "https://fake-url.pdf",
          realFileName: "fake-file-name.pdf"
        }),
        createAsset({
          name: "awardsAndCertificateImages",
          assetType: "CERTIFICATES",
          url: "https://fake-url.jpg",
          realFileName: "fake-file-name.jpg"
        }),
        createAsset({
          name: "BIM",
          assetType: "BIM",
          url: "https://fake-bim-iframe-url"
        }),
        createAsset({
          name: "fixingToolIframeUrl",
          assetType: "FIXING_TOOL",
          url: "https://fake-fixing-tool-iframe-url"
        }),
        createAsset({
          name: "guaranteesAndWarrantiesImages",
          assetType: "GUARANTIES",
          realFileName: "fake-guaranties-file-name.jpg"
        }),
        createAsset({
          name: "guaranteesAndWarrantiesLinks",
          assetType: "WARRANTIES",
          url: "https://fake-warranties-url",
          realFileName: undefined
        }),
        createAsset({
          name: "specificationIframeUrl",
          assetType: "SPECIFICATION",
          url: "https://fake-specification-iframe-url"
        }),
        createAsset({
          name: "video",
          assetType: "VIDEO",
          url: "https://fake-video-url"
        })
      ],
      variantOptions: [
        createVariantOption({
          categoryAssets: undefined
        })
      ]
    });

    const transformedProduct = await transformProduct(product);
    expect(transformedProduct[0]).toEqual(
      expect.objectContaining({
        awardsAndCertificateDocuments: [
          {
            allowedToDownload: true,
            assetType: "AWARDS",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "awardsAndCertificateDocument",
            realFileName: "fake-file-name.pdf",
            url: "https://fake-url.pdf"
          }
        ],
        awardsAndCertificateImages: [
          {
            allowedToDownload: true,
            assetType: "CERTIFICATES",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "awardsAndCertificateImages",
            realFileName: "fake-file-name.jpg",
            url: "https://fake-url.jpg"
          }
        ],
        bimIframeUrl: "https://fake-bim-iframe-url",
        fixingToolIframeUrl: "https://fake-fixing-tool-iframe-url",
        guaranteesAndWarrantiesImages: [
          {
            allowedToDownload: true,
            assetType: "GUARANTIES",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "guaranteesAndWarrantiesImages",
            realFileName: "fake-guaranties-file-name.jpg",
            url: "http://localhost:8000"
          }
        ],
        guaranteesAndWarrantiesLinks: [
          {
            allowedToDownload: true,
            assetType: "WARRANTIES",
            fileSize: 10,
            format: "pdf",
            mime: "application/pdf",
            name: "guaranteesAndWarrantiesLinks",
            realFileName: undefined,
            url: "https://fake-warranties-url"
          }
        ],
        specificationIframeUrl: "https://fake-specification-iframe-url",
        videos: [
          {
            label: "video",
            previewMedia: null,
            subtitle: null,
            title: "",
            videoRatio: null,
            videoUrl: "https://fake-video-url"
          }
        ],
        documents: [
          {
            assetType: "AWARDS",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "2338814760",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "fake-file-name.pdf",
            title: "awardsAndCertificateDocument",
            url: "https://fake-url.pdf"
          },
          {
            assetType: "CERTIFICATES",
            extension: "jpg",
            fileSize: 10,
            format: "application/pdf",
            id: "3584779213",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "fake-file-name.jpg",
            title: "awardsAndCertificateImages",
            url: "https://fake-url.jpg"
          },
          {
            assetType: "BIM",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "4243930147",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "BIM",
            url: "https://fake-bim-iframe-url"
          },
          {
            assetType: "FIXING_TOOL",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "1918965534",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "fixingToolIframeUrl",
            url: "https://fake-fixing-tool-iframe-url"
          },
          {
            assetType: "GUARANTIES",
            extension: "jpg",
            fileSize: 10,
            format: "application/pdf",
            id: "2583923841",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "fake-guaranties-file-name.jpg",
            title: "guaranteesAndWarrantiesImages",
            url: "http://localhost:8000"
          },
          {
            assetType: "SPECIFICATION",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "532996341",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "specificationIframeUrl",
            url: "https://fake-specification-iframe-url"
          },
          {
            assetType: "VIDEO",
            extension: "pdf",
            fileSize: 10,
            format: "application/pdf",
            id: "976736365",
            isLinkDocument: false,
            productBaseCode: "base-code",
            productCategories: expect.anything(),
            productName: "name",
            realFileName: "real-file-name.pdf",
            title: "video",
            url: "https://fake-video-url"
          }
        ]
      })
    );
  });

  it("returns variants with goodBetterBest field", async () => {
    const product = createProduct({
      goodBetterBest: GoodBetterBest.good,
      variantOptions: [createProduct(), createProduct()]
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

  it("returns an empty array if allowPreviewStatus === false but product.previewStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [createProduct(), createProduct()]
    });
    const transformedProducts = await transformProduct(product, false);
    expect(transformedProducts).toEqual([]);
  });

  it("sets 'preview' status to all variants if allowPreviewStatus === true but produc.previewStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [
        createProduct({ approvalStatus: ApprovalStatus.Approved }),
        createProduct({ approvalStatus: ApprovalStatus.Discontinued })
      ]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ approvalStatus: ApprovalStatus.Preview }),
        expect.objectContaining({ approvalStatus: ApprovalStatus.Preview })
      ])
    );
  });

  it("handles 'preview' status correctly if there are no variants", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: undefined
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([]);
  });

  it("ignores variant products with status of 'check' if the base product status is 'preview' and allowApprovalStatus === true", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [
        createVariantOption({ approvalStatus: ApprovalStatus.Check })
      ]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([]);
  });

  it("ignores variant products with status of 'unapproved' if the base product status is 'preview' and allowApprovalStatus === true", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [
        createVariantOption({ approvalStatus: ApprovalStatus.Unapproved })
      ]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([]);
  });

  it("returns name field as an empty string if not provided and approvalStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      name: undefined,
      variantOptions: [createVariantOption({ name: undefined })]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([
      expect.objectContaining({ name: "" })
    ]);
  });

  it("returns code field as an empty string if not provided and approvalStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [createVariantOption({ code: undefined })]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([
      expect.objectContaining({ code: "" })
    ]);
  });

  it("returns description field as an empty string if not provided and approvalStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      description: undefined,
      variantOptions: [createVariantOption({ longDescription: undefined })]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([
      expect.objectContaining({ description: "" })
    ]);
  });

  it("returns documents correctly if name field does not exist and approvalStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      name: undefined,
      variantOptions: [
        createVariantOption({ assets: [createAsset({ assetType: "AWARDS" })] })
      ]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([
      expect.objectContaining({
        documents: [expect.objectContaining({ productName: "" })]
      })
    ]);
  });

  it("should not include upapproved and discontinued products in relatedVariants if approvalStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      variantOptions: [
        createVariantOption({
          code: "unapproved-variant",
          approvalStatus: ApprovalStatus.Unapproved
        }),
        createVariantOption({
          code: "check-variant",
          approvalStatus: ApprovalStatus.Check
        }),
        createVariantOption({
          code: "approved-variant",
          approvalStatus: ApprovalStatus.Approved
        })
      ]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([
      expect.objectContaining({
        relatedVariants: []
      })
    ]);
  });

  it("returns relatedVariants correctly if variant.code and baseProduct.name fields do not exist and approvalStatus === 'preview'", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Preview,
      name: undefined,
      variantOptions: [
        createVariantOption({ code: "variant-with-code-field" }),
        createVariantOption({
          code: undefined
        })
      ]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([
      expect.objectContaining({
        relatedVariants: [expect.objectContaining({ name: "", code: "" })]
      }),
      expect.objectContaining({
        relatedVariants: [
          expect.objectContaining({ name: "", code: "variant-with-code-field" })
        ]
      })
    ]);
  });

  it("returns only varriants of preview status if the base product is in another status", async () => {
    const product = createProduct({
      approvalStatus: ApprovalStatus.Approved,
      variantOptions: [
        createVariantOption({
          code: "variant-1",
          approvalStatus: ApprovalStatus.Discontinued
        }),
        createVariantOption({
          code: "variant-2",
          approvalStatus: ApprovalStatus.Approved
        }),
        createVariantOption({
          code: "variant-3",
          approvalStatus: ApprovalStatus.Preview
        })
      ]
    });
    const transformedProducts = await transformProduct(product, true);
    expect(transformedProducts).toEqual([
      expect.objectContaining({
        code: "variant-3",
        approvalStatus: ApprovalStatus.Preview
      })
    ]);
  });

  it("should not sort classification order if ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING is set to true", async () => {
    const originalEnableClassificationValue =
      process.env.ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING;
    process.env.ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING = "true";

    const product = createFullyPopulatedProduct();
    const transformedProducts = await transformProduct(product);

    expect(transformedProducts).toMatchSnapshot();

    process.env.ENABLE_SAMPLE_ORDERING = originalEnableClassificationValue;
  });

  it("should sort classification order if ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING is not set (existing behaviour)", async () => {
    const originalEnableClassificationValue =
      process.env.ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING;
    delete process.env.ENABLE_PRODUCT_CLASSIFICATION_ATTRIBUTE_ORDERING;

    const product = createFullyPopulatedProduct();
    const transformedProducts = await transformProduct(product);

    expect(transformedProducts).toMatchSnapshot();

    process.env.ENABLE_SAMPLE_ORDERING = originalEnableClassificationValue;
  });

  it("ignores roofPitch*Min, roofPitch*Max, MaxBattenDistance* and FirstRowBattenDistance* attributes", async () => {
    const product = createProduct({
      classifications: [],
      variantOptions: [
        createVariantOption({
          classifications: [
            createClassification({
              code: "tilesAttributes",
              name: "tilesAttributes",
              features: [
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch1Min",
                  name: "Roof Pitch 1 Min"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch1Max",
                  name: "Roof Pitch 1 Max"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.MaxBattenDistance1",
                  name: "Max Batten Distance 1"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.FirstRowBattenDistance1",
                  name: "First Row Batten Distance 1"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch2Min",
                  name: "roof Pitch 2 Min"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch2Max",
                  name: "roof Pitch 2 Max"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.MaxBattenDistance2",
                  name: "Max Batten Distance 2"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.FirstRowBattenDistance2",
                  name: "First Row Batten Distance 2"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch3Min",
                  name: "roof Pitch 3 Min"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch3Max",
                  name: "roof Pitch 3 Max"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.MaxBattenDistance3",
                  name: "Max Batten Distance 3"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.FirstRowBattenDistance3",
                  name: "First Row Batten Distance 3"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch4Min",
                  name: "roof Pitch 4 Min"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch4Max",
                  name: "roof Pitch 4 Max"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.MaxBattenDistance4",
                  name: "Max Batten Distance 4"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.FirstRowBattenDistance4",
                  name: "First Row Batten Distance 4"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch5Min",
                  name: "roof Pitch 5 Min"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch5Max",
                  name: "roof Pitch 5 Max"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.MaxBattenDistance5",
                  name: "Max Batten Distance 5"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.FirstRowBattenDistance5",
                  name: "First Row Batten Distance 5"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch6Min",
                  name: "roof Pitch 6 Min"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.roofPitch6Max",
                  name: "roof Pitch 6 Max"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.MaxBattenDistance6",
                  name: "Max Batten Distance 6"
                }),
                createFeature({
                  code: "bmiClassificationCatalog/1.0/tilesAttributes.FirstRowBattenDistance6",
                  name: "First Row Batten Distance 6"
                })
              ]
            })
          ]
        })
      ]
    });
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts[0].classifications).toEqual([]);
  });
});
