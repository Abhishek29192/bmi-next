import React from "react";
import Grid from "../Grid";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Grid component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(<Grid />);
    expect(container).toMatchSnapshot();
  });

  it("item renders correctly", () => {
    const { container } = renderWithThemeProvider(<Grid item />);
    expect(container).toMatchSnapshot();
  });

  it("renders when centered", () => {
    const { container } = renderWithThemeProvider(
      <Grid justifyContent="center" />
    );
    expect(container).toMatchSnapshot();
  });
});
