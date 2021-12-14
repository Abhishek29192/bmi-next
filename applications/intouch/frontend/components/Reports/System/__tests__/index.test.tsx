import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import SystemReport from "..";

const mockGetSystemReport = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useGetSystemsReportLazyQuery: () => [mockGetSystemReport]
}));
describe("SystemReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<SystemReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderWithI18NProvider(<SystemReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockGetSystemReport).toHaveBeenCalled();
  });
});
