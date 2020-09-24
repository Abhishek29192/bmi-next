import React from "react";
import PageIntro from "../PageIntro";
import { render } from "@testing-library/react";

describe("PageIntro component", () => {
  it("renders correctly", () => {
    const { container } = render(<PageIntro>Lorem ipsum</PageIntro>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
