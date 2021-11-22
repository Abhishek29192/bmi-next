import { getServerSideProps } from "../../pages/companies/[[...companyId]]";
import { generateCompany } from "../../lib/tests/factories/company";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (getServerSideProps: any) => {
    return (context: any) => {
      return getServerSideProps(context);
    };
  }
}));

const mockgetServerPageGetCompaniesByMarket = jest.fn();

jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetCompaniesByMarket: () =>
    mockgetServerPageGetCompaniesByMarket()
}));

jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

describe("Company Page", () => {
  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {}
  };
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

    mockgetServerPageGetCompaniesByMarket.mockImplementation(() => {
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

    mockgetServerPageGetCompaniesByMarket.mockImplementation(() => {
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
});
