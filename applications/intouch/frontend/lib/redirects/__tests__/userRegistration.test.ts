import { Account } from "@bmi/intouch-api-types";
import { Session } from "@auth0/nextjs-auth0";

import { userRegistration } from "../userRegistration";

process.env.AUTH0_NAMESPACE = "namespace";

describe("User Registration Redirect", () => {
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

  it("should redirect to the user registration page", () => {
    const account = {
      firstName: null,
      lastName: null
    } as Account;

    const session = { user: {} } as Session;

    const redirect = userRegistration("/", account, session);

    expect(redirect).toEqual({
      redirect: {
        permanent: false,
        destination: "/user-registration"
      }
    });
  });

  it("should redirect to the user registration page if need to accept T&C", () => {
    const account = {
      firstName: null,
      lastName: null
    } as Account;

    const session = { user: {} } as Session;

    const redirect = userRegistration("/", account, session);

    expect(redirect).toEqual({
      redirect: {
        permanent: false,
        destination: "/user-registration"
      }
    });
  });

  it("shouldn't redirect to the user registration page if already there", () => {
    const account = {
      firstName: "Firstname",
      lastName: "Lastname"
    } as Account;

    const session = {
      user: {
        [`${process.env.AUTH0_NAMESPACE}/terms_to_accept`]: true
      }
    } as Session;

    const redirect = userRegistration("/user-registration", account, session);

    expect(redirect).toEqual(null);
  });
});
