import {
  createProduct as createESProduct,
  Product
} from "@bmi/elasticsearch-types";
import {
  createAppearanceAttributesClassification,
  createFeature,
  createFeatureValue
} from "@bmi/pim-types";
import { createSizeLabel, findSurface } from "../productListerPageUtils";

const testProduct = createESProduct({
  code: "test_product",
  name: "Test"
});
describe("createSizeLabel", () => {
  it("returns empty string when no measurement values are provided", () => {
    const product = {} as Product;
    const result = createSizeLabel(product);
    expect(result).toEqual("");
  });

  it("returns the correct size label when measurement values are provided", () => {
    const product = {
      ...testProduct,
      MEASUREMENTS$WIDTH: [{ name: "10 cm", value: "10cm", code: "10cm" }],
      MEASUREMENTS$LENGTH: [{ name: "20 cm", value: "20cm", code: "20cm" }],
      MEASUREMENTS$HEIGHT: [{ name: "30 cm", value: "30cm", code: "30cm" }],
      MEASUREMENTS$THICKNESS: [{ name: "5 cm", value: "5 cm", code: "5 cm" }]
    };

    const result = createSizeLabel(product);
    expect(result).toEqual("20x10x30x5cm");
  });

  it("returns the correct size label when measurement values don't match", () => {
    const product = {
      ...testProduct,
      MEASUREMENTS$WIDTH: [{ name: "10 cm", value: "10cm", code: "10cm" }],
      MEASUREMENTS$LENGTH: [{ name: "20 m", value: "20m", code: "20m" }],
      MEASUREMENTS$HEIGHT: [{ name: "30 mm", value: "30mm", code: "30mm" }]
    };

    const result = createSizeLabel(product);
    expect(result).toEqual("20m x 10cm x 30mm");
  });
});

describe("findSurface", () => {
  it("returns empty value and mc when no surface is found", () => {
    const product = {
      ...testProduct,
      classifications: []
    };
    const result = findSurface(product);
    expect(result).toEqual({ value: "", mc: undefined });
  });

  it("returns the correct surface value and mc when surface is found", () => {
    const product = {
      ...testProduct,
      classifications: [
        createAppearanceAttributesClassification({
          features: [
            createFeature({
              code: `appearanceAttributes.textureFamily`,
              name: "Texture Family",
              featureValues: [createFeatureValue({ value: "matte" })]
            })
          ]
        })
      ]
    } as Product;
    const result = findSurface(product);
    expect(result).toEqual({
      value: "matte",
      mc: "Texture Family"
    });
  });
});
