import {
  createImage,
  createProduct,
  createVariantOption
} from "@bmi/pim-types";
import {
  ACTION_TYPES,
  basketReducer,
  createSample
} from "../SampleBasketContext";
import createClassification from "../../__tests__/ClassificationHelper";
import { ImageFormatEnum, Product } from "../../components/types/pim";

const createTestSample = () => ({
  name: "sample-name",
  code: "sample-code",
  path: "sample-path",
  classifications: [createClassification()],
  image: "sample-image"
});

describe("createSample", () => {
  it("maps a fully populated variant properly", () => {
    const product = createProduct({
      images: [
        createImage({
          assetType: "MASTER_IMAGE",
          format: ImageFormatEnum.PRODUCT_LISTING_CARD_SMALL_DESKTOP_TABLET,
          url: "http://localhost:8000/base-image"
        })
      ],
      variantOptions: [
        createVariantOption({
          images: [
            createImage({
              assetType: "MASTER_IMAGE",
              format: ImageFormatEnum.PRODUCT_LISTING_CARD_SMALL_DESKTOP_TABLET,
              url: "http://localhost:8000/variant-image"
            })
          ]
        })
      ]
    }) as unknown as Product;

    const sample = createSample(product, product.variantOptions[0]);

    expect(sample).toStrictEqual({
      name: product.name,
      code: product.variantOptions[0].code,
      path: product.variantOptions[0].path,
      image: "http://localhost:8000/variant-image",
      classifications: [
        {
          code: "variant-code",
          features: [
            {
              code: "classification-feature-code",
              featureUnit: {
                name: "unit-name",
                symbol: "symbol",
                unitType: "unit-type"
              },
              featureValues: [
                {
                  code: "code",
                  value: "value"
                }
              ],
              name: "name"
            }
          ],
          name: "name"
        },
        {
          code: "scoringWeightAttributes",
          features: [
            {
              code: "classification-feature-code",
              featureUnit: {
                name: "unit-name",
                symbol: "symbol",
                unitType: "unit-type"
              },
              featureValues: [
                {
                  code: "code",
                  value: "1.0"
                }
              ],
              name: "name"
            }
          ],
          name: "name"
        },
        {
          code: "appearanceAttributes",
          features: [
            {
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.colourfamily",
              featureUnit: {
                name: "unit-name",
                symbol: "symbol",
                unitType: "unit-type"
              },
              featureValues: [
                {
                  code: "code",
                  value: "red"
                }
              ],
              name: "name"
            },
            {
              code: "bmiClassificationCatalog/1.0/appearanceAttributes.texturefamily",
              featureUnit: {
                name: "unit-name",
                symbol: "symbol",
                unitType: "unit-type"
              },
              featureValues: [
                {
                  code: "code",
                  value: "glossy"
                }
              ],
              name: "name"
            }
          ],
          name: "name"
        },
        {
          code: "generalInformation",
          features: [
            {
              code: "bmiClassificationCatalog/1.0/generalInformation.materials",
              featureUnit: {
                name: "unit-name",
                symbol: "symbol",
                unitType: "unit-type"
              },
              featureValues: [
                {
                  code: "code",
                  value: "concrete"
                }
              ],
              name: "name"
            }
          ],
          name: "name"
        },
        {
          code: "measurements",
          features: [
            {
              code: "bmiClassificationCatalog/1.0/measurements.length",
              featureUnit: {
                name: "millimeter",
                symbol: "mm",
                unitType: "space"
              },
              featureValues: [
                {
                  code: "code",
                  value: "10"
                }
              ],
              name: "name"
            },
            {
              code: "bmiClassificationCatalog/1.0/measurements.width",
              featureUnit: {
                name: "millimeter",
                symbol: "mm",
                unitType: "space"
              },
              featureValues: [
                {
                  code: "code",
                  value: "20"
                }
              ],
              name: "name"
            },
            {
              code: "bmiClassificationCatalog/1.0/measurements.height",
              featureUnit: {
                name: "millimeter",
                symbol: "mm",
                unitType: "space"
              },
              featureValues: [
                {
                  code: "code",
                  value: "30"
                }
              ],
              name: "name"
            }
          ],
          name: "name"
        }
      ]
    });
  });
});

describe("Test basket context", () => {
  it("should handle adding existing item to basket", () => {
    const sample = createTestSample();
    const resolvedState = basketReducer(
      { products: [sample] },
      {
        type: ACTION_TYPES.BASKET_ADD,
        payload: sample
      }
    );
    expect(resolvedState).toEqual({ products: [sample] });
  });
});
