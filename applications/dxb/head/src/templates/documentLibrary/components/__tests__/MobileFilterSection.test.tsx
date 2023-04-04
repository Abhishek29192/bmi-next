import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { ThemeProvider } from "@bmi-digital/components";
import MobileFilters from "../MobileFilterSection";

describe("MobileFilters", () => {
  const mockHandleDrawerToggle = jest.fn();
  const mockClearFilters = jest.fn();

  const props = {
    isOpenMobileFilters: true,
    handleDrawerToggle: mockHandleDrawerToggle,
    clearFilters: mockClearFilters,
    filtersComponent: <div>Filters component</div>,
    documentsCount: 10
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render with correct props", () => {
    render(
      <ThemeProvider>
        <MobileFilters {...props} />
      </ThemeProvider>
    );
    expect(
      screen.getByText("MC: documentLibrary.filters.title")
    ).toBeInTheDocument();
    expect(screen.getByTestId("filters-clear-all-mobile")).toBeInTheDocument();
    const showAllResultsBtn = screen.getByTestId(
      "filters-show-all-results-btn"
    );
    expect(showAllResultsBtn).toBeInTheDocument();
    expect(showAllResultsBtn).toHaveTextContent(`${props.documentsCount}`);
  });

  it("should call handleDrawerToggle when close button is clicked", () => {
    render(
      <ThemeProvider>
        <MobileFilters {...props} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("CloseIcon"));
    expect(mockHandleDrawerToggle).toHaveBeenCalled();
  });

  it("should call clearFilters when clear button is clicked", () => {
    render(
      <ThemeProvider>
        <MobileFilters {...props} />
      </ThemeProvider>
    );
    fireEvent.click(screen.getByTestId("filters-clear-all-mobile"));
    expect(mockClearFilters).toHaveBeenCalled();
  });
});
