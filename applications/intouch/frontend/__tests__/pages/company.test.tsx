import { RouterContext } from "next/dist/next-server/lib/router-context";
import React from "react";
import { fireEvent } from "@testing-library/react";
import CompaniesPage, {
  getServerSideProps
} from "../../pages/companies/[[...companyId]]";
import { generateCompany } from "../../lib/tests/factories/company";
import {
  createMockRouter,
  renderWithAllProviders,
  screen
} from "../../lib/tests/utils";
import { generateAccount } from "../../lib/tests/factories/account";
import { ROLES } from "../../lib/constants";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
import { generateMarketContext } from "../../lib/tests/factories/market";
import { mockContactDetailsCollection } from "../../fixtures/contentful/contactDetails";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (getServerSideProps: any) => {
    return (context: any) => {
      return getServerSideProps(context);
    };
  }
}));

const mockGetServerPageGetCompaniesByMarket = jest.fn();
const mockGetServerPageGetCompany = jest.fn();

jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetCompaniesByMarket: () =>
    mockGetServerPageGetCompaniesByMarket(),
  getServerPageGetCompany: () => mockGetServerPageGetCompany()
}));

jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

let companyPageProps;
jest.mock("../../components/Pages/Company", () => ({
  __esModule: true,
  ...jest.requireActual("../../components/Pages/Company"),
  CompanyPage: jest.fn().mockImplementation((props) => {
    companyPageProps = props;
    return <div>companyDetails</div>;
  })
}));

const company = generateCompany();
const useLazyQueryOnCompleteCallback = jest.fn().mockReturnValue({
  companies: {
    nodes: [company]
  }
});
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useLazyQuery: (_, { onCompleted, onError }) => [
    jest.fn(() => {
      onCompleted(useLazyQueryOnCompleteCallback());
      onError({
        open: true,
        severity: "error",
        message: "invitation.dialog.errorCommonFailure"
      });
    })
  ]
}));

const logSpy = jest.fn();
jest.mock("../../lib/logger", () => ({
  __esModule: true,
  default: (...message) => logSpy(...message)
}));

describe("Company Page", () => {
  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {}
  };
  const account = generateAccount({ role: ROLES.SUPER_ADMIN });
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  const market = generateMarketContext();
  const contactDetailsCollection = mockContactDetailsCollection;

  it("should not view all companies if installer", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "INSTALLER"
      },
      params: {}
    };
    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        _pageError: {
          statusCode: 401,
          title: "Unauthorised"
        },
        globalPageData: undefined
      }
    });
  });
  it("should not view all companies if company admin", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "COMPANY_ADMIN"
      },
      params: {}
    };
    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        _pageError: {
          statusCode: 401,
          title: "Unauthorised"
        },
        globalPageData: undefined
      }
    });
  });
  it("should view all companies if market admin", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "MARKET_ADMIN"
      },
      params: {},
      market: { id: 1 }
    };
    const company = generateCompany();

    mockGetServerPageGetCompaniesByMarket.mockImplementation(() => {
      return {
        props: {
          data: {
            companies: { nodes: [company] },
            contactDetailsCollection: null
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toEqual({
      redirect: {
        destination: "/companies/1",
        permanent: false
      }
    });
  });
  it("should view all companies if super admin", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "SUPER_ADMIN"
      },
      params: {},
      market: { id: 1 }
    };
    const company = generateCompany({ id: 2 });

    mockGetServerPageGetCompaniesByMarket.mockImplementation(() => {
      return {
        props: {
          data: {
            companies: { nodes: [company] },
            contactDetailsCollection: null
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toEqual({
      redirect: {
        destination: "/companies/2",
        permanent: false
      }
    });
  });
  it("should view company contacts", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "SUPER_ADMIN"
      },
      params: {
        companyId: 2
      },
      market: { id: 1 }
    };
    const company = generateCompany({ id: 2 });

    mockGetServerPageGetCompany.mockImplementation(() => {
      return {
        props: {
          data: {
            company,
            contactDetailsCollection
          }
        }
      };
    });

    mockGetServerPageGetCompaniesByMarket.mockImplementation(() => {
      return {
        props: {
          data: {
            companies: { nodes: [company] },
            contactDetailsCollection: {}
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toMatchSnapshot();
  });
  it("should not return companies list for installer", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "INSTALLER",
        companyMembers: {
          nodes: [
            {
              company: {
                id: 2
              }
            }
          ]
        }
      },
      params: {
        companyId: 2
      },
      market: { id: 1 }
    };
    const company = generateCompany({ id: 2 });

    mockGetServerPageGetCompany.mockImplementation(() => {
      return {
        props: {
          data: {
            company,
            contactDetailsCollection
          }
        }
      };
    });

    mockGetServerPageGetCompaniesByMarket.mockImplementation(() => {
      return {
        props: {
          data: {
            companies: { nodes: [company] },
            contactDetailsCollection: {}
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toMatchSnapshot();
  });
  it("should return default props with empty companies list", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "SUPER_ADMIN"
      },
      params: {},
      market: { id: 1 }
    };

    mockGetServerPageGetCompaniesByMarket.mockImplementation(() => {
      return {
        props: {
          data: {
            companies: { nodes: [] },
            contactDetailsCollection: {}
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toMatchSnapshot();
  });
  it("should return UNAUTHORISED error", async () => {
    const context = {
      ...defaultContext,
      account: {},
      params: {
        companyId: 2
      },
      market: { id: 1 }
    };

    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        _pageError: {
          statusCode: 401,
          title: "Unauthorised"
        }
      }
    });
  });

  it("render correctly", async () => {
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <CompaniesPage
          _pageError={null}
          account={account}
          companies={[company]}
          companySSR={company}
          contactDetailsCollection={contactDetailsCollection}
          globalPageData={globalPageData}
          mapsApiKey={null}
          market={market}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("check onclick behavior", async () => {
    const router = createMockRouter({ query: { companies: "1" } });
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter(router)}>
        <CompaniesPage
          _pageError={null}
          account={account}
          companies={[company]}
          companySSR={company}
          contactDetailsCollection={contactDetailsCollection}
          globalPageData={globalPageData}
          mapsApiKey={null}
          market={market}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
    const listButton = screen
      .getAllByTestId("companyCard")[0]
      .querySelector("button");
    fireEvent.click(listButton);
    expect(router.push).toHaveBeenCalled();
    expect(companyPageProps).toMatchObject({
      company: company,
      onCompanyUpdateSuccess: expect.any(Function)
    });
    companyPageProps.onCompanyUpdateSuccess();
  });

  it("render correctly for installer", async () => {
    const account = generateAccount({ role: ROLES.INSTALLER });
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <CompaniesPage
          _pageError={null}
          account={account}
          companies={[company]}
          companySSR={company}
          contactDetailsCollection={contactDetailsCollection}
          globalPageData={globalPageData}
          mapsApiKey={null}
          market={market}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
