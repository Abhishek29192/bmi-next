import React from "react";
import AlertBanner from "../AlertBanner";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("AlertBanner component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <AlertBanner severity="success">
        <AlertBanner.Title>Success</AlertBanner.Title>
        This is a success alert banner
      </AlertBanner>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with a warning severity", () => {
    const { container } = renderWithThemeProvider(
      <AlertBanner severity="warning">
        <AlertBanner.Title>Warning</AlertBanner.Title>
        This is a warning alert banner
      </AlertBanner>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with an action", () => {
    const { container } = renderWithThemeProvider(
      <AlertBanner severity="warning" actions={<span>Some action here</span>}>
        <AlertBanner.Title>Warning</AlertBanner.Title>
        This is a warning alert banner
      </AlertBanner>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with a sticky position", () => {
    const { container } = renderWithThemeProvider(
      <AlertBanner severity="warning" stickyPosition={100}>
        <AlertBanner.Title>Warning</AlertBanner.Title>
        This is a warning alert banner
      </AlertBanner>
    );
    expect(container).toMatchSnapshot();
  });
});
