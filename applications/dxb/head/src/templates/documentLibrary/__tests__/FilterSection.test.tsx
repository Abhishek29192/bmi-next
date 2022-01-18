import React from "react";
import { render, fireEvent } from "@testing-library/react";
import FilterSection, {
  Props as FilterSectionProps
} from "../components/FilterSection";

describe("FilterSection", () => {
  const handleFiltersChange = jest
    .fn()
    .mockImplementation((param) => (param1, param2) => jest.fn());
  const clearFilters = jest.fn();
  const props: FilterSectionProps = {
    filters: [
      {
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
    const { container, getByText } = render(<FilterSection {...props} />);

    expect(container.firstChild).toMatchSnapshot();
    expect(getByText("MC: documentLibrary.filters.title")).toBeTruthy();
    expect(getByText("MC: documentLibrary.filters.clearAll")).toBeTruthy();
    expect(container.querySelector(".Filters")).toBeTruthy();
  });

  it("run clearFilters after clicking clearFiltersButton", () => {
    const { getByText } = render(<FilterSection {...props} />);

    const clearFilterButton = getByText("MC: documentLibrary.filters.clearAll");
    fireEvent.click(clearFilterButton);
    expect(clearFilters).toHaveBeenCalledTimes(1);
  });

  it("run handleFiltersChange after applied filter", () => {
    const { container } = render(<FilterSection {...props} />);

    const filterbutton = container.querySelector(".Filters .list input");
    fireEvent.click(filterbutton);
    expect(handleFiltersChange).toHaveBeenCalled();
  });
});
