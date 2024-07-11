import { isFulfilled, isRejected } from "../promise";

describe("isFulfilled", () => {
  it("should return true if the promise is fulfilled", () => {
    const fulfilledPromiseResult: PromiseFulfilledResult<string> = {
      status: "fulfilled",
      value: "some value"
    };

    expect(isFulfilled(fulfilledPromiseResult)).toBe(true);
  });

  it("should return false if the promise is rejected", () => {
    const rejectedPromiseResult: PromiseRejectedResult = {
      status: "rejected",
      reason: "some error"
    };

    expect(isFulfilled(rejectedPromiseResult)).toBe(false);
  });
});

describe("isRejected", () => {
  it("should return true if the promise is rejected", () => {
    const rejectedPromiseResult: PromiseRejectedResult = {
      status: "rejected",
      reason: "some error"
    };

    expect(isRejected(rejectedPromiseResult)).toBe(true);
  });

  it("should return false if the promise is fulfilled", () => {
    const fulfilledPromiseResult: PromiseFulfilledResult<string> = {
      status: "fulfilled",
      value: "some value"
    };

    expect(isRejected(fulfilledPromiseResult)).toBe(false);
  });
});
