import { withPage, innerGetServerSideProps } from "../withPage";
import { generateAccount } from "../../tests/factories/account";
import { generateMarketContext } from "../../tests/factories/market";

jest.mock("../../../lib/config", () => ({
  baseUrlDomain: "local.intouch",
  isProd: false,
  isSingleMarket: false
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
  })
}));

const withPageAuthRequiredSpy = jest.fn();

jest.mock("../../auth0", () => {
  const origin = jest.requireActual("../../auth0");
  return {
    ...origin,
    __esModule: true,
    getAuth0Instance: () => ({
      withPageAuthRequired: (params) => withPageAuthRequiredSpy(params),
      getSession: () => ({
        user: {
          sub: "123"
        }
      })
    })
  };
});

describe("Middleware withPage", () => {
  let ctx;
  const auth0Mock = {
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
        logger: () => ({
          info: jest.fn(),
          error: jest.fn()
        }),
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
    withPageAuthRequiredSpy.mockImplementationOnce(
      ({ getServerSideProps }) =>
        () =>
          getServerSideProps(ctx)
    );
    await withPage(getServerSideProps)(ctx);

    expect(ctx.req.logger).not.toBeNull();
  });

  it("should redirect if no account found", async () => {
    mockQuery.mockResolvedValueOnce({
      data: {
        accountByEmail: null
      }
    });

    const result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: {
        permanent: false,
        destination: "/api/auth/logout"
      }
    });
  });

  it("should redirect if wrong market", async () => {
    mockQuery
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        data: {
          markets: {
            nodes: [
              generateMarketContext({
                domain: "en"
              })
            ]
          }
        }
      });

    const result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: { permanent: false, destination: "http://en.local.intouch" }
    });
  });

  it("should redirect if need to complete the user profile", async () => {
    mockQuery
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        data: {
          markets: {
            nodes: [
              generateMarketContext({
                domain: "en"
              })
            ]
          }
        }
      });

    const result = await innerGetServerSideProps(
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

  it("check empty markets case and redirect to user registration", async () => {
    mockQuery
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        data: {
          markets: {}
        }
      });

    const result = await innerGetServerSideProps(
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
    mockQuery.mockResolvedValueOnce({
      data: { markets: { nodes: [generateMarketContext()] } }
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
    mockQuery.mockResolvedValueOnce({
      data: { markets: { nodes: [generateMarketContext()] } }
    });

    await innerGetServerSideProps(getServerSideProps, auth0Mock, ctx);

    expect(getServerSideProps).toHaveBeenCalled();
  });

  it("should redirect if need to complete the company registration", async () => {
    mockQuery
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        data: {
          markets: {
            nodes: [
              generateMarketContext({
                domain: "en"
              })
            ]
          }
        }
      });

    const result = await innerGetServerSideProps(
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
    mockQuery.mockResolvedValueOnce({
      data: { markets: { nodes: [generateMarketContext()] } }
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

  it("should redirect to login if auth error", async () => {
    mockQuery.mockRejectedValueOnce({
      networkError: { result: { message: "Jwt issuer is not configured" } }
    });

    const result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: {
        permanent: false,
        destination: "/api/auth/logout"
      }
    });
  });

  it("should redirect to error page", async () => {
    mockQuery.mockRejectedValueOnce({
      networkError: { result: {} }
    });

    const result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: {
        permanent: false,
        destination: "/api-error?message=genericError"
      }
    });
  });

  it("should redirect to api error page if generic error", async () => {
    mockQuery.mockRejectedValueOnce({
      networkError: { result: { message: "generic_error" } }
    });

    const result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: {
        permanent: false,
        destination: "/api-error?message=genericError"
      }
    });
  });

  it("should redirect if session expired", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2050-01-01"));
    const auth0Mock = {
      getSession: () => ({
        idToken: "123",
        user: {
          foo: "bar"
        },
        accessTokenExpiresAt: 600
      })
    };

    const result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: { permanent: false, destination: "/api/auth/logout" }
    });
  });

  it("should redirect to proper page after auth0 token refresh", async () => {
    jest.useFakeTimers().setSystemTime(new Date("2050-01-01"));
    const auth0Mock = {
      getSession: () => ({
        idToken: "123",
        user: {
          foo: "bar"
        },
        accessTokenExpiresAt: 600
      }),
      getAccessToken: () => ({
        accessToken: "tokenX4356"
      })
    };
    mockQuery
      .mockResolvedValueOnce({
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
      })
      .mockResolvedValueOnce({
        data: {
          markets: {
            nodes: [
              generateMarketContext({
                domain: "en"
              })
            ]
          }
        }
      });

    const result = await innerGetServerSideProps(
      getServerSideProps,
      auth0Mock,
      ctx
    );

    expect(result).toEqual({
      redirect: { permanent: false, destination: "http://en.local.intouch" }
    });
  });
});
