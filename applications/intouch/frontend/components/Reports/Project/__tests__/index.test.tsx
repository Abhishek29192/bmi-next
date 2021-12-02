import React from "react";
import { renderWithI18NProvider, screen } from "../../../../lib/tests/utils";
import ProjectReport from "..";

const mockProjectReport = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  useGetProjectsReportLazyQuery: () => [mockProjectReport]
}));

describe("ProjectReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderWithI18NProvider(<ProjectReport />);

    expect(container.firstChild).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderWithI18NProvider(<ProjectReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockProjectReport).toHaveBeenCalled();
  });
});
