process.env.CONTENTFUL_TAGS = '{"en": "market__endor", "no": "market__norway"}';

import {
  sortArrayByField,
  getFileExtension,
  getOneTrustToken,
  parseMarketTag
} from "../";

describe("sortArrayByField utility", () => {
  it("should return sorted array", () => {
    const sortedArray = sortArrayByField(
      [
        { id: 1, name: "c" },
        { id: 2, name: "a" },
        { id: 3, name: "b" }
      ],
      "name"
    );
    expect(sortedArray).toEqual([
      { id: 2, name: "a" },
      { id: 3, name: "b" },
      { id: 1, name: "c" }
    ]);
  });

  it("should return undefined if array not exist ", () => {
    expect(sortArrayByField(undefined, "name")).toEqual(undefined);
    expect(sortArrayByField(null, "name")).toEqual(undefined);
  });

  it("return original array when array is missing field name", () => {
    const array = [
      { id: 1, name: "c" },
      { id: 2, name: "a" },
      { id: 3, name: "b" }
    ];
    const result = sortArrayByField(array, "test");
    expect(result).toBe(array);
  });
});

describe("getFileExtension", () => {
  it("should return extension object", () => {
    const filename = "test.pdf";
    const { name, extension } = getFileExtension(filename);

    expect(name).toBe("test");
    expect(extension).toBe("pdf");
  });

  it("should return filename if extension", () => {
    const filename = "testwithnoextension";
    const { name, extension } = getFileExtension(filename);

    expect(name).toBe(filename);
    expect(extension).toBe(filename);
  });
});

describe("getOneTrustToken", () => {
  it("should return empty value", () => {
    const res = getOneTrustToken('{"en": ""}', "en");
    expect(res).toBeNull();
  });
  it("should return false. Object is empty", () => {
    const res = getOneTrustToken("", "en");
    expect(res).toBeFalsy();
  });
  it("should return false. Object is not defined", () => {
    const res = getOneTrustToken(null, "en");
    expect(res).toBeFalsy();
  });
});

describe("parseMarketTag", () => {
  it("should return market__endor value", () => {
    expect(parseMarketTag("en")).toBe("market__endor");
  });
  it("should return market__norway value", () => {
    expect(parseMarketTag("no")).toBe("market__norway");
  });
  it("should return non_existing_tag value", () => {
    expect(parseMarketTag("XX")).toBe("non_existing_tag");
  });
});
