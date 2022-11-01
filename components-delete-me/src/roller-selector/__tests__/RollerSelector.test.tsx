import React from "react";
import { fireEvent } from "@testing-library/react";
import RollerSelector from "../RollerSelector";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("RollerSelector component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <RollerSelector>Lorem ipsum sit dolor</RollerSelector>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders selected", () => {
    const { container } = renderWithThemeProvider(
      <RollerSelector isSelected>Lorem ipsum sit dolor</RollerSelector>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with custom className", () => {
    const { container } = renderWithThemeProvider(
      <RollerSelector className="testing">Lorem ipsum sit dolor</RollerSelector>
    );
    expect(container).toMatchSnapshot();
  });
  it("triggers an onClick event", () => {
    const onClick = jest.fn();
    const label = "Lorem ipsum sit dolor";
    const { getByText } = renderWithThemeProvider(
      <RollerSelector>{label}</RollerSelector>
    );

    fireEvent.click(getByText(label));

    expect(onClick.mock.calls).toMatchSnapshot();
  });
});
