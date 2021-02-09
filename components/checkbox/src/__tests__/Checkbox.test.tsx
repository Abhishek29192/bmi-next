import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Checkbox from "../";

describe("Checkbox component", () => {
  it("renders correctly", () => {
    const { container } = render(<Checkbox name="Test checkbox" />);
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with label", () => {
    const { container } = render(
      <Checkbox
        name="Test checkbox"
        label="Send a copy of this message to my email address"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with error message", () => {
    const { container } = render(
      <Checkbox
        name="Test checkbox"
        label="Send a copy of this message to my email address"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("renders with disabled state", () => {
    const { container } = render(
      <Checkbox
        name="Test checkbox"
        disabled
        label="Send a copy of this message to my email address"
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
  it("calls onChange handler", async () => {
    const label = "test-label";
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <Checkbox onChange={onChange} name="Test checkbox" label={label} />
    );
    fireEvent.click(getByLabelText(label));
    expect(onChange.mock.calls).toMatchSnapshot();
  });
  it("does not call onChange handler when disabled", async () => {
    const label = "test-label";
    const onChange = jest.fn();
    const { getByLabelText } = render(
      <Checkbox
        onChange={onChange}
        name="Test checkbox"
        label={label}
        disabled
      />
    );
    fireEvent.click(getByLabelText(label));
    expect(onChange.mock.calls).toMatchSnapshot();
  });
  it("renders error", async () => {
    const label = "test-label-2";
    const { container, getByLabelText } = render(
      <Checkbox isRequired name="Test checkbox" disabled label={label} />
    );
    fireEvent.blur(getByLabelText(label));
    expect(container.firstChild).toMatchSnapshot();
  });
});
