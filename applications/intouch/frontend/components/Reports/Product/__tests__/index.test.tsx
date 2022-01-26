import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
import ProductReport from "..";

const mockProductReport = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useGetProductsReportLazyQuery: () => [mockProductReport]
}));

describe("ProductReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN " } })(
      <ProductReport />
    );

    expect(container).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN " } })(<ProductReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockProductReport).toHaveBeenCalled();
  });
});
