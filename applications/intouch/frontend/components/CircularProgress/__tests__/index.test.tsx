import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "../../../lib/tests/utils";
import { CircularProgress } from "../";

describe("CircularProgress", () => {
  it("render correctly", () => {
    const { container } = render(<CircularProgress value={10} />);

    expect(container).toMatchSnapshot();
    expect(screen.getByText("10%")).toBeTruthy();
    expect(container.querySelector(".circularProgress")).toBeTruthy();
    expect(container.querySelector(".circularProgressRail")).toBeTruthy();
  });

  it("render correctly with custom backgroundProps", () => {
    const { container } = render(
      <CircularProgress value={10} backgroundProps={{ size: 100 }} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector(".circularProgress")).toHaveStyle(
      "width: 100px"
    );
  });

  it("render correctly with custom circularProgressRailProps", () => {
    const { container } = render(
      <CircularProgress value={10} railProps={{ size: 100 }} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector(".circularProgressRail")).toHaveStyle(
      "width: 100px"
    );
  });
});
