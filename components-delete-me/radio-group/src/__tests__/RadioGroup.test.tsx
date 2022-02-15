import React from "react";
import { render } from "@testing-library/react";
import { RadioButton } from "@bmi-digital/components";
import RadioGroup from "../";

describe("RadioGroup component", () => {
  it("renders correctly", () => {
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
    const { container } = render(
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
