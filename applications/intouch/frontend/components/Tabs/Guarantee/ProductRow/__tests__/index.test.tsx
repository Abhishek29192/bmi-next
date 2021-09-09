import React, { useRef } from "react";
import { render, screen } from "../../../../../lib/tests/utils";
import { ProjectDetailsProductFragmentFragment } from "../../../../../graphql/generated/operations";
import { ProductRow } from "..";

const mockProduct: ProjectDetailsProductFragmentFragment = {
  id: 1,
  name: "BMI-NO-PROD-001",
  family: "Betongtakstein",
  brand: "Zanda"
};

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));
describe("ProductRow Component", () => {
  it("renders correctly", () => {
    const tableBody = document.createElement("tbody");
    const { container } = render(<ProductRow product={mockProduct} />, {
      container: document.body.appendChild(tableBody)
    });

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should render product name", () => {
    const tableBody = document.createElement("tbody");
    render(<ProductRow product={mockProduct} />, {
      container: document.body.appendChild(tableBody)
    });

    expect(screen.getByText("BMI-NO-PROD-001")).toBeInTheDocument();
  });
  it("should render product brand", () => {
    const tableBody = document.createElement("tbody");
    render(<ProductRow product={mockProduct} />, {
      container: document.body.appendChild(tableBody)
    });
    expect(screen.getByText("Zanda")).toBeInTheDocument();
  });
  it("should render product family", () => {
    const tableBody = document.createElement("tbody");
    render(<ProductRow product={mockProduct} />, {
      container: document.body.appendChild(tableBody)
    });
    expect(screen.getByText("Betongtakstein")).toBeInTheDocument();
  });
});
