import React from "react";
import { fireEvent } from "@testing-library/react";
import Checkbox, { Checkbox as ActualCheckbox } from "../Checkbox";
import { renderWithThemeProvider } from "../../__tests__/helper";

describe("Checkbox component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(
      <Checkbox name="Test checkbox" />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with additional props", () => {
    const { container } = renderWithThemeProvider(
      <Checkbox
        name="Test checkbox"
        className="test-classname"
        data-testid="test-id"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with label", () => {
    const { container } = renderWithThemeProvider(
      <Checkbox
        name="Test checkbox"
        label="Send a copy of this message to my email address"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders with disabled state", () => {
    const { container } = renderWithThemeProvider(
      <Checkbox
        name="Test checkbox"
        disabled
        label="Send a copy of this message to my email address"
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("calls onChange handler", async () => {
    const label = "test-label";
    const onChange = jest.fn();
    const { getByLabelText } = renderWithThemeProvider(
      <Checkbox onChange={onChange} name="Test checkbox" label={label} />
    );
    fireEvent.click(getByLabelText(label));
    expect(onChange).toHaveBeenCalledTimes(1);
  });
  it("does not call onChange handler when disabled", async () => {
    const label = "test-label";
    const onChange = jest.fn();
    const { getByLabelText } = renderWithThemeProvider(
      <Checkbox
        onChange={onChange}
        name="Test checkbox"
        label={label}
        disabled
      />
    );
    fireEvent.click(getByLabelText(label));
    expect(onChange).toHaveBeenCalledTimes(0);
  });
  it("renders error", async () => {
    const label = "test-label-2";
    const { container, getByLabelText } = renderWithThemeProvider(
      <Checkbox
        isRequired
        name="Test checkbox"
        disabled
        label={label}
        fieldIsRequiredError="required"
      />
    );
    fireEvent.blur(getByLabelText(label));
    expect(container).toMatchSnapshot();
  });
  it("renders custom error", async () => {
    const { container } = renderWithThemeProvider(
      <ActualCheckbox
        onChange={jest.fn()}
        error
        errorText="Custom Error Text"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
