import { getServerSideProps } from "../../../pages/admin/products";

jest.mock("../../../lib/middleware/withPage", () => ({
  withPage: (getServerSideProps: any) => {
    return (context: any) => {
      return getServerSideProps(context);
    };
  }
}));

describe("Admin Product Page", () => {
  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {}
  };

  it("should not access the page if installer user", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "INSTALLER"
      }
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
  it("should not access the page if company admin user", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: "COMPANY_ADMIN"
      }
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
});
