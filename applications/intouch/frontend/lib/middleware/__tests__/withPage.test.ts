import { withPage, innerGetServerSideProps } from "../withPage";

jest.mock("../../auth0", () => ({
  getAuth0Instance: (req, res) => ({
    withPageAuthRequired: () => jest.fn()
  })
}));

const mockQuery = jest.fn();
jest.mock("../../apolloClient", () => ({
  initializeApollo: () =>
    Promise.resolve({
      query: mockQuery
    })
}));
jest.mock("../../../graphql/generated/page", () => ({
  getServerPageGetGlobalData: () => ({
    props: { data: {} }
  })
}));

describe("Middleware withPage", () => {
  let ctx = {
    res: {},
    req: {
      logger: null,
      headers: {
        host: "es.local.intouch",
        "x-forwarded-proto": "http"
      }
    }
  };
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
        accountByEmail: {
          market: {
            domain: "en"
          },
          companyMembers: {
            nodes: [
              {
                company: {
                  status: "NEW"
                }
              }
            ]
          }
        }
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

  it("should redirect if need to complete the company registration", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: {
          market: {
            domain: "es"
          },
          companyMembers: {
            nodes: [
              {
                company: {
                  status: "NEW"
                }
              }
            ]
          }
        }
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
        accountByEmail: {
          market: {
            domain: "es"
          },
          companyMembers: {
            nodes: [
              {
                company: {
                  status: "ACTIVE"
                }
              }
            ]
          }
        }
      }
    });

    await innerGetServerSideProps(getServerSideProps, auth0Mock, ctx);

    const { apolloClient, auth0, session, account } =
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
    expect(account).toEqual({
      market: {
        domain: "es"
      },
      companyMembers: {
        nodes: [
          {
            company: {
              status: "ACTIVE"
            }
          }
        ]
      }
    });
  });
});
