import React from "react";
import { render } from "@testing-library/react";
import TeamList, { Data } from "../TeamList";

describe("TeamList component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        name: "Name",
        jobTitle: "Job Title",
        profileImage: {
          type: null,
          altText: "Lorem ipsum",
          caption: null,
          focalPoint: null,
          image: {
            fluid: {
              aspectRatio: 1,
              src: "",
              srcSet: "",
              sizes: ""
            },
            resize: {
              src: "link-to-page.png"
            }
          }
        },
        links: null
      }
    ];

    const { container } = render(<TeamList data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
