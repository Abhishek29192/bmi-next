import React from "react";
import { render } from "@testing-library/react";
import UpDownSimpleNumericInput from "../";

describe("UpDownSimpleNumericInput component", () => {
  it("renders correctly", () => {
    const onInputMock = jest.fn();
    const { container } = render(
      <UpDownSimpleNumericInput name="Counter" onChange={onInputMock} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders variant with buttons on the side", () => {
    const onInputMock = jest.fn();
    const { container } = render(
      <UpDownSimpleNumericInput
        name="Counter"
        onChange={onInputMock}
        buttonPlacement="right"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders variant with step set to a pre-defined value", () => {
    const onInputMock = jest.fn();
    const stepValue = 5;
    const { container } = render(
      <UpDownSimpleNumericInput
        name="Counter"
        onChange={onInputMock}
        step={stepValue}
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
