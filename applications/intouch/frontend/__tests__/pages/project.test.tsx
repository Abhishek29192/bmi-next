import React from "react";
import { renderWithUserProvider } from "../../lib/tests/utils";
import { generateAccount } from "../../lib/tests/factories/account";
import MarketContextWrapper from "../../lib/tests/fixtures/market";
import { ErrorStatusCode } from "../../lib/error";
import { getServerSideProps } from "../../pages/projects/[[...project]]";
import { generateProject } from "../../lib/tests/factories/project";
import { ROLES } from "../../lib/constants";
import AccountContextWrapper from "../../lib/tests/fixtures/account";
import ApolloProvider from "../../lib/tests/fixtures/apollo";
import ProjectPage from "../../pages/projects/[[...project]]";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";

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

jest.mock("next/router", () => ({
  ...jest.requireActual("next/router"),
  useRouter: jest.fn().mockReturnValue({
    query: {
      project: ["1"]
    }
  })
}));

describe("Projects Page", () => {
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {}
  };

  const projects = [generateProject()];
  const projectCollection: GetProjectsQuery["projectsByMarket"] = {
    __typename: "ProjectsConnection",
    nodes: [
      {
        ...generateProject()
      }
    ]
  };
  const account = generateAccount({ role: ROLES.SUPER_ADMIN });
  // const globalPageData: GetGlobalDataQuery = generateGlobalPageData();

  it("should view all projects if super admin", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.SUPER_ADMIN
      },
      params: {},
      market: { id: 1 }
    };
    mockGetServerPageGetProjects.mockImplementation(() => {
      return {
        props: {
          data: {
            projectsByMarket: { nodes: projects }
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
  it("return props for forbidden or missing project", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.SUPER_ADMIN
      },
      params: {
        project: [{ name: "not existing project", id: 9999 }]
      },
      market: { id: 1 }
    };
    mockGetServerPageGetProjects.mockImplementation(() => {
      return {
        props: {
          data: {
            projectsByMarket: { nodes: projects }
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        _pageError: {
          statusCode: ErrorStatusCode.NOT_FOUND,
          title: "Not found"
        },
        globalPageData: undefined
      }
    });
  });
  it("check default props", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.SUPER_ADMIN
      },
      params: {},
      market: { id: 1 }
    };
    mockGetServerPageGetProjects.mockImplementation(() => {
      return {
        props: {
          data: {
            projectsByMarket: { nodes: [] }
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        isPowerfulUser: true,
        projects: {
          nodes: []
        }
      }
    });
  });

  it("render correctly", async () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <MarketContextWrapper>
          <AccountContextWrapper>
            <ProjectPage
              _pageError={null}
              projects={projectCollection}
              isPowerfulUser={true}
              globalPageData={globalPageData}
              account={account}
              market={undefined}
            />
          </AccountContextWrapper>
        </MarketContextWrapper>
      </ApolloProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
