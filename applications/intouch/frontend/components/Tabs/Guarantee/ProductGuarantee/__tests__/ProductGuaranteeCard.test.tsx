import React, { useRef } from "react";
import { renderWithI18NProvider, screen } from "../../../../../lib/tests/utils";
import { ProjectDetailsProductFragmentFragment } from "../../../../../graphql/generated/operations";
import ProductGuaranteeCard from "../ProductGuaranteeCard";

jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));
describe("ProductGuaranteeCard Component", () => {
  const mockProduct: ProjectDetailsProductFragmentFragment = {
    id: 1,
    name: "product_name",
    family: "famil",
    brand: "brand"
  };
  const guaranteeFileUrl = "http://www.africau.edu/images/default/sample.pdf";

  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(
      <ProductGuaranteeCard product={mockProduct} />
    );

    expect(container).toMatchSnapshot();
  });

  it("should render guarantee pdf download button", () => {
    renderWithI18NProvider(
      <ProductGuaranteeCard
        product={mockProduct}
        guaranteeFileUrl={guaranteeFileUrl}
      />
    );
    expect(screen.getByTestId("guarantee-pdf-item")).toBeVisible();
  });
  it("should not render guarantee pdf download button", () => {
    renderWithI18NProvider(<ProductGuaranteeCard product={mockProduct} />);
    expect(screen.queryByTestId("guarantee-pdf-item")).toHaveTextContent(
      "generatingPdf"
    );
  });
});
