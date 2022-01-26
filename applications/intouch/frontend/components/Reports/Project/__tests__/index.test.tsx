import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
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
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN " } })(
      <ProjectReport />
    );

    expect(container).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN " } })(<ProjectReport />);

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockProjectReport).toHaveBeenCalled();
  });
});
