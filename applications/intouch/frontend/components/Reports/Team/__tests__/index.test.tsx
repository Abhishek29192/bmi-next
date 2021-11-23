import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
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
    const { container } = renderWithI18NProvider(<TeamReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderWithI18NProvider(<TeamReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockGetTeamReport).toHaveBeenCalled();
  });
});
