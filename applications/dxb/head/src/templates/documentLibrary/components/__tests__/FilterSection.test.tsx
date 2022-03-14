import { ThemeProvider } from "@bmi/components";
import { fireEvent, render } from "@testing-library/react";
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
    const { container, getByText } = render(
      <ThemeProvider>
        <FilterSection {...props} />
      </ThemeProvider>
    );

    expect(getByText("MC: documentLibrary.filters.title")).toBeTruthy();
    expect(getByText("MC: documentLibrary.filters.clearAll")).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it("run clearFilters after clicking clearFiltersButton", () => {
    const { getByText } = render(
      <ThemeProvider>
        <FilterSection {...props} />
      </ThemeProvider>
    );

    const clearFilterButton = getByText("MC: documentLibrary.filters.clearAll");
    fireEvent.click(clearFilterButton);
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });

  it("run handleFiltersChange after applied filter", () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <FilterSection {...props} />
      </ThemeProvider>
    );

    const filterbutton = getByTestId("filter-checkbox");
    fireEvent.click(filterbutton);
    expect(handleFiltersChange).toHaveBeenCalled();
  });
});
