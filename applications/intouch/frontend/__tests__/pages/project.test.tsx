import { getServerSideProps } from "../../pages/projects/[[...project]]";
import { generateProject } from "../../lib/tests/factories/project";
import { ROLES } from "../../lib/constants";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (getServerSideProps: any) => {
    return (context: any) => {
      return getServerSideProps(context);
    };
  }
}));

const mockGetServerPageGetProjects = jest.fn();

jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetProjects: () => mockGetServerPageGetProjects()
}));

jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

describe("Projects Page", () => {
  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {}
  };

  it("should view all projects if super admin", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.SUPER_ADMIN
      },
      params: {},
      market: { id: 1 }
    };
    const project = generateProject();
    mockGetServerPageGetProjects.mockImplementation(() => {
      return {
        props: {
          data: {
            projectsByMarket: { nodes: [project] }
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toEqual({
      redirect: {
        destination: "/projects/1",
        permanent: false
      }
    });
  });
  it("non super admin should not view projects if projects disabled", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.MARKET_ADMIN,
        market: {
          projectsEnabled: false
        }
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
  it("should not view projects if installer has no projects", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.INSTALLER,
        projectMembers: {
          totalCount: false
        },
        market: {
          projectsEnabled: true
        }
      },
      params: {},
      market: { id: 1 }
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
