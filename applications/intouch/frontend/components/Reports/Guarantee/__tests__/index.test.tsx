import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
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
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN " } })(
      <GuaranteeReport />
    );

    expect(container).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN " } })(<GuaranteeReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockgetGuarantesReport).toHaveBeenCalled();
  });
});
