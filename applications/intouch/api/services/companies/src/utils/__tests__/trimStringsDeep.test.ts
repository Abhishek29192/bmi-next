import trimStringsDeep from "../trimStringsDeep";

describe("trimStringsDeep", () => {
  it("should return defaults as passed", () => {
    expect(trimStringsDeep({})).toStrictEqual({});
    expect(trimStringsDeep(null)).toStrictEqual(null);
    expect(trimStringsDeep(undefined)).toStrictEqual(undefined);
  });

  it("should trim strings inside of object", () => {
    expect(
      trimStringsDeep({
        a: "true   ",
        b: 2,
        c: undefined,
        d: null,
        e: {},
        f: { g: "   foo bar " },
        h: false
      })
    ).toStrictEqual({
      a: "true",
      b: 2,
      c: undefined,
      d: null,
      e: {},
      f: { g: "foo bar" },
      h: false
    });
  });
});
