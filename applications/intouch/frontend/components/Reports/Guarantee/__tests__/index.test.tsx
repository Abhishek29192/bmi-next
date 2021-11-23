import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import GuaranteeReport from "..";

const mockgetGuarantesReport = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useGetGuaranteesReportLazyQuery: () => [mockgetGuarantesReport]
}));

describe("GuaranteeReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<GuaranteeReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderWithI18NProvider(<GuaranteeReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockgetGuarantesReport).toHaveBeenCalled();
  });
});
