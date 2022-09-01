process.env.CONTENTFUL_TAGS = '{"en": "market__endor", "no": "market__norway"}';

import { parseMarketCompanyTag } from "../contentful";

describe("Get target company tag", () => {
  it("should return proper tag string", async () => {
    expect(parseMarketCompanyTag("en")).toBe("market__endor");
  });
  it("should return market__norway tag string", async () => {
    expect(parseMarketCompanyTag("no")).toBe("market__norway");
  });
  it("should return market__endor tag string", async () => {
    expect(parseMarketCompanyTag("XX")).toBe("market__endor");
  });
});
