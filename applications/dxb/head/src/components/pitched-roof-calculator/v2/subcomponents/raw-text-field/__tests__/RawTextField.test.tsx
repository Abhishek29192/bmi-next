import { ThemeProvider } from "@bmi/components";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import RawTextField from "../RawTextField";

describe("RawTextField component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label="Email address"
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if error is true", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label="Email address"
          error={true}
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with leftAdornment", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label="Email address"
          leftAdornment={<div>leftAdornment</div>}
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly with rightAdornment", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label="Email address"
          rightAdornment={<div>rightAdornment</div>}
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("does not display rightAdornment if provided and error is true", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label="Email address"
          rightAdornment={<div>rightAdornment</div>}
          error
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if variant === hybrid", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label="Email address"
          variant="hybrid"
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if variant === outlined", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label="Email address"
          variant="outlined"
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if isTextArea is true", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          isTextArea
          id="email"
          name="Email"
          label="Email address"
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
  it("renders correctly if isRequired is true", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          isRequired
          id="email"
          name="Email"
          label="Email address"
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if helperText is populated", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          helperText="helperText"
          id="email"
          name="Email"
          label="Email address"
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if errorText is populated", () => {
    const { container } = render(
      <ThemeProvider>
        <RawTextField
          errorText="errorText"
          error
          id="email"
          name="Email"
          label="Email address"
          placeholder="e.g. lorem@ipsum.com"
          onChange={console.log}
        />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });

  it("execute onChange correctly", () => {
    const onChange = jest.fn();
    const label = "Email address";
    const value = "value";
    const { queryByLabelText } = render(
      <ThemeProvider>
        <RawTextField
          id="email"
          name="Email"
          label={label}
          variant="hybrid"
          placeholder="e.g. lorem@ipsum.com"
          onChange={onChange}
        />
      </ThemeProvider>
    );
    fireEvent.change(queryByLabelText(label)!, { target: { value } });
    expect(onChange).toBeCalledWith(value);
  });
});
