import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
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
    const { container } = renderWithI18NProvider(<CompanyReport />);

    expect(container.firstChild).toMatchSnapshot();
  });

  it("should export button click", () => {
    renderWithI18NProvider(<CompanyReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockgetCompanyReport).toHaveBeenCalled();
  });
});
