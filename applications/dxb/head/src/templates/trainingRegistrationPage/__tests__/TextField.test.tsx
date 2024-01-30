import ThemeProvider from "@bmi-digital/components/theme-provider";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import TextField, { Props } from "../components/TextField";

describe("TrainingRegistrationPage TextField", () => {
  const defaultProps: Props = {
    name: "field-name",
    label: "field label",
    "data-testid": "test-input"
  };

  it("should not render reset button by default", () => {
    render(
      <ThemeProvider>
        <TextField {...defaultProps} />
      </ThemeProvider>
    );

    expect(
      screen.queryByTestId("reset-input-value-icon-button")
    ).not.toBeInTheDocument();
  });

  it("should not render reset button when user is typing in input", () => {
    render(
      <ThemeProvider>
        <TextField {...defaultProps} />
      </ThemeProvider>
    );

    const inputLabel = screen.getByLabelText(defaultProps.label as string);
    //makes input active
    fireEvent.click(inputLabel);
    fireEvent.change(inputLabel, { target: { value: "test-value" } });
    expect(
      screen.queryByTestId("reset-input-value-icon-button")
    ).not.toBeInTheDocument();
  });

  it("should render reset button on blur if the value is not empty", () => {
    render(
      <ThemeProvider>
        <TextField {...defaultProps} />
      </ThemeProvider>
    );

    const inputLabel = screen.getByLabelText(defaultProps.label as string);
    //makes input active
    fireEvent.click(inputLabel);
    fireEvent.change(inputLabel, { target: { value: "test-value" } });
    fireEvent.blur(inputLabel);
    expect(
      screen.getByTestId("reset-input-value-icon-button")
    ).toBeInTheDocument();
  });

  it("resets the value on reset button click", () => {
    render(
      <ThemeProvider>
        <TextField {...defaultProps} />
      </ThemeProvider>
    );

    const input = screen.getByTestId(`${defaultProps["data-testid"]}-input`);
    fireEvent.change(input, { target: { value: "test-value" } });
    fireEvent.click(screen.getByTestId("reset-input-value-icon-button"));
    expect(input).toHaveDisplayValue("");
  });
});
