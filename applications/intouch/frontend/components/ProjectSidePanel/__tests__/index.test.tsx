import React from "react";
import { render } from "@testing-library/react";
import { ProjectSidePanel } from "..";
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
          endDate: "01/01/2019"
        }
      ]
    };

    const { container } = render(<ProjectSidePanel projects={projects} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
