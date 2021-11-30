import {
  ClassificationCodeEnum,
  FeatureCodeEnum,
  ImageAssetTypesEnum
} from "../../components/types/pim";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import {
  createBaseProduct,
  createVariantOption
} from "../../__tests__/PimDocumentProductHelper";
import {
  createSchemaOrgDataForPdpPage,
  getFeatureClassificationByPriority,
  getSchemaOrgAwardData,
  getSchemaOrgBrandData,
  getSchemaOrgBrandLogoData,
  getSchemaOrgCategoryData,
  getSchemaOrgColorData,
  getSchemaOrgContextData,
  getSchemaOrgDescriptionData,
  getSchemaOrgHasVariantData,
  getSchemaOrgHeightData,
  getSchemaOrgImageData,
  getSchemaOrgMaterialData,
  getSchemaOrgModelData,
  getSchemaOrgNameData,
  getSchemaOrgPatternData,
  getSchemaOrgPotentialActionData,
  getSchemaOrgProductGroupData,
  getSchemaOrgProductIdData,
  getSchemaOrgSizeData,
  getSchemaOrgTypeData,
  getSchemaOrgUrlData,
  getSchemaOrgWeightData,
  getSchemaOrgWidthData,
  schemaOrgConfigForPdpPage,
  SchemaOrgFieldsEnum
} from "../schemaOrgPDPpage";

