import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "../../../lib/tests/utils";
import { LinearProgress } from "../";

describe("LinearProgress", () => {
  const stageValue = 10;
  const max = 30;

  it("render correctly", () => {
    const { container } = render(
      <LinearProgress stageValue={stageValue} max={max} />
    );

    expect(container).toMatchSnapshot();
    expect(container.querySelector(".linearProgress")).toBeTruthy();
    expect(screen.getByText(`${stageValue} / ${max}`)).toBeTruthy();
  });

  it("render correctly with custom LinearProgress Props", () => {
    const { container } = render(
      <LinearProgress stageValue={stageValue} max={max} color={"primary"} />
    );

    expect(container).toMatchSnapshot();
    expect(
      container.querySelector(".linearProgress.MuiLinearProgress-colorPrimary")
    ).toBeTruthy();
  });
});
