import React from "react";
import OverlapCards, { Data } from "../OverlapCards";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";

beforeAll(() => {
  mockConsole();
});

describe("OverlapCards component", () => {
  it("renders correctly", () => {
    const data: Data = [
      {
        title: "Call to action",
        slug: "some-page",
        featuredImage: {
          resize: {
            src: "link-to-page.png"
          }
        }
      },
      {
        title: "Call to action",
        slug: "some-page",
        featuredImage: {
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
