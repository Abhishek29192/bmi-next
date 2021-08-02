import { redirectCompanyRegistration } from "../companyRegistration";

jest.mock("../../../lib/config", () => ({
  baseUrlDomain: "local.intouch",
  isProd: false,
  isSingleMarket: false
}));
import { marketRedirect } from "../market";

describe("marketRedirect", () => {
  let req;
  let user;

  beforeEach(() => {
    jest.resetAllMocks();
    user = {
      market: {
        domain: "es"
      }
    };
  });

  it("should redirect to the right market", () => {
    req = {
      headers: {
        host: "en.local.intouch",
        "x-forwarded-proto": "http"
      }
    };

    const redirect = marketRedirect(req, user);

    expect(redirect).toEqual({
      redirect: {
        permanent: false,
        destination: "http://es.local.intouch"
      }
    });
  });

  it("should not redirect if already in the right market", () => {
    req = {
      headers: {
        host: "es.local.intouch",
        "x-forwarded-proto": "http"
      }
    };

    const redirect = marketRedirect(req, user);

    expect(redirect).toEqual(null);
  });

  it("should not redirect localhost", () => {
    jest.mock("../../../lib/config", () => ({
      baseUrlDomain: "localhost",
      isProd: false,
      isSingleMarket: true
    }));
    const redirect = marketRedirect(req, user);

    expect(redirect).toEqual(null);
  });
});

describe("Company registration", () => {
  it("should redirect the user to the company registration page", () => {
    const user = {
      companyMembers: {
        nodes: [
          {
            company: {
              status: "NEW"
            }
          }
        ]
      }
    };
    const redirect = redirectCompanyRegistration({ url: "/" }, user);

    expect(redirect).toEqual({
      redirect: {
        permanent: false,
        destination: "/company-registration"
      }
    });
  });
  it("shouldn't redirect the user to the company registration page", () => {
    const req = { url: "/" };
    const user = {
      companyMembers: {
        nodes: [
          {
            company: {
              status: "ACTIVE"
            }
          }
        ]
      }
    };
    const redirect = redirectCompanyRegistration(req, user);

    expect(redirect).toEqual(null);
  });
});
