import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Search from "../";

describe("Search component", () => {
  it("renders correctly", () => {
    const { container } = render(<Search />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly if value provided", () => {
    const { container } = render(<Search value="value" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly if buttonText provided", () => {
    const { container } = render(<Search buttonText="buttonText" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("renders correctly if helperText provided", () => {
    const { container } = render(<Search helperText="helperText" />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it("should execute onChange function correctly", () => {
    const onChange = jest.fn();
    const value = "value";
    const { getAllByTestId } = render(
      <Search
        onChange={onChange}
        placeholder="placeholder"
        value={value}
        fieldName="fieldName"
        buttonComponent={({ children, ...rest }) => (
          <button {...rest} data-testid="button">
            {children}
          </button>
        )}
      />
    );
    fireEvent.click(getAllByTestId("button")[0]);

    expect(onChange).toBeCalledTimes(1);
  });

  it("should not execute onChange if it is undefined", () => {
    const onChange = jest.fn();
    const value = "value";
    const { getAllByTestId } = render(
      <Search
        placeholder="placeholder"
        value={value}
        fieldName="fieldName"
        buttonComponent={({ children, ...rest }) => (
          <button {...rest} data-testid="button">
            {children}
          </button>
        )}
      />
    );
    fireEvent.click(getAllByTestId("button")[0]);

    expect(onChange).toBeCalledTimes(0);
  });
});
