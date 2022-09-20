import { shallowEqual } from "../isObjectEqual";

describe("isObjectEqual shallowEqual", () => {
  it("returns true", () => {
    const res = shallowEqual(
      { mock: "mock", mock1: "mock1" },
      { mock: "mock", mock1: "mock1" }
    );
    expect(res).toBeTruthy();
  });

  it("returns false", () => {
    let res = shallowEqual({ mock: "mock" }, { mock: "mock", mock1: "mock1" });
    expect(res).toBeFalsy();

    res = shallowEqual(
      { mock: "mock", mock1: "Mock1" },
      { mock: "mock", mock1: "mock1" }
    );
    expect(res).toBeFalsy();

    res = shallowEqual(
      { mock: "mock", mock5: "mock5" },
      { mock: "mock", mock7: "mock7" }
    );
    expect(res).toBeFalsy();
  });
});
