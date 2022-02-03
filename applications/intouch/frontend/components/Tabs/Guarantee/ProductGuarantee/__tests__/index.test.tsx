import React, { useRef } from "react";
import { renderWithI18NProvider } from "../../../../../lib/tests/utils";
import { GetProjectQuery } from "../../../../../graphql/generated/operations";
import { ProductGuarantee } from "..";

const mockProduct = {
  id: 1,
  name: "Product",
  brand: "brand",
  family: "family",
  description: "description"
};
jest.mock("@bmi/use-dimensions", () => ({
  __esModule: true,
  default: () => [useRef(), jest.fn()]
}));
describe("ProductGuarantee Component", () => {
  it("renders correctly", () => {
    const mockProductGuarantees: GetProjectQuery["project"]["guarantees"]["nodes"] =
      [
        {
          id: 1,
          guaranteeReferenceCode: "FLAT_PRODUCT",
          coverage: "PRODUCT",
          status: "APPROVED",
          productByProductBmiRef: mockProduct
        }
      ];

    const { container } = renderWithI18NProvider(
      <ProductGuarantee guarantees={mockProductGuarantees} />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders correctly when pdf available", () => {
    const mockProductGuarantees: GetProjectQuery["project"]["guarantees"]["nodes"] =
      [
        {
          id: 1,
          guaranteeReferenceCode: "FLAT_PRODUCT",
          coverage: "PRODUCT",
          status: "APPROVED",
          productByProductBmiRef: mockProduct
        }
      ];

    const { container } = renderWithI18NProvider(
      <ProductGuarantee guarantees={mockProductGuarantees} />
    );

    expect(container).toMatchSnapshot();
  });

  it("renders multiple guarantee", () => {
    const mockProductGuarantees: GetProjectQuery["project"]["guarantees"]["nodes"] =
      [
        {
          id: 1,
          guaranteeReferenceCode: "FLAT_PRODUCT",
          coverage: "PRODUCT",
          status: "APPROVED",
          productByProductBmiRef: mockProduct
        },
        {
          id: 2,
          guaranteeReferenceCode: "PITCHED_PRODUCT",
          coverage: "PRODUCT",
          status: "APPROVED",
          productByProductBmiRef: mockProduct
        }
      ];

    const { container } = renderWithI18NProvider(
      <ProductGuarantee guarantees={mockProductGuarantees} />
    );

    expect(container).toMatchSnapshot();
  });
});
