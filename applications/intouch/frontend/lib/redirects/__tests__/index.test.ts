import { marketRedirect } from "../market";

const { AUTH0_NAMESPACE } = process.env;

describe("marketRedirect", () => {
  let res;
  let req;
  let session;
  const mockWriteHead = jest.fn();
  const mockEnd = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
    res = {
      writeHead: mockWriteHead,
      end: mockEnd
    };
    session = {
      user: {
        [`${AUTH0_NAMESPACE}/intouch_market_code`]: "es"
      }
    };
  });

  it("should redirect to the right market", () => {
    req = {
      headers: {
        host: "en.local.intouch"
      }
    };

    marketRedirect(req, res, session);

    expect(res.writeHead).toHaveBeenCalledWith(302, {
      Location: `http://es.local.intouch:3000`
    });
  });

  it("should not redirect if already in the right market", () => {
    req = {
      headers: {
        host: "es.local.intouch"
      }
    };

    marketRedirect(req, res, session);

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });

  it("should not redirect localhost", () => {
    req = {
      headers: {
        host: "localhost"
      }
    };

    marketRedirect(req, res, session);

    expect(res.writeHead).toHaveBeenCalledTimes(0);
  });
});
