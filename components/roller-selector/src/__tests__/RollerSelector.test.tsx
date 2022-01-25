import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RollerSelector from "../";

describe("RollerSelector component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <RollerSelector>Lorem ipsum sit dolor</RollerSelector>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders selected", () => {
    const { container } = render(
      <RollerSelector isSelected>Lorem ipsum sit dolor</RollerSelector>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with custom className", () => {
    const { container } = render(
      <RollerSelector className="testing">Lorem ipsum sit dolor</RollerSelector>
    );
    expect(container).toMatchSnapshot();
  });
  it("triggers an onClick event", () => {
    const onClick = jest.fn();
    const label = "Lorem ipsum sit dolor";
    const { getByText } = render(<RollerSelector>{label}</RollerSelector>);

    fireEvent.click(getByText(label));

    expect(onClick.mock.calls).toMatchSnapshot();
  });
});
