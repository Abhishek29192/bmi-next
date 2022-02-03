import React from "react";
import { ProjectSidePanel } from "..";
import {
  render,
  renderWithUserProvider,
  screen
} from "../../../lib/tests/utils";
import I18nProvider from "../../../lib/tests/fixtures/i18n";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import ApolloProvider from "../../../lib/tests/fixtures/apollo";
import { GetProjectsQuery } from "../../../graphql/generated/operations";
import { generateAccount } from "../../../lib/tests/factories/account";

describe("ProjectSidePanel component", () => {
  it("renders correctly", () => {
    const projects: GetProjectsQuery["projects"]["nodes"] = [
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

    const projects: GetProjectsQuery["projects"]["nodes"] = [
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
        siteAddress,
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
