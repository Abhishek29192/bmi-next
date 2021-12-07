import { getValidHttpUrl } from "../url-helpers";

describe("url-helpers tests", () => {
  it("should return URL link if the url is valid", () => {
    const url = "http://localhost:8000/some/file-name.pdf";
    const result = getValidHttpUrl(url);
    const expectedResult = url;
    expect(result).toEqual(expectedResult);
  });
  it("should return URL link if the url is valid, for only origin part", () => {
    const url = "http://localhost:8000";
    const result = getValidHttpUrl(url);
    const expectedResult = "http://localhost:8000/";
    expect(result).toEqual(expectedResult);
  });
  it("should fire an Error if url is wrong format", () => {
    const url = "//localhost:8000/some/file-name.pdf";
    expect(() => getValidHttpUrl(url)).toThrow(Error);
    expect(() => getValidHttpUrl(url)).toThrow(`Not valid url: ${url}`);
  });
});
