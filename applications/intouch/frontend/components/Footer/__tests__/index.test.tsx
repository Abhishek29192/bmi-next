import React from "react";
import { render } from "@testing-library/react";
import { Footer } from "..";

describe("Footer Component", () => {
  it("renders correctly", () => {
    const links = [
      {
        href: "/contact",
        label: "Contact"
      }
    ];
    const { container } = render(<Footer links={links} />);

    expect(container).toMatchSnapshot();
  });

  it("no links case", () => {
    const { container } = render(<Footer links={null} />);
    expect(container).toMatchSnapshot();
  });
});
