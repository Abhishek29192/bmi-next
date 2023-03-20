import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import UpDownSimpleNumericInput from "../UpDownSimpleNumericInput";

describe("UpDownSimpleNumericInput component", () => {
  it("renders correctly", () => {
    const onInputMock = jest.fn();
    const { container } = render(
      <ThemeProvider>
        <UpDownSimpleNumericInput name="Counter" onChange={onInputMock} />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders variant with buttons on the side", () => {
    const onInputMock = jest.fn();
    const { container } = render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          buttonPlacement="right"
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders variant with step set to a pre-defined value", () => {
    const onInputMock = jest.fn();
    const stepValue = 5;
    const { container } = render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          step={stepValue}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("should trigger handleIncrement function on click button Up", () => {
    const onInputMock = jest.fn();
    const stepValue = 5;
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          step={stepValue}
        />
      </ThemeProvider>
    );
    const buttonUp = screen.getByLabelText("Up");
    if (buttonUp) {
      fireEvent.click(buttonUp);
    }
    expect(onInputMock).toHaveBeenCalledWith(5);
  });

  it("should trigger handleDecrement function on click button Down", () => {
    const onInputMock = jest.fn();
    const stepValue = 5;
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          step={stepValue}
        />
      </ThemeProvider>
    );
    const buttonDown = screen.getByLabelText("Down");
    if (buttonDown) {
      fireEvent.click(buttonDown);
    }
    expect(onInputMock).toHaveBeenCalledWith(-5);
  });

  it("should trigger handleChange function with correct value on trigger input change event with value 5", () => {
    const onInputMock = jest.fn();
    const stepValue = 5;
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          step={stepValue}
        />
      </ThemeProvider>
    );
    const input = screen.getByTestId(
      "up-down-simple-numeric-input-text-field-input"
    );
    if (input) {
      fireEvent.change(input, { target: { value: 5 } });
    }
    expect(onInputMock).toHaveBeenCalledWith(5);
  });

  it("should trigger handleInputChange function with incorrect value on trigger input change event with value NaN", () => {
    const onInputMock = jest.fn();
    const stepValue = 5;
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          step={stepValue}
        />
      </ThemeProvider>
    );
    const input = screen.getByTestId(
      "up-down-simple-numeric-input-text-field-input"
    );
    if (input) {
      fireEvent.change(input, { target: { value: NaN } });
    }
    expect(onInputMock).not.toHaveBeenCalled();
  });

  it("should not trigger handleInputChange function if min value is greater than current value", () => {
    const onInputMock = jest.fn();
    const min = 5;
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          min={min}
        />
      </ThemeProvider>
    );
    const input = screen.getByTestId(
      "up-down-simple-numeric-input-text-field-input"
    );
    if (input) {
      fireEvent.change(input, { target: { value: 1 } });
    }
    expect(onInputMock).toHaveBeenCalledTimes(0);
  });

  it("should trigger handleInputChange function with max value on trigger input change event with value that is more than max value", () => {
    const onInputMock = jest.fn();
    const max = 5;
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          max={max}
        />
      </ThemeProvider>
    );
    const input = screen.getByTestId(
      "up-down-simple-numeric-input-text-field-input"
    );
    if (input) {
      fireEvent.change(input, { target: { value: 6 } });
    }
    expect(onInputMock).toHaveBeenCalledWith(5);
  });

  it("should set default value if the value is defined", () => {
    const onInputMock = jest.fn();
    const defaultValue = 5;
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          defaultValue={defaultValue}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("up-down-simple-numeric-input-text-field-input")
    ).toHaveValue("5");
  });

  it("should change lockBreakpoint value for styles class of buttons container", () => {
    const onInputMock = jest.fn();
    const lockBreakpoint = "md";
    render(
      <ThemeProvider>
        <UpDownSimpleNumericInput
          name="Counter"
          onChange={onInputMock}
          lockBreakpoint={lockBreakpoint}
          buttonPlacement={"right"}
        />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("up-down-simple-numeric-input-buttons-wrapper")
    ).toHaveClass(`locked-${lockBreakpoint}`);
  });
});
