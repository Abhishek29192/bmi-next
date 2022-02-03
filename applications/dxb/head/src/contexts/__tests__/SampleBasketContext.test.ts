import {
  ACTION_TYPES,
  basketReducer
} from "../../contexts/SampleBasketContext";
import createClassification from "../../__tests__/ClassificationHelper";

const createSample = () => ({
  name: "sample-name",
  code: "sample-code",
  path: "sample-path",
  classifications: [createClassification()],
  image: "sample-image"
});

describe("Test basket context", () => {
  it("should handle adding existing item to basket", () => {
    const sample = createSample();
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
