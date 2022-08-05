import { overwriteMarketHeader } from "../clientGateway";

describe("Client gateway", () => {
  const logger = () => ({
    info: () => {},
    error: () => {}
  });
  it("should overwrite the market header if first login", () => {
    const req = {
      logger,
      user: {
        [`${process.env.AUTH0_NAMESPACE}/intouch_market_code`]: "no"
      },
      headers: {
        "x-request-market-domain": "en"
      }
    };

    expect(overwriteMarketHeader(req)).toEqual("no");
  });
  it("should not overwrite the market header if no user", () => {
    const req = {
      logger,
      user: null,
      headers: {
        "x-request-market-domain": "en"
      }
    };

    expect(overwriteMarketHeader(req)).toEqual("en");
  });
  // let the app do the necessary redirect
  it("should not overwrite the market header if user with market", () => {
    const req = {
      logger,
      user: {
        market: {
          domain: "no"
        }
      },
      headers: {
        "x-request-market-domain": "en"
      }
    };

    expect(overwriteMarketHeader(req)).toEqual("en");
  });
});
