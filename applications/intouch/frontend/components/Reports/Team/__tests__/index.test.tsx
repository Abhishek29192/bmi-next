import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
import TeamReport from "..";

const mockGetTeamReport = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useGetTeamsReportLazyQuery: () => [mockGetTeamReport]
}));

describe("TeamReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN " } })(
      <TeamReport />
    );

    expect(container.firstChild).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN " } })(<TeamReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockGetTeamReport).toHaveBeenCalled();
  });
});
