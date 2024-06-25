import getCategoryType from "../getCategoryType";

describe("getCategoryType", () => {
  it("returns type for Pitched", () => {
    expect(getCategoryType("Pitched")).toEqual("pitched");
  });

  it("returns type for Flat", () => {
    expect(getCategoryType("Flat")).toEqual("flat");
  });

  it("returns type for Other", () => {
    expect(getCategoryType("Other")).toEqual("other");
  });
});
