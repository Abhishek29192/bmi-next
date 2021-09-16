import React from "react";
import { render } from "@testing-library/react";
import { ProjectSidePanel } from "..";
import I18nProvider from "../../../lib/tests/fixtures/i18n";
import AccountContextWrapper from "../../../lib/tests/fixtures/account";
import { GetProjectsQuery } from "../../../graphql/generated/operations";

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
        endDate: "01/01/2020"
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
    expect(container.firstChild).toMatchSnapshot();
  });

  it("shows ALL projects by default", () => {
    const siteAddress = {
      postcode: "N11 111",
      town: "LONDON"
    };

    const projects: GetProjectsQuery["projects"]["nodes"] = [
      {
        id: 1,
        name: "test 1",
        siteAddress,
        technology: "FLAT",
        startDate: "01/01/2019",
        endDate: "01/02/2019"
      },
      {
        id: 2,
        name: "test 2",
        siteAddress,
        technology: "PITCHED",
        startDate: "01/01/2019",
        endDate: "01/02/2020"
      },
      {
        id: 3,
        name: "test 3",
        siteAddress,
        technology: "FLAT",
        startDate: "01/02/2020",
        endDate: "01/01/2021"
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
    expect(container.firstChild).toMatchSnapshot();
  });
});
