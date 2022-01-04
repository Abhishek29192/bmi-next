import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
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
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN " } })(
      <SystemReport />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN " } })(<SystemReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockGetSystemReport).toHaveBeenCalled();
  });
});
