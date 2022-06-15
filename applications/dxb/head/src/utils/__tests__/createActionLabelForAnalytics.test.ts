import { createActionLabel } from "../createActionLabelForAnalytics";
import { createProduct } from "../../__tests__/helpers/ProductHelper";
import createMeasurements from "../../__tests__/helpers/MeasurementsHelper";

describe("test createLabel functionality", () => {
  it("test with all data", () => {
    const product = createProduct({
      name: "product-name",
      colour: "red",
      textureFamily: "smooth"
    });
    const res = createActionLabel(
      product.name,
      product.colour,
      product.textureFamily,
      product.measurements.label
    );
    expect(res).toEqual("product-name-red-smooth-6x7x8symbol");
  });
  it("test with no data", () => {
    const product = createProduct({
      name: "product-name",
      colour: undefined,
      textureFamily: undefined,
      measurements: createMeasurements({
        label: undefined
      })
    });
    const res = createActionLabel(
      product.name,
      product.colour,
      product.textureFamily,
      product.measurements.label
    );
    expect(res).toEqual("product-name");
  });
  it("test with partial data", () => {
    const product = createProduct({
      name: "product-name",
      colour: undefined,
      textureFamily: undefined,
      measurements: createMeasurements({
        label: "180x10x10classification-feature-feature-unit-symbol"
      })
    });
    const res = createActionLabel(
      product.name,
      product.colour,
      product.textureFamily,
      product.measurements.label
    );
    expect(res).toEqual(
      "product-name-180x10x10classification-feature-feature-unit-symbol"
    );
  });
});
