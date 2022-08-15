process.env.CONTENTFUL_TAGS = '{"en": "market__endor"}';

import { parseMarketCompanyTag } from "../contentful";

describe("Get target company tag", () => {
  it("should return proper tag string", async () => {
    expect(parseMarketCompanyTag("en")).toBe("market__endor");
  });
});
