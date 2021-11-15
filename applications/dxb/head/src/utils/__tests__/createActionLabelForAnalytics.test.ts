import { createActionLabel } from "../createActionLabelForAnalytics";
import {
  createBaseProduct,
  createVariantOption
} from "../../__tests__/PimDocumentProductHelper";
import createClassification, {
  createFeature
} from "../../__tests__/ClassificationHelper";
import {
  ClassificationCodeEnum,
  FeatureCodeEnum
} from "../../components/types/pim";

const baseProduct = createBaseProduct();
const classificationConfig = {
  [ClassificationCodeEnum.APPEARANCE_ATTRIBUTE]: [
    { attrName: FeatureCodeEnum.COLOUR },
    {
      attrName: FeatureCodeEnum.TEXTURE_FAMILY,
      separator: " | ",
      fromStart: true
    }
  ],
  [ClassificationCodeEnum.MEASUREMENTS]: [
    { attrName: FeatureCodeEnum.LENGTH, separator: "x" },
    { attrName: FeatureCodeEnum.WIDTH, separator: "x" },
    { attrName: FeatureCodeEnum.HEIGHT, separator: "x" }
  ]
};
describe("test createLabel functionality", () => {
  it("test with all data", () => {
    const product = createVariantOption({
      classifications: [
        createClassification({
          code: "appearanceAttributes",
          name: "appearanceAttributes",
          features: [
            createFeature({
              code: "colour",
              featureValues: [{ code: "RED", value: "red" }]
            }),
            createFeature({
              code: "texturefamily",
              featureValues: [{ code: "SMOOTH", value: "smooth" }]
            })
          ]
        }),
        createClassification({
          code: "measurements",
          name: "measurements",
          features: [
            createFeature({
              code: "height",
              featureValues: [{ value: "100" }]
            }),
            createFeature({
              code: "length",
              featureValues: [{ value: "100" }]
            }),
            createFeature({
              code: "width",
              featureValues: [{ value: "100" }]
            })
          ]
        })
      ]
    });
    const res = createActionLabel(baseProduct, product, classificationConfig);
    expect(res).toEqual(
      "product-name-red | smooth-100x100x100classification-feature-feature-unit-symbol"
    );
  });
  it("test with no data", () => {
    const product = createVariantOption();
    const res = createActionLabel(baseProduct, product, classificationConfig);
    expect(res).toEqual("product-name");
  });
  it("test with partial data", () => {
    const product = createVariantOption({
      classifications: [
        createClassification({
          code: "measurements",
          name: "measurements",
          features: [
            createFeature({
              code: "height",
              featureValues: [{ value: "10" }]
            }),
            createFeature({
              code: "length",
              featureValues: [{ value: "180" }]
            }),
            createFeature({
              code: "width",
              featureValues: [{ value: "10" }]
            })
          ]
        })
      ]
    });
    const res = createActionLabel(baseProduct, product, classificationConfig);
    expect(res).toEqual(
      "product-name-180x10x10classification-feature-feature-unit-symbol"
    );
  });
});
