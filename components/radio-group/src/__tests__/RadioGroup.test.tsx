import React from "react";
import RadioGroup from "../";
import { render } from "@testing-library/react";

describe("RadioGroup component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <RadioGroup name="deckType">
        <RadioGroup.Item value="Combustible (timber/plywood)">
          Combustible (timber/plywood)
        </RadioGroup.Item>
        <RadioGroup.Item value="Non-combustible (metal/concrete)">
          Non-combustible (metal/concrete)
        </RadioGroup.Item>
      </RadioGroup>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("selects initialValue", () => {
    const { container } = render(
      <RadioGroup name="deckType" initialValue="Combustible (timber/plywood)">
        <RadioGroup.Item value="Combustible (timber/plywood)">
          Combustible (timber/plywood)
        </RadioGroup.Item>
        <RadioGroup.Item value="Non-combustible (metal/concrete)">
          Non-combustible (metal/concrete)
        </RadioGroup.Item>
      </RadioGroup>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it("calls onChange", () => {
    const handleOnChange = jest.fn();

    const { container } = render(
      <RadioGroup name="deckType" onChange={handleOnChange}>
        <RadioGroup.Item value="Combustible (timber/plywood)">
          Combustible (timber/plywood)
        </RadioGroup.Item>
        <RadioGroup.Item value="Non-combustible (metal/concrete)">
          Non-combustible (metal/concrete)
        </RadioGroup.Item>
      </RadioGroup>
    );

    container.querySelectorAll("label")[1].click();

    expect(handleOnChange).toMatchSnapshot();
  });
});
