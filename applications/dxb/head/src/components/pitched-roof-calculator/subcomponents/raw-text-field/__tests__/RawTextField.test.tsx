import React from "react";
import { render, fireEvent } from "@testing-library/react";
import RawTextField from "../RawTextField";

describe("RawTextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if error is true", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        error={true}
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with leftAdornment", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        leftAdornment={<div>leftAdornment</div>}
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with rightAdornment", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        rightAdornment={<div>rightAdornment</div>}
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("does not display rightAdornment if provided and error is true", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        rightAdornment={<div>rightAdornment</div>}
        error
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if variant === hybrid", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        variant="hybrid"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if variant === outlined", () => {
    const { container } = render(
      <RawTextField
        id="email"
        name="Email"
        label="Email address"
        variant="outlined"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if isTextArea is true", () => {
    const { container } = render(
      <RawTextField
        isTextArea
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly if isRequired is true", () => {
    const { container } = render(
      <RawTextField
        isRequired
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if helperText is populated", () => {
    const { container } = render(
      <RawTextField
        helperText="helperText"
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if errorText is populated", () => {
    const { container } = render(
      <RawTextField
        errorText="errorText"
        error
        id="email"
        name="Email"
        label="Email address"
        placeholder="e.g. lorem@ipsum.com"
        onChange={console.log}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("execute onChange correctly", () => {
    const onChange = jest.fn();
    const label = "Email address";
    const value = "value";
    const { queryByLabelText } = render(
      <RawTextField
        id="email"
        name="Email"
        label={label}
        variant="hybrid"
        placeholder="e.g. lorem@ipsum.com"
        onChange={onChange}
      />
    );
    fireEvent.change(queryByLabelText(label)!, { target: { value } });
    expect(onChange).toBeCalledWith(value);
  });
});
