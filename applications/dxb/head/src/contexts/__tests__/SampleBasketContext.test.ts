import createProduct from "../../__tests__/helpers/ProductHelper";
import {
  ACTION_TYPES,
  basketReducer,
  createSample
} from "../SampleBasketContext";

describe("createSample", () => {
  it("maps a fully populated variant properly", () => {
    const product = createProduct();

    const sample = createSample(product);

    expect(sample).toStrictEqual({
      name: product.name,
      code: product.code,
      path: product.path,
      image: "http://localhost:8000/image-main-source.jpg",
      colour: "colour",
      measurements: "6x7x8symbol",
      textureFamily: "texture-family"
    });
  });
});

describe("Test basket context", () => {
  it("should handle adding existing item to basket", () => {
    const product = createProduct();

    const sample = createSample(product);

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
