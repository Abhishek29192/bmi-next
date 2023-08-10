import React from "react";
import { screen } from "@testing-library/react";
import { GoodBetterBest } from "@bmi/pim-types";
import GoodBetterBestIndicator from "../GoodBetterBestIndicator";
import { renderWithProviders } from "../../__tests__/renderWithProviders";

describe("GoodBetterBestIndicator component", () => {
  it("returns null if a tag is not provided", () => {
    const { container } = renderWithProviders(
      <GoodBetterBestIndicator indicatorType={undefined} />
    );
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toBeNull();
  });

  it("renders correctly with good indicator", () => {
    renderWithProviders(
      <GoodBetterBestIndicator indicatorType={GoodBetterBest.good} />
    );
    expect(
      screen.getByText("MC: goodBetterBest.label.good")
    ).toBeInTheDocument();
    expect(screen.getByTestId("goodBetterBest-icon-good")).toBeInTheDocument();
  });

  it("renders correctly with better indicator", () => {
    renderWithProviders(
      <GoodBetterBestIndicator indicatorType={GoodBetterBest.better} />
    );
    expect(
      screen.getByText("MC: goodBetterBest.label.better")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("goodBetterBest-icon-better")
    ).toBeInTheDocument();
  });

  it("renders correctly with best indicator", () => {
    renderWithProviders(
      <GoodBetterBestIndicator indicatorType={GoodBetterBest.best} />
    );
    expect(
      screen.getByText("MC: goodBetterBest.label.best")
    ).toBeInTheDocument();
    expect(screen.getByTestId("goodBetterBest-icon-best")).toBeInTheDocument();
  });
});
