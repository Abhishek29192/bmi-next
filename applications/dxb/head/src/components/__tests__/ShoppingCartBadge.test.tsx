import React from "react";
import { render } from "@testing-library/react";
import ShoppingCartBadge from "../ShoppingCartBadge";

describe("ShoppingCartShoppingCartBadge component", () => {
  it("renders correctly", () => {
    const { container } = render(<ShoppingCartBadge badgeCount={8} />);
    expect(container).toMatchSnapshot();
  });
  it("renders correctly with count more then 99", () => {
    const { container } = render(<ShoppingCartBadge badgeCount={101} />);
    expect(
      container.getElementsByClassName("MuiBadge-badge")[0]
    ).toHaveTextContent("99+");
    expect(container).toMatchSnapshot();
  });
});
