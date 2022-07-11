import React, { Dispatch } from "react";
import { fireEvent } from "@testing-library/react";
import { RouterContext } from "next/dist/next-server/lib/router-context";
import { ProjectSidePanel } from "..";
import {
  render,
  renderWithUserProvider,
  screen,
  createMockRouter
} from "../../../lib/tests/utils";
import I18nProvider from "../../../lib/tests/fixtures/i18n";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import ApolloProvider from "../../../lib/tests/fixtures/apollo";
import MarketProvider from "../../../lib/tests/fixtures/market";
import { GetProjectsQuery } from "../../../graphql/generated/operations";
import { generateAccount } from "../../../lib/tests/factories/account";
import { generateMarketContext } from "../../../lib/tests/factories/market";
import { generateGuarantee } from "../../../lib/tests/factories/guarantee";
import {
  generateProject,
  projectFactory
} from "../../../lib/tests/factories/project";

describe("ProjectSidePanel component", () => {
  it("renders correctly", () => {
    const projects: GetProjectsQuery["projectsByMarket"]["nodes"] = [
      {
        id: 1,
        name: "test",
        siteAddress: {
          postcode: "N11 111",
          town: "LONDON"
        },
        technology: "FLAT",
        startDate: "01/01/2019",
        endDate: "01/01/2020",
        guarantees: null,
        company: null
      }
    ];

    // Mocking the date to show project in progress
    Date.now = jest.fn(() => Date.parse("2019-01-02"));

    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <RouterContext.Provider value={createMockRouter({})}>
            <ProjectSidePanel
              onProjectSelected={() => ({})}
              projects={projects}
            />
          </RouterContext.Provider>
        </AccountContextWrapper>
      </I18nProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("shows ALL projects by default", () => {
    const siteAddress = {
      postcode: "N11 111",
      town: "LONDON"
    };
    const guarantees = null;
    const company = null;

    const projects: GetProjectsQuery["projectsByMarket"]["nodes"] = [
      {
        id: 1,
        name: "test 1",
        siteAddress,
        technology: "FLAT",
        startDate: "01/01/2019",
        endDate: "01/02/2019",
        guarantees,
        company
      },
      {
        id: 2,
        name: "test 2",
        siteAddress,
        technology: "PITCHED",
        startDate: "01/01/2019",
        endDate: "01/02/2020",
        guarantees,
        company
      },
      {
        id: 3,
        name: "test 3",
        siteAddress: null,
        technology: "FLAT",
        startDate: "01/02/2020",
        endDate: "01/01/2021",
        guarantees,
        company
      }
    ];

    // Mocking the date, should be sufficient for the purpose of this test
    Date.now = jest.fn(() => Date.parse("2020-01-01"));

    const { container } = render(
      <I18nProvider>
        <AccountContextWrapper>
          <RouterContext.Provider value={createMockRouter({})}>
            <ProjectSidePanel
              onProjectSelected={() => ({})}
              projects={projects}
            />
          </RouterContext.Provider>
        </AccountContextWrapper>
      </I18nProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("check filtering functionality", () => {
    const guarantee = generateGuarantee({
      reviewerAccountId: null,
      status: "SUBMITTED"
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      }
    });

    // Mocking the date, should be sufficient for the purpose of this test
    Date.now = jest.fn(() => Date.parse("2022-01-01"));

    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <MarketProvider market={generateMarketContext({ id: 1 })}>
          <AccountContextWrapper
            account={generateAccount({
              role: "MARKET_ADMIN",
              hasCompany: true
            })}
          >
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel
                onProjectSelected={() => ({})}
                projects={[project]}
              />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );
    const listButton = screen
      .getAllByTestId("projectCard")[0]
      .querySelector("button");
    fireEvent.click(listButton);
    const filterListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(filterListButtons[5]);
    fireEvent.change(container.querySelector("#filter"), {
      target: { value: "ale" }
    });
    expect(screen.queryByText("fallback.noResults")).toBeTruthy();
  });
  it("check filtering functionality for REVIEW status", () => {
    const guarantee = generateGuarantee({
      reviewerAccountId: 1,
      status: "REVIEW"
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      }
    });

    // Mocking the date, should be sufficient for the purpose of this test
    Date.now = jest.fn(() => Date.parse("2022-01-01"));

    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <MarketProvider market={generateMarketContext({ id: 1 })}>
          <AccountContextWrapper
            account={generateAccount({
              role: "MARKET_ADMIN",
              hasCompany: true
            })}
          >
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel
                onProjectSelected={() => ({})}
                projects={[project]}
              />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );
    const filterListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(filterListButtons[2]);
    expect(screen.queryByText("fallback.noResults")).toBeFalsy();
    fireEvent.click(filterListButtons[3]);
  });
  it("check filtering functionality for non SOLUTION guaranty", () => {
    const guarantee = generateGuarantee({
      coverage: "PRODUCT",
      reviewerAccountId: null,
      status: "SUBMITTED"
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      },
      company: null
    });

    // Mocking the date, should be sufficient for the purpose of this test
    Date.now = jest.fn(() => Date.parse("2022-01-01"));

    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <MarketProvider market={generateMarketContext({ id: 1 })}>
          <AccountContextWrapper
            account={generateAccount({
              role: "MARKET_ADMIN",
              hasCompany: true
            })}
          >
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel
                onProjectSelected={() => ({})}
                projects={[project]}
              />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );
    const filterListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(filterListButtons[5]);
    expect(screen.queryByText("fallback.noResults")).toBeFalsy();
  });
  it("should show project side panel if user MARKET_ADMIN", () => {
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <MarketProvider market={generateMarketContext({ id: 1 })}>
          <AccountContextWrapper
            account={generateAccount({
              role: "MARKET_ADMIN",
              hasCompany: true
            })}
          >
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel onProjectSelected={() => ({})} projects={[]} />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );
    const createProject = screen.queryByTestId(
      "project-side-panel-footer-button"
    );
    expect(createProject).toBeTruthy();
    fireEvent.click(createProject);
    const closeTags = screen.getAllByRole("button")[0].querySelector("svg");
    fireEvent.click(closeTags);
    expect(closeTags).not.toBeVisible();
    const filterListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(filterListButtons[1]);
    expect(screen.queryByText("fallback.noResults")).toBeTruthy();
  });
  it("should show project side panel if user COMPANY_ADMIN", () => {
    const guarantee = generateGuarantee({
      coverage: "PRODUCT",
      reviewerAccountId: null,
      status: "SUBMITTED"
    });
    const project = generateProject({
      guarantees: {
        nodes: [guarantee]
      },
      company: null
    });

    // Mocking the date, should be sufficient for the purpose of this test
    Date.now = jest.fn(() => Date.parse("2022-01-01"));
    const { container } = renderWithUserProvider(
      <ApolloProvider>
        <MarketProvider market={generateMarketContext({ id: 1 })}>
          <AccountContextWrapper
            account={generateAccount({
              role: "COMPANY_ADMIN",
              hasCompany: true
            })}
          >
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel
                onProjectSelected={() => ({})}
                projects={[project]}
              />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );

    const filterListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(filterListButtons[2]);
    expect(screen.queryByText("fallback.noResults")).toBeFalsy();
  });
  it("check case with company record missing", () => {
    const account = generateAccount({
      role: "MARKET_ADMIN",
      hasCompany: false
    });
    renderWithUserProvider(
      <ApolloProvider>
        <MarketProvider market={generateMarketContext({ id: 1 })}>
          <AccountContextWrapper account={account}>
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel onProjectSelected={() => ({})} projects={[]} />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );
    const createProject = screen.queryByTestId(
      "project-side-panel-footer-button"
    );
    expect(createProject).toBeFalsy();
  });

  describe("should route to first available project", () => {
    it("has available project", () => {
      const onProjectSelectedSpy = jest.fn();
      const projects = [projectFactory(), projectFactory({ id: 2 })];
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper
            account={generateAccount({ role: "INSTALLER", hasCompany: true })}
          >
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel
                onProjectSelected={onProjectSelectedSpy}
                projects={projects}
              />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </ApolloProvider>
      );
      expect(onProjectSelectedSpy).toHaveBeenCalledWith(1);
    });

    it("no available project", () => {
      const onProjectSelectedSpy = jest.fn();
      const projects = [];
      renderWithUserProvider(
        <ApolloProvider>
          <AccountContextWrapper
            account={generateAccount({ role: "INSTALLER", hasCompany: true })}
          >
            <RouterContext.Provider value={createMockRouter({})}>
              <ProjectSidePanel
                onProjectSelected={onProjectSelectedSpy}
                projects={projects}
              />
            </RouterContext.Provider>
          </AccountContextWrapper>
        </ApolloProvider>
      );
      expect(onProjectSelectedSpy).toHaveBeenCalledTimes(0);
    });
  });

  it("reset to default filter selected when no project query and filter selected is not equal the default", () => {
    const account = generateAccount({ role: "INSTALLER", hasCompany: true });
    const setFilterSelectionSpy = jest.fn();
    jest
      .spyOn(React, "useState")
      .mockImplementationOnce(((call) => [call, jest.fn()]) as () => [
        unknown,
        Dispatch<unknown>
      ])
      .mockImplementationOnce(((call) => [call, jest.fn()]) as () => [
        unknown,
        Dispatch<unknown>
      ])
      .mockImplementationOnce(() => [(context) => context, jest.fn()])
      .mockImplementationOnce(() => ["UNASSIGNED", setFilterSelectionSpy]);
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper account={account}>
          <RouterContext.Provider value={createMockRouter({})}>
            <ProjectSidePanel
              onProjectSelected={() => {}}
              projects={[projectFactory()]}
            />
          </RouterContext.Provider>
        </AccountContextWrapper>
      </ApolloProvider>
    );

    expect(setFilterSelectionSpy).toHaveBeenCalledWith("ALL");
  });

  it("when router.query contains project value", () => {
    const onProjectSelectedSpy = jest.fn();
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper
          account={generateAccount({ role: "INSTALLER", hasCompany: true })}
        >
          <RouterContext.Provider
            value={createMockRouter({ query: { project: "1" } })}
          >
            <ProjectSidePanel
              onProjectSelected={onProjectSelectedSpy}
              projects={[projectFactory()]}
            />
          </RouterContext.Provider>
        </AccountContextWrapper>
      </ApolloProvider>
    );

    expect(onProjectSelectedSpy).toHaveBeenCalledTimes(0);
  });

  describe("Search Criteria", () => {
    const projectName = "test";

    describe("Super Admin and Market Admin", () => {
      it("project name", () => {
        const projects = [
          projectFactory(),
          projectFactory({ name: projectName })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "MARKET_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: "test" }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });

      it("company name", () => {
        const companyName = "test company name";
        const projects = [
          projectFactory(),
          projectFactory({ name: projectName, company: { name: companyName } })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "MARKET_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: companyName }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });
    });

    describe("Other Users", () => {
      const projectName = "test";

      it("project name", () => {
        const projects = [
          projectFactory(),
          projectFactory({ name: projectName })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "COMPANY_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: "test" }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });

      it("town", () => {
        const town = "town name";
        const projects = [
          projectFactory(),
          projectFactory({
            name: projectName,
            siteAddress: {
              town
            }
          })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "COMPANY_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: town }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });

      describe("postcode", () => {
        it("with space", () => {
          const postcode = "WC2A 1PR";
          const projects = [
            projectFactory(),
            projectFactory({
              name: projectName,
              siteAddress: {
                postcode
              }
            })
          ];

          const { container } = renderWithUserProvider(
            <ApolloProvider>
              <MarketProvider market={generateMarketContext({ id: 1 })}>
                <AccountContextWrapper
                  account={generateAccount({
                    role: "COMPANY_ADMIN",
                    hasCompany: true
                  })}
                >
                  <RouterContext.Provider value={createMockRouter({})}>
                    <ProjectSidePanel
                      onProjectSelected={() => ({})}
                      projects={projects}
                    />
                  </RouterContext.Provider>
                </AccountContextWrapper>
              </MarketProvider>
            </ApolloProvider>
          );
          fireEvent.click(screen.getByText("filters.labels.ALL"));
          expect(screen.getAllByTestId("projectCard").length).toBe(2);
          fireEvent.change(container.querySelector("#filter"), {
            target: { value: postcode }
          });

          const filteredList = screen.getAllByTestId("projectCard");
          expect(filteredList.length).toBe(1);
          expect(filteredList[0]).toHaveTextContent(projectName);
        });

        it("without space", () => {
          const postcode = "WC2A 1PR";
          const projects = [
            projectFactory(),
            projectFactory({
              name: projectName,
              siteAddress: {
                postcode
              }
            })
          ];

          const { container } = renderWithUserProvider(
            <ApolloProvider>
              <MarketProvider market={generateMarketContext({ id: 1 })}>
                <AccountContextWrapper
                  account={generateAccount({
                    role: "COMPANY_ADMIN",
                    hasCompany: true
                  })}
                >
                  <RouterContext.Provider value={createMockRouter({})}>
                    <ProjectSidePanel
                      onProjectSelected={() => ({})}
                      projects={projects}
                    />
                  </RouterContext.Provider>
                </AccountContextWrapper>
              </MarketProvider>
            </ApolloProvider>
          );
          fireEvent.click(screen.getByText("filters.labels.ALL"));
          expect(screen.getAllByTestId("projectCard").length).toBe(2);
          fireEvent.change(container.querySelector("#filter"), {
            target: { value: postcode.replace(" ", "") }
          });

          const filteredList = screen.getAllByTestId("projectCard");
          expect(filteredList.length).toBe(1);
          expect(filteredList[0]).toHaveTextContent(projectName);
        });
      });

      it("buildingOwnerFirstname", () => {
        const buildingOwnerFirstname = "building Owner Firstname";

        const projects = [
          projectFactory(),
          projectFactory({
            name: projectName,
            buildingOwnerFirstname
          })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "COMPANY_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: buildingOwnerFirstname }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });

      it("buildingOwnerLastName", () => {
        const buildingOwnerLastname = "building Owner Lastname";
        const projects = [
          projectFactory(),
          projectFactory({
            name: projectName,
            buildingOwnerLastname
          })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "COMPANY_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: buildingOwnerLastname }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });

      it("buildingOwnerCompany", () => {
        const buildingOwnerCompany = "building Owner Company Name";
        const projects = [
          projectFactory(),
          projectFactory({
            name: projectName,
            buildingOwnerCompany
          })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "COMPANY_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: buildingOwnerCompany }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });

      it("buildingOwnerMail", () => {
        const buildingOwnerMail = "building Owner Mail";
        const projects = [
          projectFactory(),
          projectFactory({
            name: projectName,
            buildingOwnerMail
          })
        ];

        const { container } = renderWithUserProvider(
          <ApolloProvider>
            <MarketProvider market={generateMarketContext({ id: 1 })}>
              <AccountContextWrapper
                account={generateAccount({
                  role: "COMPANY_ADMIN",
                  hasCompany: true
                })}
              >
                <RouterContext.Provider value={createMockRouter({})}>
                  <ProjectSidePanel
                    onProjectSelected={() => ({})}
                    projects={projects}
                  />
                </RouterContext.Provider>
              </AccountContextWrapper>
            </MarketProvider>
          </ApolloProvider>
        );
        fireEvent.click(screen.getByText("filters.labels.ALL"));
        expect(screen.getAllByTestId("projectCard").length).toBe(2);
        fireEvent.change(container.querySelector("#filter"), {
          target: { value: buildingOwnerMail }
        });

        const filteredList = screen.getAllByTestId("projectCard");
        expect(filteredList.length).toBe(1);
        expect(filteredList[0]).toHaveTextContent(projectName);
      });
    });
  });
});
