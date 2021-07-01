import { marketRedirect } from "../market";
import { redirectCompanyRegistration } from "../companyRegistration";

describe("marketRedirect", () => {
  let req;
  let user;

  beforeEach(() => {
    process.env.AUTH0_COOKIE_DOMAIN = "local.intouch";
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
    process.env.AUTH0_COOKIE_DOMAIN = "localhost";

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