describe("schemaOrgPDPpage tests", () => {
  describe("createSchemaOrgDataForPdpPage tests", () => {
    it("should return empty schemaOrg object depends on empty fieldsConfig and baseProduct and variantOption data", () => {
      const fieldsConfig = [];
      const product = createBaseProduct();
      const varianOption = createVariantOption();

      const result = createSchemaOrgDataForPdpPage(
        fieldsConfig,
        product,
        varianOption
      );

      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty schemaOrg object if we don't put fieldsConfig param", () => {
      const product = createBaseProduct();
      const varianOption = createVariantOption();

      const result = createSchemaOrgDataForPdpPage(
        undefined,
        product,
        varianOption
      );

      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return schemaOrg object depends on fieldsConfig and baseProduct and variantOption data", () => {
      const product = createBaseProduct();
      const varianOption = createVariantOption();

      const result = createSchemaOrgDataForPdpPage(
        schemaOrgConfigForPdpPage,
        product,
        varianOption
      );

      const expectedResult = {
        hasVariant: "variant-code",
        productID: "variant-code",
        ProductGroup: "product-code",
        name: "product-name",
        model: "product-name",
        ["@context"]: "https://schema.org",
        ["@type"]: "Product",
        description: "variant-long-desc",
        url: "http://localhost/"
      };

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgContextData tests", () => {
    it("should return сontext data", () => {
      const result = getSchemaOrgContextData({
        type: SchemaOrgFieldsEnum.CONTEXT
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.CONTEXT]: "https://schema.org"
      };

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgTypeData tests", () => {
    it("should return type data", () => {
      const result = getSchemaOrgTypeData({
        type: SchemaOrgFieldsEnum.TYPE
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.TYPE]: "Product"
      };

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgAwardData tests", () => {
    it("should return award asset name", () => {
      const baseProduct = createBaseProduct({
        assets: [
          {
            assetType: "AWARDS",
            name: "mocked-awards-assets-name",
            url: "moked-asset-url"
          }
        ]
      });
      const result = getSchemaOrgAwardData({
        type: SchemaOrgFieldsEnum.AWARD,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.AWARD]: "mocked-awards-assets-name"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if assetType AWARDS not exist in baseProduct assets", () => {
      const baseProduct = createBaseProduct();
      const result = getSchemaOrgAwardData({
        type: SchemaOrgFieldsEnum.AWARD,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgBrandData tests", () => {
    it("should return brand name", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: "Brand",
            name: "mocked-category-name",
            code: "mocked-category-code"
          }
        ]
      });
      const result = getSchemaOrgBrandData({
        type: SchemaOrgFieldsEnum.BRAND,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.BRAND]: {
          ["@type"]: "Brand",
          name: "mocked-category-name"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if category name not exist in baseProduct assets", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: undefined,
            code: undefined,
            name: undefined
          }
        ]
      });
      const result = getSchemaOrgBrandData({
        type: SchemaOrgFieldsEnum.BRAND,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgCategoryData tests", () => {
    it("should return categories names array", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: "Category",
            name: "mocked-category-name",
            code: "mocked-category-code"
          },
          {
            categoryType: "Category",
            name: "mocked-category-name-2",
            code: "mocked-category-code-2"
          }
        ]
      });
      const result = getSchemaOrgCategoryData({
        type: SchemaOrgFieldsEnum.CATEGORY,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.CATEGORY]: [
          "mocked-category-name",
          "mocked-category-name-2"
        ]
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return categories names array only if typeof name === string", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: "Category",
            name: "mocked-category-name",
            code: "mocked-category-code"
          },
          {
            categoryType: "Category",
            name: undefined,
            code: "mocked-category-code-2"
          }
        ]
      });
      const result = getSchemaOrgCategoryData({
        type: SchemaOrgFieldsEnum.CATEGORY,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.CATEGORY]: "mocked-category-name"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return category name", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: "Category",
            name: "mocked-category-name",
            code: "mocked-category-code"
          }
        ]
      });
      const result = getSchemaOrgCategoryData({
        type: SchemaOrgFieldsEnum.CATEGORY,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.CATEGORY]: "mocked-category-name"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if category name not exist in baseProduct assets", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: undefined,
            code: undefined,
            name: undefined
          }
        ]
      });
      const result = getSchemaOrgCategoryData({
        type: SchemaOrgFieldsEnum.CATEGORY,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if categoryType not equal 'Category' in baseProduct assets", () => {
      const baseProduct = createBaseProduct();
      const result = getSchemaOrgCategoryData({
        type: SchemaOrgFieldsEnum.CATEGORY,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgColorData tests", () => {
    it("should return color value", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
          features: [
            {
              code: FeatureCodeEnum.COLOUR,
              name: FeatureCodeEnum.COLOUR,
              featureValues: [
                {
                  code: "mocked-color-code",
                  value: "red"
                }
              ]
            }
          ]
        })
      ];
      const result = getSchemaOrgColorData({
        type: SchemaOrgFieldsEnum.COLOR,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.COLOR]: "red"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if color feature not exist in classifications array", () => {
      const classifications = [createClassification()];
      const result = getSchemaOrgColorData({
        type: SchemaOrgFieldsEnum.COLOR,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgBrandLogoData tests", () => {
    it("should return logo url value", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: "Brand",
            name: "mocked-category-name",
            code: "mocked-category-code",
            image: {
              allowedToDownload: true,
              fileSize: 12,
              mime: "image/png",
              name: "mocked-image-name",
              realFileName: "mocked-real-file-name",
              url: "mocked-url-image-brand-category"
            }
          }
        ]
      });
      const result = getSchemaOrgBrandLogoData({
        type: SchemaOrgFieldsEnum.LOGO,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.LOGO]: "mocked-url-image-brand-category"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if brand image object doesn't have url data", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: "Brand",
            name: "mocked-category-name",
            code: "mocked-category-code",
            image: {
              allowedToDownload: true,
              fileSize: 12,
              mime: "image/png",
              name: "mocked-image-name",
              realFileName: "mocked-real-file-name",
              url: undefined
            }
          }
        ]
      });
      const result = getSchemaOrgBrandLogoData({
        type: SchemaOrgFieldsEnum.LOGO,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if brand image object === undefined", () => {
      const baseProduct = createBaseProduct({
        categories: [
          {
            categoryType: "Brand",
            name: "mocked-category-name",
            code: "mocked-category-code",
            image: undefined
          }
        ]
      });
      const result = getSchemaOrgBrandLogoData({
        type: SchemaOrgFieldsEnum.LOGO,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if Brand category not exist in product categories array", () => {
      const baseProduct = createBaseProduct();
      const result = getSchemaOrgBrandLogoData({
        type: SchemaOrgFieldsEnum.LOGO,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgMaterialData tests", () => {
    it("should return material value", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.GENERAL_INFORMATION,
          features: [
            {
              code: FeatureCodeEnum.MATERIALS,
              name: FeatureCodeEnum.MATERIALS,
              featureValues: [
                {
                  code: "mocked-material-code",
                  value: "mock-material"
                }
              ]
            }
          ]
        })
      ];
      const result = getSchemaOrgMaterialData({
        type: SchemaOrgFieldsEnum.MATERIAL,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.MATERIAL]: "mock-material"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if material feature value doesn't exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.GENERAL_INFORMATION,
          features: [
            {
              code: FeatureCodeEnum.MATERIALS,
              name: FeatureCodeEnum.MATERIALS,
              featureValues: [
                {
                  code: "mocked-material-code",
                  value: undefined
                }
              ]
            }
          ]
        })
      ];
      const result = getSchemaOrgMaterialData({
        type: SchemaOrgFieldsEnum.MATERIAL,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if material feature not exist in classifications array", () => {
      const classifications = [createClassification()];
      const result = getSchemaOrgColorData({
        type: SchemaOrgFieldsEnum.MATERIAL,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgPotentialActionData tests", () => {
    it("should return variant images urls array with format === null", () => {
      const baseProduct = createBaseProduct();
      const variant = createVariantOption({
        images: [
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          }
        ]
      });
      const result = getSchemaOrgPotentialActionData({
        type: SchemaOrgFieldsEnum.POTENTIAL_ACTION,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.POTENTIAL_ACTION]: ["mocked-url"]
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if images in variantOption with format === null doesn't exist", () => {
      const baseProduct = createBaseProduct();
      const variant = createVariantOption({
        images: [
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: "Product-Hero-Small-Desktop-Tablet"
          }
        ]
      });
      const result = getSchemaOrgPotentialActionData({
        type: SchemaOrgFieldsEnum.POTENTIAL_ACTION,
        baseProduct,
        variant
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return baseProduct images urls array with format === null", () => {
      const baseProduct = createBaseProduct({
        images: [
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          }
        ]
      });
      const variant = createVariantOption();
      const result = getSchemaOrgPotentialActionData({
        type: SchemaOrgFieldsEnum.POTENTIAL_ACTION,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.POTENTIAL_ACTION]: ["mocked-url"]
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if baseProduct images with format === null doesn't exist", () => {
      const baseProduct = createBaseProduct({
        images: [
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: "Product-Hero-Small-Desktop-Tablet"
          }
        ]
      });
      const variant = createVariantOption();
      const result = getSchemaOrgPotentialActionData({
        type: SchemaOrgFieldsEnum.POTENTIAL_ACTION,
        baseProduct,
        variant
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if no images in base and variant product", () => {
      const baseProduct = createBaseProduct();
      const variant = createVariantOption();
      const result = getSchemaOrgPotentialActionData({
        type: SchemaOrgFieldsEnum.POTENTIAL_ACTION,
        baseProduct,
        variant
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgWeightData tests", () => {
    it("should return weight value and unit from classifications if both of them exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          name: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          features: [
            {
              code: FeatureCodeEnum.WEIGHT_PER_PRICE,
              name: FeatureCodeEnum.WEIGHT_PER_PRICE,
              featureValues: [
                {
                  code: "mocked-code",
                  value: "mocked-value"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "kg"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgWeightData({
        type: SchemaOrgFieldsEnum.WEIGHT,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.WEIGHT]: {
          ["@type"]: typeValue,
          value: "mocked-value",
          valueReference: "kg"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return weight value from classifications if unit does not exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          name: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          features: [
            {
              code: FeatureCodeEnum.WEIGHT_PER_PRICE,
              name: FeatureCodeEnum.WEIGHT_PER_PRICE,
              featureValues: [
                {
                  code: "mocked-code",
                  value: "mocked-value"
                }
              ],
              featureUnit: undefined
            }
          ]
        })
      ];
      const result = getSchemaOrgWeightData({
        type: SchemaOrgFieldsEnum.WEIGHT,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.WEIGHT]: {
          ["@type"]: typeValue,
          value: "mocked-value"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return unit value from classifications if weight value does not exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          name: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          features: [
            {
              code: FeatureCodeEnum.WEIGHT_PER_PRICE,
              name: FeatureCodeEnum.WEIGHT_PER_PRICE,
              featureValues: [],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "kg"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgWeightData({
        type: SchemaOrgFieldsEnum.WEIGHT,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.WEIGHT]: {
          ["@type"]: typeValue,
          valueReference: "kg"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if weight value and unit value do not exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          name: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
          features: [
            {
              code: FeatureCodeEnum.WEIGHT_PER_PRICE,
              name: FeatureCodeEnum.WEIGHT_PER_PRICE,
              featureValues: [],
              featureUnit: undefined
            }
          ]
        })
      ];
      const result = getSchemaOrgWeightData({
        type: SchemaOrgFieldsEnum.WEIGHT,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if WEIGHT_ATTRIBUTES type of classifications does not exist", () => {
      const classifications = [createClassification()];
      const result = getSchemaOrgWeightData({
        type: SchemaOrgFieldsEnum.WEIGHT,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgWidthData tests", () => {
    it("should return width value and unit from classifications if both of them exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.WIDTH,
              name: FeatureCodeEnum.WIDTH,
              featureValues: [
                {
                  code: "mocked-code",
                  value: "mocked-value"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgWidthData({
        type: SchemaOrgFieldsEnum.WIDTH,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.WIDTH]: {
          ["@type"]: typeValue,
          value: "mocked-value",
          valueReference: "mm"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return width value from classifications if unit does not exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.WIDTH,
              name: FeatureCodeEnum.WIDTH,
              featureValues: [
                {
                  code: "mocked-code",
                  value: "mocked-value"
                }
              ],
              featureUnit: undefined
            }
          ]
        })
      ];
      const result = getSchemaOrgWidthData({
        type: SchemaOrgFieldsEnum.WIDTH,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.WIDTH]: {
          ["@type"]: typeValue,
          value: "mocked-value"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return unit value from classifications if width value does not exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.WIDTH,
              name: FeatureCodeEnum.WIDTH,
              featureValues: [],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgWidthData({
        type: SchemaOrgFieldsEnum.WIDTH,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.WIDTH]: {
          ["@type"]: typeValue,
          valueReference: "mm"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if width value and unit value do not exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.WIDTH,
              name: FeatureCodeEnum.WIDTH,
              featureValues: [],
              featureUnit: undefined
            }
          ]
        })
      ];
      const result = getSchemaOrgWidthData({
        type: SchemaOrgFieldsEnum.WIDTH,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if WIDTH type of classifications does not exist", () => {
      const classifications = [createClassification()];
      const result = getSchemaOrgWidthData({
        type: SchemaOrgFieldsEnum.WIDTH,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgHeightData tests", () => {
    it("should return height value and unit from classifications if both of them exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.HEIGHT,
              name: FeatureCodeEnum.HEIGHT,
              featureValues: [
                {
                  code: "mocked-code",
                  value: "mocked-value"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgHeightData({
        type: SchemaOrgFieldsEnum.HEIGHT,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.HEIGHT]: {
          ["@type"]: typeValue,
          value: "mocked-value",
          valueReference: "mm"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return height value from classifications if unit does not exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.HEIGHT,
              name: FeatureCodeEnum.HEIGHT,
              featureValues: [
                {
                  code: "mocked-code",
                  value: "mocked-value"
                }
              ],
              featureUnit: undefined
            }
          ]
        })
      ];
      const result = getSchemaOrgHeightData({
        type: SchemaOrgFieldsEnum.HEIGHT,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.HEIGHT]: {
          ["@type"]: typeValue,
          value: "mocked-value"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return unit value from classifications if height value does not exist", () => {
      const typeValue = "QuantitativeValue";
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.HEIGHT,
              name: FeatureCodeEnum.HEIGHT,
              featureValues: [],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgHeightData({
        type: SchemaOrgFieldsEnum.HEIGHT,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.HEIGHT]: {
          ["@type"]: typeValue,
          valueReference: "mm"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if height value and unit value do not exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.HEIGHT,
              name: FeatureCodeEnum.HEIGHT,
              featureValues: [],
              featureUnit: undefined
            }
          ]
        })
      ];
      const result = getSchemaOrgHeightData({
        type: SchemaOrgFieldsEnum.HEIGHT,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if HEIGHT type of classifications does not exist", () => {
      const classifications = [createClassification()];
      const result = getSchemaOrgHeightData({
        type: SchemaOrgFieldsEnum.HEIGHT,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgSizeData tests", () => {
    it("should return size from classifications if width, height and length exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.WIDTH,
              name: FeatureCodeEnum.WIDTH,
              featureValues: [
                {
                  code: "width-mocked-code",
                  value: "10"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            },
            {
              code: FeatureCodeEnum.HEIGHT,
              name: FeatureCodeEnum.HEIGHT,
              featureValues: [
                {
                  code: "height-mocked-code",
                  value: "10"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            },
            {
              code: FeatureCodeEnum.LENGTH,
              name: FeatureCodeEnum.LENGTH,
              featureValues: [
                {
                  code: "length-mocked-code",
                  value: "10"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgSizeData({
        type: SchemaOrgFieldsEnum.SIZE,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.SIZE]: "10x10x10mm"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return size from classifications if width, height and length exist with different unit symbols", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.WIDTH,
              name: FeatureCodeEnum.WIDTH,
              featureValues: [
                {
                  code: "width-mocked-code",
                  value: "10"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            },
            {
              code: FeatureCodeEnum.HEIGHT,
              name: FeatureCodeEnum.HEIGHT,
              featureValues: [
                {
                  code: "height-mocked-code",
                  value: "10"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "m"
              }
            },
            {
              code: FeatureCodeEnum.LENGTH,
              name: FeatureCodeEnum.LENGTH,
              featureValues: [
                {
                  code: "length-mocked-code",
                  value: "10"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "km"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgSizeData({
        type: SchemaOrgFieldsEnum.SIZE,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.SIZE]: "10m x 10mm x 10km"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return volume from classifications if width, height and length do not exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.VOLUME,
              name: FeatureCodeEnum.VOLUME,
              featureValues: [
                {
                  code: "volume-mocked-code",
                  value: "10"
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgSizeData({
        type: SchemaOrgFieldsEnum.SIZE,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.SIZE]: "10"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if volume value does not exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
          features: [
            {
              code: FeatureCodeEnum.VOLUME,
              name: FeatureCodeEnum.VOLUME,
              featureValues: [
                {
                  code: "volume-mocked-code",
                  value: undefined
                }
              ],
              featureUnit: {
                name: "mocked-unit-name",
                unitType: "mocked-unit-type",
                symbol: "mm"
              }
            }
          ]
        })
      ];
      const result = getSchemaOrgSizeData({
        type: SchemaOrgFieldsEnum.SIZE,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from classifications if MEASUREMENTS does not exist", () => {
      const classifications = [createClassification()];
      const result = getSchemaOrgSizeData({
        type: SchemaOrgFieldsEnum.SIZE,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgImageData tests", () => {
    it("should return master image urls array from variantOption", () => {
      const baseProduct = createBaseProduct();
      const variant = createVariantOption({
        images: [
          {
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          },
          {
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url-2",
            format: null
          }
        ]
      });
      const result = getSchemaOrgImageData({
        type: SchemaOrgFieldsEnum.IMAGE,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.IMAGE]: ["mocked-url", "mocked-url-2"]
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return one master image url from variantOption", () => {
      const baseProduct = createBaseProduct();
      const variant = createVariantOption({
        images: [
          {
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          },
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url-2",
            format: null
          }
        ]
      });
      const result = getSchemaOrgImageData({
        type: SchemaOrgFieldsEnum.IMAGE,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.IMAGE]: "mocked-url"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return one master image url from baseProduct", () => {
      const baseProduct = createBaseProduct({
        images: [
          {
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          },
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url-2",
            format: null
          }
        ]
      });
      const variant = createVariantOption();
      const result = getSchemaOrgImageData({
        type: SchemaOrgFieldsEnum.IMAGE,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.IMAGE]: "mocked-url"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return arry of master image urls from baseProduct", () => {
      const baseProduct = createBaseProduct({
        images: [
          {
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          },
          {
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url-2",
            format: null
          }
        ]
      });
      const variant = createVariantOption();
      const result = getSchemaOrgImageData({
        type: SchemaOrgFieldsEnum.IMAGE,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.IMAGE]: ["mocked-url", "mocked-url-2"]
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if master images in varianOption and baseProduct do not exist", () => {
      const baseProduct = createBaseProduct({
        images: [
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          },
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url-2",
            format: null
          }
        ]
      });
      const variant = createVariantOption({
        images: [
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url",
            format: null
          },
          {
            assetType: ImageAssetTypesEnum.GALLERY,
            allowedToDownload: true,
            containerId: "mocked-container-id",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "mocked-image-name",
            realFileName: "mocked-real-file-name",
            url: "mocked-url-2",
            format: null
          }
        ]
      });
      const result = getSchemaOrgImageData({
        type: SchemaOrgFieldsEnum.IMAGE,
        baseProduct,
        variant
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgProductIdData tests", () => {
    it("should return productID from variantOption", () => {
      const variant = createVariantOption();
      const result = getSchemaOrgProductIdData({
        type: SchemaOrgFieldsEnum.PRODUCT_ID,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.PRODUCT_ID]: "variant-code"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from variantOption if variant code does not exist", () => {
      const variant = createVariantOption({
        code: undefined
      });
      const result = getSchemaOrgProductIdData({
        type: SchemaOrgFieldsEnum.PRODUCT_ID,
        variant
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgPatternData tests", () => {
    it("should return textureFamily value", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
          features: [
            {
              code: FeatureCodeEnum.TEXTURE_FAMILY,
              name: FeatureCodeEnum.TEXTURE_FAMILY,
              featureValues: [
                {
                  code: "mocked-texture-family-code",
                  value: "mock-texture-family-value"
                }
              ]
            }
          ]
        })
      ];
      const result = getSchemaOrgPatternData({
        type: SchemaOrgFieldsEnum.PATTERN,
        classifications
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.PATTERN]: "mock-texture-family-value"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if textureFamily feature value doesn't exist", () => {
      const classifications = [
        createClassification({
          code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
          features: [
            {
              code: FeatureCodeEnum.TEXTURE_FAMILY,
              name: FeatureCodeEnum.TEXTURE_FAMILY,
              featureValues: [
                {
                  code: "mocked-texture-family-code",
                  value: undefined
                }
              ]
            }
          ]
        })
      ];
      const result = getSchemaOrgMaterialData({
        type: SchemaOrgFieldsEnum.PATTERN,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if textureFamily feature not exist in classifications array", () => {
      const classifications = [createClassification()];
      const result = getSchemaOrgColorData({
        type: SchemaOrgFieldsEnum.PATTERN,
        classifications
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgModelData tests", () => {
    it("should return model from baseProduct", () => {
      const baseProduct = createBaseProduct();
      const result = getSchemaOrgModelData({
        type: SchemaOrgFieldsEnum.MODEL,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.MODEL]: "product-name"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from baseProduct if name does not exist", () => {
      const baseProduct = createBaseProduct({
        name: undefined
      });
      const result = getSchemaOrgModelData({
        type: SchemaOrgFieldsEnum.MODEL,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgProductGroupData tests", () => {
    it("should return productGroup from baseProduct", () => {
      const baseProduct = createBaseProduct();
      const result = getSchemaOrgProductGroupData({
        type: SchemaOrgFieldsEnum.PRODUCT_GROUP,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.PRODUCT_GROUP]: "product-code"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from baseProduct if code does not exist", () => {
      const baseProduct = createBaseProduct({
        code: undefined
      });
      const result = getSchemaOrgProductGroupData({
        type: SchemaOrgFieldsEnum.PRODUCT_GROUP,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgHasVariantData tests", () => {
    it("should return hasVariant from variantOption", () => {
      const variant = createVariantOption();
      const result = getSchemaOrgHasVariantData({
        type: SchemaOrgFieldsEnum.HAS_VARIANT,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.HAS_VARIANT]: "variant-code"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from variantOption if variant code does not exist", () => {
      const variant = createVariantOption({
        code: undefined
      });
      const result = getSchemaOrgHasVariantData({
        type: SchemaOrgFieldsEnum.HAS_VARIANT,
        variant
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgNameData tests", () => {
    it("should return name from baseProduct", () => {
      const baseProduct = createBaseProduct();
      const result = getSchemaOrgNameData({
        type: SchemaOrgFieldsEnum.NAME,
        baseProduct
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.NAME]: "product-name"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object from baseProduct if name does not exist", () => {
      const baseProduct = createBaseProduct({
        name: undefined
      });
      const result = getSchemaOrgNameData({
        type: SchemaOrgFieldsEnum.PRODUCT_GROUP,
        baseProduct
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgDescriptionData tests", () => {
    it("should return longDescription from variant", () => {
      const baseProduct = createBaseProduct();
      const variant = createVariantOption();
      const result = getSchemaOrgDescriptionData({
        type: SchemaOrgFieldsEnum.DESCRIPTION,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.DESCRIPTION]: "variant-long-desc"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return description from baseProduct if longDescription does not exist in variant", () => {
      const baseProduct = createBaseProduct();
      const variant = createVariantOption({
        longDescription: undefined
      });
      const result = getSchemaOrgDescriptionData({
        type: SchemaOrgFieldsEnum.DESCRIPTION,
        baseProduct,
        variant
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.DESCRIPTION]: "product-description"
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if longDescription in variant and description in baseProduct do not exist", () => {
      const baseProduct = createBaseProduct({
        description: undefined
      });
      const variant = createVariantOption({
        longDescription: undefined
      });
      const result = getSchemaOrgDescriptionData({
        type: SchemaOrgFieldsEnum.DESCRIPTION,
        baseProduct,
        variant
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getSchemaOrgUrlData tests", () => {
    it("should return url from window location href", () => {
      global.window = Object.create(window);
      const url = "http://dummy.com";
      Object.defineProperty(window, "location", {
        value: {
          href: url
        }
      });
      const result = getSchemaOrgUrlData({
        type: SchemaOrgFieldsEnum.URL
      });
      const expectedResult = {
        [SchemaOrgFieldsEnum.URL]: url
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty object if window location href does not exist", () => {
      global.window = Object.create(window);
      delete window.location;
      const result = getSchemaOrgUrlData({
        type: SchemaOrgFieldsEnum.URL
      });
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getFeatureClassificationByPriority tests", () => {
    it("should return first finded feature according to order config", () => {
      const features = {
        [FeatureCodeEnum.COLOUR]: createFeature(),
        [FeatureCodeEnum.TEXTURE_FAMILY]: createFeature(),
        [FeatureCodeEnum.MATERIALS]: createFeature(),
        [FeatureCodeEnum.WEIGHT_PER_PALLET]: createFeature()
      };
      const order = [
        FeatureCodeEnum.WEIGHT_PER_PALLET,
        FeatureCodeEnum.TEXTURE_FAMILY,
        FeatureCodeEnum.COLOUR,
        FeatureCodeEnum.MATERIALS
      ];
      const result = getFeatureClassificationByPriority(features, order);
      const expectedResult = {
        [FeatureCodeEnum.WEIGHT_PER_PALLET]: createFeature()
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return empty array if not find any feature according to order array", () => {
      const features = {
        [FeatureCodeEnum.COLOUR]: createFeature(),
        [FeatureCodeEnum.TEXTURE_FAMILY]: createFeature(),
        [FeatureCodeEnum.MATERIALS]: createFeature(),
        [FeatureCodeEnum.WEIGHT_PER_PALLET]: createFeature()
      };
      const order = [
        FeatureCodeEnum.COLOUR_FAMILY,
        FeatureCodeEnum.WIDTH,
        FeatureCodeEnum.HEIGHT,
        FeatureCodeEnum.LENGTH
      ];
      const result = getFeatureClassificationByPriority(features, order);
      const expectedResult = {};

      expect(result).toEqual(expectedResult);
    });
  });
});
