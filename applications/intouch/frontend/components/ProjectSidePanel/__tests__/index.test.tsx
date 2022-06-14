import React from "react";
import { fireEvent } from "@testing-library/react";
import { ProjectSidePanel } from "..";
import {
  render,
  renderWithUserProvider,
  screen
} from "../../../lib/tests/utils";
import I18nProvider from "../../../lib/tests/fixtures/i18n";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import ApolloProvider from "../../../lib/tests/fixtures/apollo";
import MarketProvider from "../../../lib/tests/fixtures/market";
import { GetProjectsQuery } from "../../../graphql/generated/operations";
import { generateAccount } from "../../../lib/tests/factories/account";
import { generateMarketContext } from "../../../lib/tests/factories/market";
import { generateGuarantee } from "../../../lib/tests/factories/guarantee";
import { generateProject } from "../../../lib/tests/factories/project";

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
          <ProjectSidePanel projects={projects} />
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
          <ProjectSidePanel projects={projects} />
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
            <ProjectSidePanel
              onProjectSelected={() => ({})}
              projects={[project]}
            />
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
            <ProjectSidePanel projects={[project]} />
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
            <ProjectSidePanel projects={[project]} />
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );
    const filterListButtons = container.querySelectorAll(".filterButton .Chip");
    fireEvent.click(filterListButtons[5]);
    expect(screen.queryByText("fallback.noResults")).toBeFalsy();
  });
  it("should show project side panel footer if user company admin", () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper
          account={generateAccount({ role: "COMPANY_ADMIN", hasCompany: true })}
        >
          <ProjectSidePanel projects={[]} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(screen.getByTestId("project-side-panel-footer-button")).toBeTruthy();
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
            <ProjectSidePanel projects={[]} />
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
  it("check case with company record missing", () => {
    const account = generateAccount({
      role: "MARKET_ADMIN",
      hasCompany: false
    });
    renderWithUserProvider(
      <ApolloProvider>
        <MarketProvider market={generateMarketContext({ id: 1 })}>
          <AccountContextWrapper account={account}>
            <ProjectSidePanel projects={[]} />
          </AccountContextWrapper>
        </MarketProvider>
      </ApolloProvider>
    );
    const createProject = screen.queryByTestId(
      "project-side-panel-footer-button"
    );
    expect(createProject).toBeFalsy();
  });
  it("should not show project side panel footer if the user installer", () => {
    renderWithUserProvider(
      <ApolloProvider>
        <AccountContextWrapper
          account={generateAccount({ role: "INSTALLER", hasCompany: true })}
        >
          <ProjectSidePanel projects={[]} />
        </AccountContextWrapper>
      </ApolloProvider>
    );
    expect(
      screen.queryByTestId("project-side-panel-footer-button")
    ).toBeFalsy();
  });
});
