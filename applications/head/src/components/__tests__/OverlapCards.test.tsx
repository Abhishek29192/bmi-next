import React from "react";
import OverlapCards, { Data } from "../OverlapCards";
import { render } from "@testing-library/react";

describe("OverlapCards component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        label: "Call to action",
        URL: null,
        page: {
          slug: "some-page"
        },
        image: {
          resize: {
            src: "link-to-page.png"
          }
        }
      },
      {
        label: "Call to action",
        URL: "some-page",
        page: null,
        image: {
          resize: {
            src: "link-to-page.png"
          }
        }
      }
    ];

    const { container } = render(<OverlapCards data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
