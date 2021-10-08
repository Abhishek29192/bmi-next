import { Request } from "express";
import { Account } from "@bmi/intouch-api-types";
import { marketRedirect } from "../market";

describe("Market Redirect", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("shouldn't redirect if super admin", () => {
    const req = {
      headers: {
        host: "en.intouch.bmiground.com"
      }
    } as Request;

    const account = {
      role: "SUPER_ADMIN"
    } as Account;

    expect(marketRedirect(req, account)).toEqual(null);
  });

  it("shouldn't redirect if user and right market", () => {
    const req = {
      headers: {
        host: "en.intouch.bmiground.com"
      }
    } as Request;

    const account = {
      role: "SUPER_ADMIN",
      market: {
        domain: "en"
      }
    } as Account;

    expect(marketRedirect(req, account)).toEqual(null);
  });

  it("should redirect if user and wrong market", () => {
    const req = {
      headers: {
        host: "no.intouch.bmiground.com"
      }
    } as Request;

    const account = {
      role: "INSTALLER",
      market: {
        domain: "en"
      }
    } as Account;

    expect(marketRedirect(req, account)).toEqual({
      redirect: {
        permanent: false,
        destination: "http://en.intouch.bmiground.com"
      }
    });
  });

  it("should redirect if user and wrong market in dev", () => {
    const req = {
      headers: {
        host: "dev-no.intouch.bmiground.com"
      }
    } as Request;

    const account = {
      role: "COMPANY_ADMIN",
      market: {
        domain: "en"
      }
    } as Account;

    expect(marketRedirect(req, account)).toEqual({
      redirect: {
        permanent: false,
        destination: "http://dev-en.intouch.bmiground.com"
      }
    });
  });

  it("should redirect if user and wrong market in uat", () => {
    const req = {
      headers: {
        host: "uat-no.intouch.bmiground.com"
      }
    } as Request;

    const account = {
      role: "COMPANY_ADMIN",
      market: {
        domain: "en"
      }
    } as Account;

    expect(marketRedirect(req, account)).toEqual({
      redirect: {
        permanent: false,
        destination: "http://uat-en.intouch.bmiground.com"
      }
    });
  });

  it("should redirect with the right protocol", () => {
    const req = {
      headers: {
        host: "uat-no.intouch.bmiground.com",
        "x-forwarded-proto": "https"
      }
    } as any;

    const account = {
      role: "COMPANY_ADMIN",
      market: {
        domain: "en"
      }
    } as Account;

    expect(marketRedirect(req, account)).toEqual({
      redirect: {
        permanent: false,
        destination: "https://uat-en.intouch.bmiground.com"
      }
    });
  });
});
