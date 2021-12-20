import React from "react";
import { render } from "@testing-library/react";
import AlertBanner from "..";

describe("AlertBanner component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <AlertBanner severity="success">
        <AlertBanner.Title>Success</AlertBanner.Title>
        This is a success alert banner
      </AlertBanner>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with a warning severity", () => {
    const { container } = render(
      <AlertBanner severity="warning">
        <AlertBanner.Title>Warning</AlertBanner.Title>
        This is a warning alert banner
      </AlertBanner>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with an action", () => {
    const { container } = render(
      <AlertBanner severity="warning" actions={<span>Some action here</span>}>
        <AlertBanner.Title>Warning</AlertBanner.Title>
        This is a warning alert banner
      </AlertBanner>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders correctly with a sticky position", () => {
    const { container } = render(
      <AlertBanner severity="warning" stickyPosition={100}>
        <AlertBanner.Title>Warning</AlertBanner.Title>
        This is a warning alert banner
      </AlertBanner>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
