import React from "react";
import { fireEvent } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import {
  createMockRouter,
  renderWithAllProviders,
  screen
} from "../../lib/tests/utils";
import { generateAccount } from "../../lib/tests/factories/account";
import { ErrorStatusCode } from "../../lib/error";
import { getServerSideProps } from "../../pages/projects/[[...project]]";
import { generateProject } from "../../lib/tests/factories/project";
import { ROLES } from "../../lib/constants";
import ProjectPage from "../../pages/projects/[[...project]]";
import { GetProjectsQuery } from "../../graphql/generated/operations";
import { generateGlobalPageData } from "../../lib/tests/factories/globalPageData";
import { GetGlobalDataQuery } from "../../graphql/generated/operations";
import I18nextProvider from "../../lib/tests/fixtures/i18n";
import UserProvider from "../../lib/tests/fixtures/user";
import ApolloProvider from "../../lib/tests/fixtures/apollo";
import MarketContextWrapper from "../../lib/tests/fixtures/market";
import AccountContextWrapper from "../../lib/tests/fixtures/account";

jest.mock("../../lib/middleware/withPage", () => ({
  withPage: (getServerSideProps: any) => {
    return (context: any) => {
      return getServerSideProps(context);
    };
  }
}));

let projectDetailProps;
jest.mock("../../components/ProjectDetail", () => ({
  __esModule: true,
  ...jest.requireActual("../../components/ProjectDetail"),
  default: jest.fn().mockImplementation((props) => {
    projectDetailProps = props;
    return <div>projectDetails</div>;
  })
}));

const project = generateProject({ name: "Project 1" });
const useLazyQueryOnCompleteCallback = jest.fn().mockReturnValue({
  projectsByMarket: {
    nodes: [project]
  }
});
jest.mock("@apollo/client", () => ({
  ...jest.requireActual("@apollo/client"),
  useLazyQuery: (_, { onCompleted }) => [
    jest.fn(() => {
      onCompleted(useLazyQueryOnCompleteCallback());
    })
  ]
}));

const mockGetServerPageGetProjects = jest.fn();
jest.mock("../../graphql/generated/page", () => ({
  getServerPageGetProjects: () => mockGetServerPageGetProjects()
}));

jest.mock("next-i18next/serverSideTranslations", () => ({
  serverSideTranslations: () => Promise.resolve({})
}));

