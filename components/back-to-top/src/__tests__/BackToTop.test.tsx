import React from "react";
import BackToTop from "../";
import { render, fireEvent } from "@testing-library/react";

describe("BackToTop component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <BackToTop accessibilityLabel="back-to-top" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with className", () => {
    const { container } = render(
      <BackToTop accessibilityLabel="back-to-top" className="classname" />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("handles scroll", () => {
    const { container } = render(
      <BackToTop accessibilityLabel="back-to-top" />
    );
    global.pageYOffset = 100;
    fireEvent.scroll(window);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("handles button click", () => {
    const { container, getByRole } = render(
      <BackToTop accessibilityLabel="back-to-top" />
    );
    const jsdomInnerHeight = 768;
    global.pageYOffset = jsdomInnerHeight * 2 + 1;
    fireEvent.scroll(window);
    window.scrollTo = jest.fn();
    const button = getByRole("button");
    fireEvent.click(button);
    expect(container.firstChild).toMatchSnapshot();
  });
});
