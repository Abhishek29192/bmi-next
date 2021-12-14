import { formatDateByLanguage } from "../date";

describe("Date Util", () => {
  it("should return formated date", () => {
    const date = "2022-12-01";
    expect(formatDateByLanguage(date, "EN")).toBe("1 December 2022");
    expect(formatDateByLanguage(date, "NO")).toBe("1. desember 2022");
    expect(formatDateByLanguage(date, "DE")).toBe("1. Dezember 2022");
  });
});
