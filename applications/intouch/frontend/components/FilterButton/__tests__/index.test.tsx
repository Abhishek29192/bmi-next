import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { FilterButton } from "..";
import "@testing-library/jest-dom/extend-expect";

describe("FilterButton Component", () => {
  it("renders correctly", () => {
    const { container } = render(<FilterButton label="Filter Button" />);

    expect(container).toMatchSnapshot();
  });

  it("run onclick props function correclty", () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <FilterButton label="Filter Button" onClick={onClick} />
    );

    const filterbutton = getByText("Filter Button");
    fireEvent.click(filterbutton);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("show selected chip style if isActive props is true", () => {
    const { container, getByRole } = render(
      <FilterButton label="Filter Button" isActive={true} />
    );
    const filterbutton = getByRole("button");

    expect(container).toMatchSnapshot();
    expect(filterbutton).toHaveClass("Chip--theme-pearl");
  });
});
