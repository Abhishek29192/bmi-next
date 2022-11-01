import { ThemeProvider } from "@bmi-digital/components";
import "@testing-library/jest-dom/extend-expect";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { FilterButton } from "..";

describe("FilterButton Component", () => {
  it("renders correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <FilterButton label="Filter Button" />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("run onclick props function correclty", () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <ThemeProvider>
        <FilterButton label="Filter Button" onClick={onClick} />
      </ThemeProvider>
    );

    const filterbutton = getByText("Filter Button");
    fireEvent.click(filterbutton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("show selected chip style if isActive props is true", () => {
    const { container } = render(
      <ThemeProvider>
        <FilterButton label="Filter Button" isActive={true} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });
});
