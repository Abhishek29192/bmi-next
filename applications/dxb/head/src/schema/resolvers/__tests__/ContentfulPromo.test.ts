import * as process from "process";
import ContentfulPromo from "../ContentfulPromo";

describe("date", () => {
  it("returns correctly formatted date if present", () => {
    const originalGatsbyMarketLocaleCode =
      process.env.GATSBY_MARKET_LOCALE_CODE;
    process.env.GATSBY_MARKET_LOCALE_CODE = "en-GB";

    const formattedDate = ContentfulPromo.date.resolve({
      date: "2023-08-03T08:23:59+0000"
    });

    expect(formattedDate).toEqual("3 August 2023");

    process.env.GATSBY_MARKET_LOCALE_CODE = originalGatsbyMarketLocaleCode;
  });

  it("returns correctly formatted date if present for different locale", () => {
    const originalGatsbyMarketLocaleCode =
      process.env.GATSBY_MARKET_LOCALE_CODE;
    process.env.GATSBY_MARKET_LOCALE_CODE = "fr-FR";

    const formattedDate = ContentfulPromo.date.resolve({
      date: "2023-08-03T08:23:59+0000"
    });

    expect(formattedDate).toEqual("3 août 2023");

    process.env.GATSBY_MARKET_LOCALE_CODE = originalGatsbyMarketLocaleCode;
  });

  it("returns correctly formatted date if present and locale is no-NB (v8 doesn't handle it properly)", () => {
    const originalGatsbyMarketLocaleCode =
      process.env.GATSBY_MARKET_LOCALE_CODE;
    process.env.GATSBY_MARKET_LOCALE_CODE = "no-NB";

    const formattedDate = ContentfulPromo.date.resolve({
      date: "2023-08-03T08:23:59+0000"
    });

    expect(formattedDate).toEqual("3. august 2023");

    process.env.GATSBY_MARKET_LOCALE_CODE = originalGatsbyMarketLocaleCode;
  });

  it("returns null if date is not present", () => {
    const originalGatsbyMarketLocaleCode =
      process.env.GATSBY_MARKET_LOCALE_CODE;
    process.env.GATSBY_MARKET_LOCALE_CODE = "en-GB";

    const formattedDate = ContentfulPromo.date.resolve({
      date: null
    });

    expect(formattedDate).toBeNull();

    process.env.GATSBY_MARKET_LOCALE_CODE = originalGatsbyMarketLocaleCode;
  });
});
