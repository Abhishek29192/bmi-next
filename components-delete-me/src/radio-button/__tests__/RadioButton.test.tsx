import React from "react";
import RadioButton from "../RadioButton";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("RadioButton component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <RadioButton name="deckType" value="Combustible (timber/plywood)">
        Combustible (timber/plywood)
      </RadioButton>
    );

    expect(container).toMatchSnapshot();
  });

  it("render with prefix", () => {
    const { container } = renderWithThemeProvider(
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

    expect(container).toMatchSnapshot();
  });

  it("calls onChange", () => {
    const handleOnChange = jest.fn();
    const text = "Combustible (timber/plywood)";

    const { container } = renderWithThemeProvider(
      <RadioButton
        onChange={handleOnChange}
        name="deckType"
        value="Combustible (timber/plywood)"
      >
        {text}
      </RadioButton>
    );

    container.querySelector("label")!.click();

    expect(handleOnChange).toHaveBeenCalled();
  });
});