describe("Projects Page", () => {
  const globalPageData: GetGlobalDataQuery = generateGlobalPageData();
  const defaultContext = {
    apolloClient: {
      query: jest.fn()
    },
    res: {}
  };

  const projects = [project, { id: 2, name: "Project 2" }];
  const projectCollection: GetProjectsQuery["projectsByMarket"] = {
    __typename: "ProjectsConnection",
    nodes: [project]
  };
  const account = generateAccount({ role: ROLES.SUPER_ADMIN });

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
        project: 9999
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
  it("installer should view own projects", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.INSTALLER,
        projectMembers: {
          totalCount: true
        },
        market: {
          projectsEnabled: true
        }
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
  it("check for empty projectsByMarket", async () => {
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
            projectsByMarket: null
          }
        }
      };
    });

    const result = await getServerSideProps(context);
    expect(result).toEqual({
      props: {
        isPowerfulUser: true,
        projects: null
      }
    });
  });
  it("check for available params.project but empty projectsByMarket", async () => {
    const context = {
      ...defaultContext,
      account: {
        role: ROLES.SUPER_ADMIN
      },
      params: {
        project: 1
      },
      market: { id: 1 }
    };
    mockGetServerPageGetProjects.mockImplementation(() => {
      return {
        props: {
          data: {
            projectsByMarket: null
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

  it("render correctly", async () => {
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <ProjectPage
          _pageError={null}
          projects={projectCollection}
          isPowerfulUser={true}
          globalPageData={globalPageData}
          account={account}
          market={undefined}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });
  it("should show No results found", async () => {
    const projectCollection: GetProjectsQuery["projectsByMarket"] = {
      __typename: "ProjectsConnection",
      nodes: []
    };
    useLazyQueryOnCompleteCallback.mockReturnValueOnce({
      projectsByMarket: { nodes: [] }
    });
    renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <ProjectPage
          _pageError={null}
          projects={projectCollection}
          isPowerfulUser={true}
          globalPageData={globalPageData}
          account={account}
          market={undefined}
        />
      </RouterContext.Provider>
    );
    expect(screen.getByText("fallback.noResults")).toBeInTheDocument();
  });
  it("check onclick behavior", async () => {
    const router = createMockRouter({ query: { project: "1" } });

    renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter(router)}>
        <ProjectPage
          _pageError={null}
          projects={projectCollection}
          isPowerfulUser={true}
          globalPageData={globalPageData}
          account={account}
          market={undefined}
        />
      </RouterContext.Provider>
    );
    expect(screen.getByText("projectDetails")).toBeTruthy();
    const listButton = screen
      .getAllByTestId("projectCard")[0]
      .querySelector("button");
    fireEvent.click(listButton);
    expect(router.push).toHaveBeenCalled();
    expect(projectDetailProps).toMatchObject({
      projectId: 1,
      onUpdateGuarantee: expect.any(Function)
    });
    projectDetailProps.onUpdateGuarantee();
    expect(screen.getByText("Project 1")).toBeTruthy();
  });
  it("check for empty nodes array", async () => {
    const projectCollection: GetProjectsQuery["projectsByMarket"] = {
      __typename: "ProjectsConnection",
      nodes: null
    };
    useLazyQueryOnCompleteCallback.mockReturnValueOnce({
      projectsByMarket: { nodes: [] }
    });
    renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <ProjectPage
          _pageError={null}
          projects={projectCollection}
          isPowerfulUser={true}
          globalPageData={globalPageData}
          account={account}
          market={undefined}
        />
      </RouterContext.Provider>
    );
    expect(screen.getByText("fallback.noResults")).toBeInTheDocument();
  });
  it("check sorting of project name is missing", async () => {
    const projectCollection: GetProjectsQuery["projectsByMarket"] = {
      __typename: "ProjectsConnection",
      nodes: [
        project,
        {
          ...project,
          id: 2,
          name: null
        }
      ]
    };
    const { container } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <ProjectPage
          _pageError={null}
          projects={projectCollection}
          isPowerfulUser={true}
          globalPageData={globalPageData}
          account={account}
          market={undefined}
        />
      </RouterContext.Provider>
    );
    expect(container).toMatchSnapshot();
  });

  it("get latest project list when browsing different projects", async () => {
    const { rerender } = renderWithAllProviders(
      <RouterContext.Provider value={createMockRouter({})}>
        <ProjectPage
          _pageError={null}
          projects={projectCollection}
          isPowerfulUser={true}
          globalPageData={globalPageData}
          account={account}
          market={undefined}
        />
      </RouterContext.Provider>
    );
    expect(screen.getByText("Project 1")).toBeTruthy();
    expect(screen.queryByText("Project 2")).toBeFalsy();
    expect(screen.queryByText("Project 3")).toBeFalsy();

    useLazyQueryOnCompleteCallback.mockReturnValueOnce({
      projectsByMarket: {
        nodes: [
          { ...project, id: 1, name: "Project 1" },
          { ...project, id: 2, name: "Project 2" },
          { ...project, id: 3, name: "Project 3" }
        ]
      }
    });
    rerender(
      <I18nextProvider>
        <UserProvider>
          <ApolloProvider>
            <MarketContextWrapper>
              <AccountContextWrapper>
                <RouterContext.Provider
                  value={createMockRouter({ query: { project: ["3"] } })}
                >
                  <ProjectPage
                    _pageError={null}
                    projects={projectCollection}
                    isPowerfulUser={true}
                    globalPageData={globalPageData}
                    account={account}
                    market={undefined}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketContextWrapper>
          </ApolloProvider>
        </UserProvider>
      </I18nextProvider>
    );
    expect(screen.getByText("Project 1")).toBeTruthy();
    expect(screen.getByText("Project 2")).toBeTruthy();
    expect(screen.getByText("Project 3")).toBeTruthy();
  });
});
