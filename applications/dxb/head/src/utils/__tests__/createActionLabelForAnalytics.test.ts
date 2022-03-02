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
import { combineVariantClassifications } from "../filters";

const baseProduct = createBaseProduct();
const product = createVariantOption({
  classifications: [
    createClassification({
      code: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
      name: ClassificationCodeEnum.APPEARANCE_ATTRIBUTE,
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
      code: ClassificationCodeEnum.MEASUREMENTS,
      name: ClassificationCodeEnum.MEASUREMENTS,
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
const classifications = combineVariantClassifications(baseProduct, product);
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
    const res = createActionLabel(
      baseProduct.name,
      classifications,
      classificationConfig
    );
    expect(res).toEqual(
      "product-name-red | smooth-100x100x100classification-feature-feature-unit-symbol"
    );
  });
  it("test with no data", () => {
    const res = createActionLabel(baseProduct.name, [], classificationConfig);
    expect(res).toEqual("product-name");
  });
  it("test with partial data", () => {
    const product = createVariantOption({
      classifications: [
        createClassification({
          code: ClassificationCodeEnum.MEASUREMENTS,
          name: ClassificationCodeEnum.MEASUREMENTS,
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
    const classifications = combineVariantClassifications(baseProduct, product);
    const res = createActionLabel(
      baseProduct.name,
      classifications,
      classificationConfig
    );
    expect(res).toEqual(
      "product-name-180x10x10classification-feature-feature-unit-symbol"
    );
  });
});