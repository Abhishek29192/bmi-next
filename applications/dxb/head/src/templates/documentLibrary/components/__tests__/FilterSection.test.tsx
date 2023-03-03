import { ThemeProvider } from "@bmi-digital/components";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import FilterSection, { Props as FilterSectionProps } from "../FilterSection";

describe("FilterSection", () => {
  const handleFiltersChange = jest
    .fn()
    .mockImplementation((param) => (param1, param2) => jest.fn());
  const clearFilters = jest.fn();
  const props: FilterSectionProps = {
    filters: [
      {
        filterCode: "filter1",
        label: "filter1",
        name: "filter1",
        value: [],
        options: [
          {
            value: "value",
            label: "filterLabel",
            isDisabled: false
          }
        ]
      }
    ],
    handleFiltersChange,
    clearFilters
  };

  it("render correctly", () => {
    const { container } = render(
      <ThemeProvider>
        <FilterSection {...props} />
      </ThemeProvider>
    );

    expect(screen.getByText("MC: documentLibrary.filters.title")).toBeTruthy();
    expect(
      screen.getByText("MC: documentLibrary.filters.clearAll")
    ).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("run clearFilters after clicking clearFiltersButton", () => {
    render(
      <ThemeProvider>
        <FilterSection {...props} />
      </ThemeProvider>
    );

    const clearFilterButton = screen.getByText(
      "MC: documentLibrary.filters.clearAll"
    );
    fireEvent.click(clearFilterButton);
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });

  it("run handleFiltersChange after applied filter", () => {
    render(
      <ThemeProvider>
        <FilterSection {...props} />
      </ThemeProvider>
    );

    const filterbutton = screen.getByTestId("filter-checkbox");
    fireEvent.click(filterbutton);
    expect(handleFiltersChange).toHaveBeenCalled();
  });
});
