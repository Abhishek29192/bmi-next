import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
import CompanyReport from "..";

const mockgetCompanyReport = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useGetCompaniesReportLazyQuery: () => [mockgetCompanyReport]
}));

describe("CompanyReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN " } })(
      <CompanyReport />
    );

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should export button click", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN " } })(<CompanyReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockgetCompanyReport).toHaveBeenCalled();
  });
});
