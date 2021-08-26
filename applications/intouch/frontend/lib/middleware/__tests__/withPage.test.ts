import { withPage, innerGetServerSideProps } from "../withPage";
import { generateAccount } from "../../tests/factories/account";
import { generateMarketContext } from "../../tests/factories/market";

jest.mock("../../../lib/config", () => ({
  baseUrlDomain: "local.intouch",
  isProd: false,
  isSingleMarket: false
}));

jest.mock("../../auth0", () => ({
  getAuth0Instance: () => ({
    withPageAuthRequired: () => jest.fn()
  })
}));

const mockQuery = jest.fn();
jest.mock("../../apolloClient", () => ({
  initializeApollo: () => ({
    query: mockQuery
  })
}));
jest.mock("../../../graphql/generated/page", () => ({
  getServerPageGetGlobalData: () => ({
    props: { data: {} }
  }),
  getServerPageGetMarketsByDomain: () => ({
    props: { data: { markets: { nodes: [generateMarketContext()] } } }
  })
}));

describe("Middleware withPage", () => {
  let ctx;
  let auth0Mock = {
    getSession: () => ({
      idToken: "123",
      user: {
        foo: "bar"
      }
    })
  };

  const getServerSideProps = jest.fn();
  beforeEach(() => {
    ctx = {
      resolvedUrl: "/",
      res: {},
      req: {
        logger: null,
        headers: {
          host: "es.local.intouch",
          "x-forwarded-proto": "http"
        }
      }
    };

    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("should add the logger to the request", async () => {
    await withPage(getServerSideProps)(ctx);

    expect(ctx.req.logger).not.toBeNull();
  });

  it("should redirect if wrong market", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: generateAccount({
          hasCompany: true,
          market: {
            domain: "en"
          },
          company: {
            status: "NEW"
          }
        })
      }
    });

    let result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: { permanent: false, destination: "http://en.local.intouch" }
    });
  });

  it("should redirect if need to complete the user profile", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: generateAccount({
          account: {
            firstName: "Name",
            lastName: null
          },
          market: {
            domain: "es"
          },
          company: {
            status: "NEW"
          }
        })
      }
    });

    let result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: {
        permanent: false,
        destination: "/user-registration"
      }
    });
  });

  it("shouldn't redirect if need to complete the user profile but already in the page", async () => {
    ctx.resolvedUrl = "/user-registration";
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: generateAccount({
          hasCompany: true,
          account: {
            firstName: null,
            lastName: null
          },
          market: {
            domain: "es"
          },
          company: {
            status: "ACTIVE"
          }
        })
      }
    });

    await innerGetServerSideProps(getServerSideProps, auth0Mock, ctx);

    expect(getServerSideProps).toHaveBeenCalled();
  });

  it("shouldn't redirect if need to complete the company but actually in /user-registration", async () => {
    ctx.resolvedUrl = "/user-registration";
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: generateAccount({
          hasCompany: true,
          market: {
            domain: "es"
          },
          company: {
            status: "NEW"
          }
        })
      }
    });

    await innerGetServerSideProps(getServerSideProps, auth0Mock, ctx);

    expect(getServerSideProps).toHaveBeenCalled();
  });

  it("should redirect if need to complete the company registration", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: generateAccount({
          hasCompany: true,
          account: {
            firstName: "Name",
            lastName: "Last name"
          },
          market: {
            domain: "es"
          },
          company: {
            status: "NEW",
            name: null
          }
        })
      }
    });

    let result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: {
        permanent: false,
        destination: "/company-registration"
      }
    });
  });

  it("should return getServerSideProps with all the necessary objects", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: generateAccount({
          hasCompany: true,
          account: {
            firstName: "Name",
            lastName: "Last name"
          },
          market: {
            domain: "es"
          },
          company: {
            status: "ACTIVE"
          }
        })
      }
    });

    await innerGetServerSideProps(getServerSideProps, auth0Mock, ctx);

    const { apolloClient, auth0, session, account, market } =
      getServerSideProps.mock.calls[0][0];

    expect(apolloClient).toEqual({
      query: mockQuery
    });
    expect(auth0).toEqual(auth0Mock);
    expect(session).toEqual({
      idToken: "123",
      user: {
        foo: "bar"
      }
    });
    expect(account).toEqual(
      expect.objectContaining({
        firstName: "Name",
        lastName: "Last name",
        market: expect.objectContaining({
          domain: "es"
        }),
        companyMembers: expect.objectContaining({
          nodes: expect.arrayContaining([
            expect.objectContaining({
              company: expect.objectContaining({
                status: "ACTIVE"
              })
            })
          ])
        })
      })
    );

    expect(market).toEqual(
      expect.objectContaining({
        ...generateMarketContext()
      })
    );
  });
});
