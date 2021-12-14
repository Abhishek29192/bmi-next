import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
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
    const { container } = renderWithI18NProvider(<ProductReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderWithI18NProvider(<ProductReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockProductReport).toHaveBeenCalled();
  });
});
