import React from "react";
import RadioButton from "../../radio-button/RadioButton";
import { renderWithThemeProvider } from "../../__tests__/helper";
import RadioGroup from "../RadioGroup";

describe("RadioGroup component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <RadioGroup name="deckType">
        <RadioButton value="label">
          <span>Combustible (timber/plywood)</span>
        </RadioButton>
        <div>Non-combustible (metal/concrete)</div>
      </RadioGroup>
    );
    expect(container).toMatchSnapshot();
  });

  it("execute onChange correctly", () => {
    const handleOnChange = jest.fn();
    const { container } = renderWithThemeProvider(
      <RadioGroup name="deckType" onChange={handleOnChange}>
        <RadioButton value="label">
          <span>Combustible (timber/plywood)</span>
        </RadioButton>
        <RadioButton value="label">
          <span>Non-combustible (metal/concrete)</span>
        </RadioButton>
      </RadioGroup>
    );

    container.querySelectorAll("label")[0].click();

    expect(handleOnChange).toBeCalledTimes(1);
  });

  it("renders correctly with className prop", () => {
    const { container } = renderWithThemeProvider(
      <RadioGroup className="name" name="deckType">
        <RadioButton value="label">
          <span>Combustible (timber/plywood)</span>
        </RadioButton>
        <RadioButton value="label">
          <span>Non-combustible (metal/concrete)</span>
        </RadioButton>
      </RadioGroup>
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly with defaultValue prop", () => {
    const { container } = renderWithThemeProvider(
      <RadioGroup defaultValue="defaultValue" name="deckType">
        <RadioButton value="label">
          <span>Combustible (timber/plywood)</span>
        </RadioButton>
        <RadioButton value="label">
          <span>Non-combustible (metal/concrete)</span>
        </RadioButton>
      </RadioGroup>
    );

    expect(container).toMatchSnapshot();
  });
});
