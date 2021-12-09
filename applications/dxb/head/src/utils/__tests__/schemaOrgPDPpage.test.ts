import {
  ClassificationCodeEnum,
  FeatureCodeEnum,
  ImageAssetTypesEnum
} from "../../components/types/pim";
import {
  createBaseProduct,
  createVariantOption
} from "../../__tests__/PimDocumentProductHelper";
import { createSchemaOrgDataForPdpPage } from "../schemaOrgPDPpage";

const countryCode = "no";
describe("schemaOrgPDPpage tests", () => {
  describe("createSchemaOrgDataForPdpPage tests", () => {
    it("should return minimal information for SchemaOrg if no data exists in variant product", () => {
      const product = createBaseProduct({
        description: "",
        name: "",
        images: []
      });
      const varianOption = createVariantOption({
        images: [],
        longDescription: "",
        code: "",
        path: "/p/some-product-path"
      });

      const result = createSchemaOrgDataForPdpPage(
        product,
        varianOption,
        countryCode
      );

      const expectedResult = {
        "@context": "https://schema.org",
        "@type": "Product",
        url: "/no/p/some-product-path",
        award: undefined,
        brand: undefined,
        color: undefined,
        description: undefined,
        height: undefined,
        image: undefined,
        logo: undefined,
        material: undefined,
        model: undefined,
        name: undefined,
        pattern: undefined,
        potentialAction: undefined,
        productID: undefined,
        size: undefined,
        weight: undefined,
        width: undefined
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return all information for schemaOrg if all data exists in base and variant products", () => {
      const product = createBaseProduct({
        assets: [
          {
            url: "awards-asset-type-url",
            assetType: "AWARDS",
            name: "awards-asset-type-name"
          }
        ],
        categories: [
          {
            code: "brand-category-code",
            name: "brand-category-name",
            categoryType: "Brand",
            image: {
              allowedToDownload: true,
              fileSize: 99999,
              mime: "image/png",
              name: "brand-category-image-name",
              realFileName: "brand-category-image-name",
              url: "brand-category-image-url"
            }
          }
        ]
      });
      const variant = createVariantOption({
        classifications: [
          {
            code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            features: [
              {
                name: FeatureCodeEnum.COLOUR,
                code: FeatureCodeEnum.COLOUR,
                featureValues: [
                  {
                    value: "variant-color-value",
                    code: "variant-color-code"
                  }
                ],
                featureUnit: {
                  name: "variant-color-feature-unit-name",
                  unitType: "variant-color-feature-unit-unit-type",
                  symbol: "variant-color-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.TEXTURE_FAMILY,
                code: FeatureCodeEnum.TEXTURE_FAMILY,
                featureValues: [
                  {
                    value: "variant-texture-family-value",
                    code: "variant-texture-family-code"
                  }
                ],
                featureUnit: {
                  name: "variant-texture-family-feature-unit-name",
                  unitType: "variant-texture-family-feature-unit-unit-type",
                  symbol: "variant-texture-family-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.GENERAL_INFORMATION,
            name: ClassificationCodeEnum.GENERAL_INFORMATION,
            features: [
              {
                name: FeatureCodeEnum.MATERIALS,
                code: FeatureCodeEnum.MATERIALS,
                featureValues: [
                  {
                    value: "variant-materials-value",
                    code: "variant-materials-code"
                  }
                ],
                featureUnit: {
                  name: "variant-materials-feature-unit-name",
                  unitType: "variant-materials-feature-unit-unit-type",
                  symbol: "variant-materials-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
            name: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
            features: [
              {
                name: FeatureCodeEnum.WEIGHT_PER_PRICE,
                code: FeatureCodeEnum.WEIGHT_PER_PRICE,
                featureValues: [
                  {
                    value: "variant-weight-per-price-value",
                    code: "variant-weight-per-price-code"
                  }
                ],
                featureUnit: {
                  name: "variant-weight-per-price-feature-unit-name",
                  unitType: "variant-weight-per-price-feature-unit-unit-type",
                  symbol: "variant-weight-per-price-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.NET_WEIGHT,
                code: FeatureCodeEnum.NET_WEIGHT,
                featureValues: [
                  {
                    value: "variant-net-weight-value",
                    code: "variant-net-weight-code"
                  }
                ],
                featureUnit: {
                  name: "variant-net-weight-feature-unit-name",
                  unitType: "variant-net-weight-feature-unit-unit-type",
                  symbol: "variant-net-weight-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.GROSS_WEIGHT,
                code: FeatureCodeEnum.GROSS_WEIGHT,
                featureValues: [
                  {
                    value: "variant-gross-weight-value",
                    code: "variant-gross-weight-code"
                  }
                ],
                featureUnit: {
                  name: "variant-gross-weight-feature-unit-name",
                  unitType: "variant-gross-weight-feature-unit-unit-type",
                  symbol: "variant-gross-weight-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.WEIGHT_PER_SQM,
                code: FeatureCodeEnum.WEIGHT_PER_SQM,
                featureValues: [
                  {
                    value: "variant-weight-per-sqm-value",
                    code: "variant-weight-per-sqm-code"
                  }
                ],
                featureUnit: {
                  name: "variant-weight-per-sqm-feature-unit-name",
                  unitType: "variant-weight-per-sqm-feature-unit-unit-type",
                  symbol: "variant-weight-per-sqm-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.WEIGHT_PER_PALLET,
                code: FeatureCodeEnum.WEIGHT_PER_PALLET,
                featureValues: [
                  {
                    value: "variant-weight-per-pallet-value",
                    code: "variant-weight-per-pallet-code"
                  }
                ],
                featureUnit: {
                  name: "variant-weight-per-pallet-feature-unit-name",
                  unitType: "variant-weight-per-pallet-feature-unit-unit-type",
                  symbol: "variant-weight-per-pallet-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.MEASUREMENTS,
            name: ClassificationCodeEnum.MEASUREMENTS,
            features: [
              {
                name: FeatureCodeEnum.THICKNESS,
                code: FeatureCodeEnum.THICKNESS,
                featureValues: [
                  {
                    value: "variant-thickness-value",
                    code: "variant-thickness-code"
                  }
                ],
                featureUnit: {
                  name: "variant-thickness-feature-unit-name",
                  unitType: "variant-thickness-feature-unit-unit-type",
                  symbol: "variant-thickness-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.WIDTH,
                code: FeatureCodeEnum.WIDTH,
                featureValues: [
                  {
                    value: "variant-width-value",
                    code: "variant-width-code"
                  }
                ],
                featureUnit: {
                  name: "variant-width-feature-unit-name",
                  unitType: "variant-width-feature-unit-unit-type",
                  symbol: "variant-width-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.HEIGHT,
                code: FeatureCodeEnum.HEIGHT,
                featureValues: [
                  {
                    value: "variant-height-value",
                    code: "variant-height-code"
                  }
                ],
                featureUnit: {
                  name: "variant-height-feature-unit-name",
                  unitType: "variant-height-feature-unit-unit-type",
                  symbol: "variant-height-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.LENGTH,
                code: FeatureCodeEnum.LENGTH,
                featureValues: [
                  {
                    value: "variant-length-value",
                    code: "variant-length-code"
                  }
                ],
                featureUnit: {
                  name: "variant-length-feature-unit-name",
                  unitType: "variant-length-feature-unit-unit-type",
                  symbol: "variant-length-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.VOLUME,
                code: FeatureCodeEnum.VOLUME,
                featureValues: [
                  {
                    value: "variant-volume-value",
                    code: "variant-volume-code"
                  }
                ],
                featureUnit: {
                  name: "variant-volume-feature-unit-name",
                  unitType: "variant-volume-feature-unit-unit-type",
                  symbol: "variant-volume-feature-unit-symbol"
                }
              }
            ]
          }
        ],
        images: [
          {
            allowedToDownload: true,
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            containerId: "containerId",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "master-image",
            realFileName: "master-image",
            url: "variant-master-image-url-master",
            format: null
          },
          {
            allowedToDownload: true,
            assetType: ImageAssetTypesEnum.GALLERY,
            containerId: "containerId",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "master-image",
            realFileName: "master-image",
            url: "variant-image-url-gallery-1",
            format: null
          },
          {
            allowedToDownload: true,
            assetType: ImageAssetTypesEnum.GALLERY,
            containerId: "containerId",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "master-image",
            realFileName: "master-image",
            url: "variant-image-url-gallery-2",
            format: null
          }
        ],
        path: "/p/some-product-path"
      });

      const result = createSchemaOrgDataForPdpPage(
        product,
        variant,
        countryCode
      );

      const expectedResult = {
        "@context": "https://schema.org",
        "@type": "Product",
        award: "awards-asset-type-name",
        brand: {
          "@type": "Brand",
          name: "brand-category-name"
        },
        color: "variant-color-value",
        description: "variant-long-desc",
        height: {
          "@type": "QuantitativeValue",
          value: "variant-height-value",
          valueReference: "variant-height-feature-unit-symbol"
        },
        image: "variant-master-image-url-master",
        logo: "brand-category-image-url",
        material: "variant-materials-value",
        model: "product-name",
        name: "product-name",
        pattern: "variant-texture-family-value",
        potentialAction: [
          "variant-image-url-gallery-1",
          "variant-image-url-gallery-2"
        ],
        productID: "variant-code",
        size: "variant-length-valuevariant-length-feature-unit-symbol x variant-thickness-valuevariant-thickness-feature-unit-symbol x variant-width-valuevariant-width-feature-unit-symbol x variant-height-valuevariant-height-feature-unit-symbol",
        url: "/no/p/some-product-path",
        weight: {
          "@type": "QuantitativeValue",
          value: "variant-weight-per-price-value",
          valueReference: "variant-weight-per-price-feature-unit-symbol"
        },
        width: {
          "@type": "QuantitativeValue",
          value: "variant-width-value",
          valueReference: "variant-width-feature-unit-symbol"
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return all information for schemaOrg if all data exists in base product", () => {
      const product = createBaseProduct({
        classifications: [
          {
            code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            features: [
              {
                name: FeatureCodeEnum.COLOUR,
                code: FeatureCodeEnum.COLOUR,
                featureValues: [
                  {
                    value: "variant-color-value",
                    code: "variant-color-code"
                  }
                ],
                featureUnit: {
                  name: "variant-color-feature-unit-name",
                  unitType: "variant-color-feature-unit-unit-type",
                  symbol: "variant-color-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.TEXTURE_FAMILY,
                code: FeatureCodeEnum.TEXTURE_FAMILY,
                featureValues: [
                  {
                    value: "variant-texture-family-value",
                    code: "variant-texture-family-code"
                  }
                ],
                featureUnit: {
                  name: "variant-texture-family-feature-unit-name",
                  unitType: "variant-texture-family-feature-unit-unit-type",
                  symbol: "variant-texture-family-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.GENERAL_INFORMATION,
            name: ClassificationCodeEnum.GENERAL_INFORMATION,
            features: [
              {
                name: FeatureCodeEnum.MATERIALS,
                code: FeatureCodeEnum.MATERIALS,
                featureValues: [
                  {
                    value: "variant-materials-value",
                    code: "variant-materials-code"
                  }
                ],
                featureUnit: {
                  name: "variant-materials-feature-unit-name",
                  unitType: "variant-materials-feature-unit-unit-type",
                  symbol: "variant-materials-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
            name: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
            features: [
              {
                name: FeatureCodeEnum.WEIGHT_PER_PRICE,
                code: FeatureCodeEnum.WEIGHT_PER_PRICE,
                featureValues: [
                  {
                    value: "variant-weight-per-price-value",
                    code: "variant-weight-per-price-code"
                  }
                ],
                featureUnit: {
                  name: "variant-weight-per-price-feature-unit-name",
                  unitType: "variant-weight-per-price-feature-unit-unit-type",
                  symbol: "variant-weight-per-price-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.NET_WEIGHT,
                code: FeatureCodeEnum.NET_WEIGHT,
                featureValues: [
                  {
                    value: "variant-net-weight-value",
                    code: "variant-net-weight-code"
                  }
                ],
                featureUnit: {
                  name: "variant-net-weight-feature-unit-name",
                  unitType: "variant-net-weight-feature-unit-unit-type",
                  symbol: "variant-net-weight-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.GROSS_WEIGHT,
                code: FeatureCodeEnum.GROSS_WEIGHT,
                featureValues: [
                  {
                    value: "variant-gross-weight-value",
                    code: "variant-gross-weight-code"
                  }
                ],
                featureUnit: {
                  name: "variant-gross-weight-feature-unit-name",
                  unitType: "variant-gross-weight-feature-unit-unit-type",
                  symbol: "variant-gross-weight-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.WEIGHT_PER_SQM,
                code: FeatureCodeEnum.WEIGHT_PER_SQM,
                featureValues: [
                  {
                    value: "variant-weight-per-sqm-value",
                    code: "variant-weight-per-sqm-code"
                  }
                ],
                featureUnit: {
                  name: "variant-weight-per-sqm-feature-unit-name",
                  unitType: "variant-weight-per-sqm-feature-unit-unit-type",
                  symbol: "variant-weight-per-sqm-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.WEIGHT_PER_PALLET,
                code: FeatureCodeEnum.WEIGHT_PER_PALLET,
                featureValues: [
                  {
                    value: "variant-weight-per-pallet-value",
                    code: "variant-weight-per-pallet-code"
                  }
                ],
                featureUnit: {
                  name: "variant-weight-per-pallet-feature-unit-name",
                  unitType: "variant-weight-per-pallet-feature-unit-unit-type",
                  symbol: "variant-weight-per-pallet-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.MEASUREMENTS,
            name: ClassificationCodeEnum.MEASUREMENTS,
            features: [
              {
                name: FeatureCodeEnum.WIDTH,
                code: FeatureCodeEnum.WIDTH,
                featureValues: [
                  {
                    value: "variant-width-value",
                    code: "variant-width-code"
                  }
                ],
                featureUnit: {
                  name: "variant-width-feature-unit-name",
                  unitType: "variant-width-feature-unit-unit-type",
                  symbol: "variant-width-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.HEIGHT,
                code: FeatureCodeEnum.HEIGHT,
                featureValues: [
                  {
                    value: "variant-height-value",
                    code: "variant-height-code"
                  }
                ],
                featureUnit: {
                  name: "variant-height-feature-unit-name",
                  unitType: "variant-height-feature-unit-unit-type",
                  symbol: "variant-height-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.LENGTH,
                code: FeatureCodeEnum.LENGTH,
                featureValues: [
                  {
                    value: "variant-length-value",
                    code: "variant-length-code"
                  }
                ],
                featureUnit: {
                  name: "variant-length-feature-unit-name",
                  unitType: "variant-length-feature-unit-unit-type",
                  symbol: "variant-length-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.VOLUME,
                code: FeatureCodeEnum.VOLUME,
                featureValues: [
                  {
                    value: "variant-volume-value",
                    code: "variant-volume-code"
                  }
                ],
                featureUnit: {
                  name: "variant-volume-feature-unit-name",
                  unitType: "variant-volume-feature-unit-unit-type",
                  symbol: "variant-volume-feature-unit-symbol"
                }
              }
            ]
          }
        ],
        assets: [
          {
            url: "awards-asset-type-url",
            assetType: "AWARDS",
            name: "awards-asset-type-name"
          }
        ],
        categories: [
          {
            code: "brand-category-code",
            name: "brand-category-name",
            categoryType: "Brand",
            image: {
              allowedToDownload: true,
              fileSize: 99999,
              mime: "image/png",
              name: "brand-category-image-name",
              realFileName: "brand-category-image-name",
              url: "brand-category-image-url"
            }
          }
        ],
        images: [
          {
            allowedToDownload: true,
            assetType: ImageAssetTypesEnum.MASTER_IMAGE,
            containerId: "containerId",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "master-image",
            realFileName: "master-image",
            url: "variant-master-image-url-master",
            format: null
          },
          {
            allowedToDownload: true,
            assetType: ImageAssetTypesEnum.GALLERY,
            containerId: "containerId",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "master-image",
            realFileName: "master-image",
            url: "variant-image-url-gallery-1",
            format: null
          },
          {
            allowedToDownload: true,
            assetType: ImageAssetTypesEnum.GALLERY,
            containerId: "containerId",
            fileSize: 99999,
            mime: "image/jpeg",
            name: "master-image",
            realFileName: "master-image",
            url: "variant-image-url-gallery-2",
            format: null
          }
        ]
      });
      const variant = createVariantOption({
        path: "/p/some-product-path"
      });

      const result = createSchemaOrgDataForPdpPage(
        product,
        variant,
        countryCode
      );

      const expectedResult = {
        "@context": "https://schema.org",
        "@type": "Product",
        award: "awards-asset-type-name",
        brand: {
          "@type": "Brand",
          name: "brand-category-name"
        },
        color: "variant-color-value",
        description: "variant-long-desc",
        height: {
          "@type": "QuantitativeValue",
          value: "variant-height-value",
          valueReference: "variant-height-feature-unit-symbol"
        },
        image: "variant-master-image-url-master",
        logo: "brand-category-image-url",
        material: "variant-materials-value",
        model: "product-name",
        name: "product-name",
        pattern: "variant-texture-family-value",
        potentialAction: [
          "variant-image-url-gallery-1",
          "variant-image-url-gallery-2"
        ],
        productID: "variant-code",
        size: "variant-length-valuevariant-length-feature-unit-symbol x variant-width-valuevariant-width-feature-unit-symbol x variant-height-valuevariant-height-feature-unit-symbol",
        url: "/no/p/some-product-path",
        weight: {
          "@type": "QuantitativeValue",
          value: "variant-weight-per-price-value",
          valueReference: "variant-weight-per-price-feature-unit-symbol"
        },
        width: {
          "@type": "QuantitativeValue",
          value: "variant-width-value",
          valueReference: "variant-width-feature-unit-symbol"
        }
      };

      expect(result).toEqual(expectedResult);
    });

    it("should return undefined for schemaOrg object props if data does not exist", () => {
      const product = createBaseProduct({
        classifications: [
          {
            code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
            features: [
              {
                name: FeatureCodeEnum.COLOUR,
                code: undefined,
                featureValues: [
                  {
                    value: "variant-color-value",
                    code: "variant-color-code"
                  }
                ],
                featureUnit: {
                  name: "variant-color-feature-unit-name",
                  unitType: "variant-color-feature-unit-unit-type",
                  symbol: "variant-color-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.TEXTURE_FAMILY,
                code: FeatureCodeEnum.TEXTURE_FAMILY,
                featureValues: [
                  {
                    value: "variant-texture-family-value",
                    code: "variant-texture-family-code"
                  }
                ],
                featureUnit: {
                  name: "variant-texture-family-feature-unit-name",
                  unitType: "variant-texture-family-feature-unit-unit-type",
                  symbol: "variant-texture-family-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.GENERAL_INFORMATION,
            name: ClassificationCodeEnum.GENERAL_INFORMATION,
            features: [
              {
                name: FeatureCodeEnum.MATERIALS,
                code: FeatureCodeEnum.MATERIALS,
                featureValues: [
                  {
                    value: "variant-materials-value",
                    code: "variant-materials-code"
                  }
                ],
                featureUnit: {
                  name: "variant-materials-feature-unit-name",
                  unitType: "variant-materials-feature-unit-unit-type",
                  symbol: "variant-materials-feature-unit-symbol"
                }
              }
            ]
          },
          {
            code: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
            name: ClassificationCodeEnum.WEIGHT_ATTRIBUTES,
            features: [
              {
                name: FeatureCodeEnum.WEIGHT_PER_PRICE,
                code: FeatureCodeEnum.WEIGHT_PER_PRICE,
                featureValues: undefined,
                featureUnit: undefined
              },
              {
                name: FeatureCodeEnum.NET_WEIGHT,
                code: FeatureCodeEnum.NET_WEIGHT,
                featureValues: undefined,
                featureUnit: undefined
              },
              {
                name: FeatureCodeEnum.GROSS_WEIGHT,
                code: FeatureCodeEnum.GROSS_WEIGHT,
                featureValues: undefined,
                featureUnit: undefined
              },
              {
                name: FeatureCodeEnum.WEIGHT_PER_SQM,
                code: FeatureCodeEnum.WEIGHT_PER_SQM,
                featureValues: undefined,
                featureUnit: undefined
              },
              {
                name: FeatureCodeEnum.WEIGHT_PER_PALLET,
                code: FeatureCodeEnum.WEIGHT_PER_PALLET,
                featureValues: undefined,
                featureUnit: undefined
              }
            ]
          },
          {
            code: ClassificationCodeEnum.MEASUREMENTS,
            name: ClassificationCodeEnum.MEASUREMENTS,
            features: [
              {
                name: FeatureCodeEnum.WIDTH,
                code: FeatureCodeEnum.WIDTH,
                featureValues: undefined,
                featureUnit: undefined
              },
              {
                name: FeatureCodeEnum.HEIGHT,
                code: FeatureCodeEnum.HEIGHT,
                featureValues: undefined,
                featureUnit: undefined
              },
              {
                name: FeatureCodeEnum.LENGTH,
                code: undefined,
                featureValues: [
                  {
                    value: "variant-length-value",
                    code: "variant-length-code"
                  }
                ],
                featureUnit: {
                  name: "variant-length-feature-unit-name",
                  unitType: "variant-length-feature-unit-unit-type",
                  symbol: "variant-length-feature-unit-symbol"
                }
              },
              {
                name: FeatureCodeEnum.VOLUME,
                code: FeatureCodeEnum.VOLUME,
                featureValues: undefined,
                featureUnit: undefined
              }
            ]
          }
        ],
        assets: undefined,
        categories: undefined,
        images: undefined
      });
      const variant = createVariantOption({
        path: "/p/some-product-path"
      });

      const result = createSchemaOrgDataForPdpPage(
        product,
        variant,
        countryCode
      );

      const expectedResult = {
        "@context": "https://schema.org",
        "@type": "Product",
        award: undefined,
        brand: undefined,
        color: undefined,
        description: "variant-long-desc",
        height: {
          "@type": "QuantitativeValue",
          value: undefined,
          valueReference: undefined
        },
        image: undefined,
        logo: undefined,
        material: "variant-materials-value",
        model: "product-name",
        name: "product-name",
        pattern: "variant-texture-family-value",
        potentialAction: undefined,
        productID: "variant-code",
        size: "undefinedxundefinedundefined",
        url: "/no/p/some-product-path",
        weight: {
          "@type": "QuantitativeValue",
          value: undefined,
          valueReference: undefined
        },
        width: {
          "@type": "QuantitativeValue",
          value: undefined,
          valueReference: undefined
        }
      };

      expect(result).toEqual(expectedResult);
    });
    it("should return undefined for brand logo schemaOrg object prop if data of brand image does not exist", () => {
      const product = createBaseProduct({
        categories: [
          {
            code: "brand-category-code",
            name: "brand-category-name",
            categoryType: "Brand",
            image: undefined
          }
        ]
      });
      const variant = createVariantOption();

      const result = createSchemaOrgDataForPdpPage(
        product,
        variant,
        countryCode
      );

      const expectedResult = {
        "@context": "https://schema.org",
        "@type": "Product",
        award: undefined,
        brand: {
          "@type": "Brand",
          name: "brand-category-name"
        },
        color: undefined,
        description: "variant-long-desc",
        height: undefined,
        image: undefined,
        logo: undefined,
        material: undefined,
        model: "product-name",
        name: "product-name",
        pattern: undefined,
        potentialAction: undefined,
        productID: "variant-code",
        size: undefined,
        url: "/no/some-path",
        weight: undefined,
        width: undefined
      };

      expect(result).toEqual(expectedResult);
    });
  });
});
