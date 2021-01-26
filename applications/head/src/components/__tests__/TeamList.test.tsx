import React from "react";
import TeamList, { Data } from "../TeamList";
import { render } from "@testing-library/react";

describe("TeamList component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        name: "Name",
        jobTitle: "Job Title",
        profilePicture: {
          resize: {
            src: "link-to.jpg"
          }
        },
        links: null
      }
    ];

    const { container } = render(<TeamList data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
