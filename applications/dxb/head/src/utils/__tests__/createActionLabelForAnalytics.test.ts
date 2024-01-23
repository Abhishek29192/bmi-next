import {
  createActionLabel,
  stringifyToObject
} from "../createActionLabelForAnalytics";
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
      product.measurements?.label
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
      product.measurements?.label
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
      product.measurements?.label
    );
    expect(res).toEqual(
      "product-name-180x10x10classification-feature-feature-unit-symbol"
    );
  });
});

describe("stringifyToObject", () => {
  it("should return undefined if to is undefined", () => {
    const to = undefined;
    const expectedResult = stringifyToObject(to);

    expect(expectedResult).toBeUndefined();
  });

  it("should return the to string value if to is of type string", () => {
    const to = "en/path";
    const expectedResult = stringifyToObject(to);

    expect(expectedResult).toBe(to);
  });

  it("should return a string value if to is of type object", () => {
    const to = { path: "en/path" };
    const expectedResult = stringifyToObject(to);

    expect(expectedResult).toBe('{"path":"en/path"}');
  });
});
