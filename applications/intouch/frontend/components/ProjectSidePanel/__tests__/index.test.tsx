import React from "react";
import { render } from "@testing-library/react";
import { ProjectSidePanel } from "..";
import I18nProvider from "../../../lib/tests/fixtures/i18n";
import { GetProjectsQuery } from "../../../graphql/generated/operations";

describe("ProjectSidePanel component", () => {
  it("renders correctly", () => {
    const projects: GetProjectsQuery["projects"] = {
      nodes: [
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
      ]
    };

    // Mocking the date to show project in progress
    Date.now = jest.fn(() => Date.parse("2019-01-02"));

    const { container } = render(
      <I18nProvider>
        <ProjectSidePanel projects={projects} />
      </I18nProvider>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
