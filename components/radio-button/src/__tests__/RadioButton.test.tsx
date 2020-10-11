import React from "react";
import RadioButton from "../";
import { render } from "@testing-library/react";

describe("RadioButton component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <RadioButton name="deckType" value="Combustible (timber/plywood)">
        Combustible (timber/plywood)
      </RadioButton>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("render with prefix", () => {
    const { container } = render(
      <RadioButton
        name="color"
        before={
          <div
            style={{
              minHeight: "100%",
              minWidth: 72,
              backgroundColor: "#D9D8D8"
            }}
          />
        }
        value="Grey"
      >
        Grey
      </RadioButton>
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("calls onChange", () => {
    const handleOnChange = jest.fn();
    const text = "Combustible (timber/plywood)";

    const { container } = render(
      <RadioButton
        onChange={handleOnChange}
        name="deckType"
        value="Combustible (timber/plywood)"
      >
        {text}
      </RadioButton>
    );

    container.querySelector("label").click();

    expect(handleOnChange).toHaveBeenCalled();
  });
});
