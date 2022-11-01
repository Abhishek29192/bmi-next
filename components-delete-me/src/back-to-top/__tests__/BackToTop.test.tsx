import React from "react";
import { fireEvent } from "@testing-library/react";
import BackToTop from "../BackToTop";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("BackToTop component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <BackToTop accessibilityLabel="back-to-top" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with className", () => {
    const { container } = renderWithThemeProvider(
      <BackToTop accessibilityLabel="back-to-top" className="classname" />
    );
    expect(container).toMatchSnapshot();
  });

  it("handles scroll", () => {
    const { container } = renderWithThemeProvider(
      <BackToTop accessibilityLabel="back-to-top" />
    );
    global.pageYOffset = 100;
    fireEvent.scroll(window);
    expect(container).toMatchSnapshot();
  });

  it("handles button click", () => {
    const { container, getByRole } = renderWithThemeProvider(
      <BackToTop accessibilityLabel="back-to-top" />
    );
    const jsdomInnerHeight = 768;
    global.pageYOffset = jsdomInnerHeight * 2 + 1;
    fireEvent.scroll(window);
    window.scrollTo = jest.fn();
    const button = getByRole("button");
    fireEvent.click(button);
    expect(container).toMatchSnapshot();
  });
});
