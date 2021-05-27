import { marketRedirect } from "../market";

const { AUTH0_NAMESPACE } = process.env;

describe("marketRedirect", () => {
  let res;
  let req;
  let user;
  const mockWriteHead = jest.fn();
  const mockEnd = jest.fn();

  beforeEach(() => {
    process.env.AUTH0_COOKIE_DOMAIN = "local.intouch";
    jest.resetAllMocks();
    res = {
      writeHead: mockWriteHead,
      end: mockEnd
    };
    user = {
      [`${AUTH0_NAMESPACE}/intouch_market_code`]: "es"
    };
  });

  it("should redirect to the right market", () => {
    req = {
      headers: {
        host: "en.local.intouch",
        "x-forwarded-proto": "http"
      }
    };

    marketRedirect(req, res, user);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: `http://es.local.intouch`
    });
  });

  it("should not redirect if already in the right market", () => {
    req = {
      headers: {
        host: "es.local.intouch",
        "x-forwarded-proto": "http"
      }
    };

    marketRedirect(req, res, user);

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });

  it("should not redirect localhost", () => {
    process.env.AUTH0_COOKIE_DOMAIN = "localhost";

    marketRedirect(req, res, user);

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });
});
