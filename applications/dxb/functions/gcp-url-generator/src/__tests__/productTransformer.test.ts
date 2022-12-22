import {
  createClassification,
  createFeature,
  createFeatureUnit,
  createFeatureValue,
  createFullyPopulatedProduct,
  createProduct,
  createVariantOption,
  Product
} from "@bmi/pim-types";

jest.mock("@bmi-digital/functions-logger");

const transformProduct = async (product: Product) =>
  (await import("../productTransformer")).transformProduct(product);

beforeEach(() => {
  process.env.GATSBY_SITE_URL = "http://localhost:8000";
  process.env.COUNTRY_CODE = "no";
});

describe("transformProduct", () => {
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

  it("transforms a single variant option with minimal data", async () => {
    const product: Product = {
      approvalStatus: "approved",
      code: "code",
      externalProductCode: undefined,
      description: "description",
      assets: undefined,
      categories: undefined,
      classifications: undefined,
      images: undefined,
      isSampleOrderAllowed: undefined,
      longDescription: "long description",
      name: "name",
      productBenefits: undefined,
      shortDescription: "short description",
      summary: "summary",
      variantOptions: [
        {
          approvalStatus: "approved",
          classifications: undefined,
          code: "variant-code",
          externalProductCode: undefined,
          images: undefined,
          isSampleOrderAllowed: undefined,
          longDescription: undefined,
          shortDescription: "variant short description",
          productBenefits: undefined
        }
      ]
    };
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toEqual([
      {
        catalog: "pim-catalog-name",
        url: "http://localhost:8000/no/p/name-3464354221",
        variantCode: "variant-code"
      }
    ]);
  });

  it("transforms a fully populated product", async () => {
    const product = createFullyPopulatedProduct();
    const transformedProducts = await transformProduct(product);
    expect(transformedProducts).toMatchInlineSnapshot(`
      Array [
        Object {
          "catalog": "pim-catalog-name",
          "url": "http://localhost:8000/no/p/name-shadow-black-gloss-concrete-3464354221",
          "variantCode": "variant-code",
        },
      ]
    `);
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
    expect(transformedProducts).toMatchInlineSnapshot(`
      Array [
        Object {
          "catalog": "pim-catalog-name",
          "url": "http://localhost:8000/no/p/name-shadow-black-gloss-concrete-3464354221",
          "variantCode": "variant-code",
        },
      ]
    `);
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-diameter-40mm-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-diameter-40mm-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-gloss-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-gloss-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-clay-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-clay-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2669911658`
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
    expect(transformedProducts[0].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2526773877`
    );
    expect(transformedProducts[1].url).toEqual(
      `http://localhost:8000/no/p/product-name-black-gloss-clay-2669911658`
    );

    process.env.ENABLE_PDP_VARIANT_ATTRIBUTE_URL =
      originalEnablePdpVariantAttributeUrl;
  });
});
