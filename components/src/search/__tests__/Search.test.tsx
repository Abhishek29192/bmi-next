import { fireEvent } from "@testing-library/react";
import React from "react";
import { renderWithThemeProvider } from "../../__tests__/helper";
import Search from "../Search";

describe("Search component", () => {
  it("renders correctly", () => {
    const { container } = renderWithThemeProvider(<Search />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if value provided", () => {
    const { container } = renderWithThemeProvider(<Search value="value" />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if buttonText provided", () => {
    const { container } = renderWithThemeProvider(
      <Search buttonText="buttonText" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if helperText provided", () => {
    const { container } = renderWithThemeProvider(
      <Search helperText="helperText" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if clearLabel provided", () => {
    const { container } = renderWithThemeProvider(
      <Search clearLabel="clearLabel" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if defaultValue provided", () => {
    const { container } = renderWithThemeProvider(
      <Search defaultValue="defaultValue" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if label provided", () => {
    const { container } = renderWithThemeProvider(<Search label="label" />);
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if fieldName provided", () => {
    const { container } = renderWithThemeProvider(
      <Search fieldName="fieldName" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if placeholder provided", () => {
    const { container } = renderWithThemeProvider(
      <Search placeholder="placeholder" />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if isSubmitDisabled provided", () => {
    const { container } = renderWithThemeProvider(
      <Search isSubmitDisabled={true} />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders correctly if buttonComponent provided", () => {
    const { container } = renderWithThemeProvider(
      <Search buttonComponent={() => <button>buttonComponent</button>} />
    );
    expect(container).toMatchSnapshot();
  });

  it("should execute onChange function correctly", () => {
    const onChange = jest.fn();
    const value = "value";
    const { getAllByTestId } = renderWithThemeProvider(
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
    const { getAllByTestId } = renderWithThemeProvider(
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
