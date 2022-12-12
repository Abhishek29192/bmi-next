import { formatDate, getDateOnlyString } from "../date";

describe("formatDate utility", () => {
  it("return correct date", () => {
    expect(formatDate("12/12/2022")).toEqual("12 December 2022");
  });
});

describe("getDateOnlyString utility", () => {
  it("return correct value when empty", () => {
    expect(getDateOnlyString("")).toEqual("");
  });

  it("return correct value when is not empty", () => {
    expect(getDateOnlyString("2022-01-27 12:08:24.190645")).toEqual(
      "2022-01-27"
    );
  });
});
