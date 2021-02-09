import React from "react";
import { render } from "@testing-library/react";
import mockConsole from "jest-mock-console";
import OverlapCards, { Data } from "../OverlapCards";

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
          resized: {
            src: "link-to-page.png"
          }
        }
      },
      {
        title: "Call to action",
        slug: "some-page",
        featuredImage: {
          resized: {
            src: "link-to-page.png"
          }
        }
      }
    ];

    const { container } = render(<OverlapCards data={data} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
