import { fireEvent, screen } from "@testing-library/react";
import React from "react";
import { useMediaQuery } from "@mui/material";
import FilterSection, { Props } from "../FiltersSidebar";
import { renderWithProviders } from "../../__tests__/renderWithProviders";

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;

const props: Props = {
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
  onFiltersChange: jest.fn(),
  onClearFilters: jest.fn()
};

describe("FiltersSidebar", () => {
  it("calls onClearFilters after clicking clearFiltersButton", () => {
    renderWithProviders(<FilterSection {...props} />);

    fireEvent.click(
      screen.getByRole("button", { name: "MC: plp.filters.clearAll" })
    );
    expect(props.onClearFilters).toHaveBeenCalledTimes(1);
  });

  it("calls handleFiltersChange after applied filter", () => {
    renderWithProviders(<FilterSection {...props} />);

    const filterbutton = screen.getByTestId("filter-checkbox");
    fireEvent.click(filterbutton);
    expect(props.onFiltersChange).toHaveBeenCalled();
  });

  it("renders with correct labels if provided", () => {
    renderWithProviders(
      <FilterSection
        {...props}
        filtersTitle="Filters title"
        clearAllBtnLabel="Clear all filters"
      />
    );

    expect(screen.getByText("Filters title")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear all filters" })
    ).toBeInTheDocument();
  });

  it("disables 'Clear All' button if disableClearAllBtn === true", () => {
    renderWithProviders(<FilterSection {...props} disableClearAllBtn />);

    expect(
      screen.getByRole("button", { name: "MC: plp.filters.clearAll" })
    ).toBeDisabled();
  });
});

describe("Mobile view", () => {
  beforeEach(() => {
    mockUseMediaQuery.mockReturnValue(true);
  });

  it("renders mobile filters when isMobile is true", () => {
    renderWithProviders(<FilterSection {...props} />);
    expect(
      screen.getByRole("button", { name: "MC: plp.filters.title" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("mobile-filters")).toBeInTheDocument();
  });

  it("opens filters when a user clicks 'open' button", () => {
    renderWithProviders(<FilterSection {...props} />);
    fireEvent.click(
      screen.getByRole("button", { name: "MC: plp.filters.title" })
    );
    expect(screen.getByTestId("filters-close-btn")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "MC: plp.filters.clearAll" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "MC: filterLabels.Show.All.Result.Btn"
      })
    ).toBeInTheDocument();
  });

  it("renders correctly if 'numberOfResults' is greater than 0", () => {
    renderWithProviders(<FilterSection {...props} numberOfResults={10} />);
    fireEvent.click(
      screen.getByRole("button", { name: "MC: plp.filters.title" })
    );
    expect(
      screen.getByRole("button", {
        name: "MC: filterLabels.Show.World.Btn 10 MC: filterLabels.Result.World.Btn"
      })
    ).toBeInTheDocument();
  });
});
