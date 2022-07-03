import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
import ProjectReport from "..";
import { generateProject } from "../../../../lib/tests/factories/project";
import { GetProjectQuery } from "../../../../graphql/generated/operations";
import { projectMembers } from "../../../../fixtures/projectMembers";

const mockProjectReport = jest.fn();
const mockOnCompleted = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useGetProjectsReportLazyQuery: ({ onCompleted }) => {
    mockOnCompleted.mockImplementation((data) => onCompleted(data));
    return [mockProjectReport, { loading: false }];
  }
}));

const exportCsvSpy = jest.fn();
jest.mock("../../../../lib/utils/report", () => ({
  exportCsv: () => exportCsvSpy()
}));

const emptyNodes = {
  nodes: []
};
const defaultGuarantee: GetProjectQuery["project"]["guarantees"]["nodes"][0] = {
  id: 1,
  guaranteeReferenceCode: "PITCHED_SOLUTION",
  coverage: "SOLUTION",
  status: "NEW",
  guaranteeType: {
    sys: {
      id: "sys_id"
    },
    name: "Test"
  }
};
const defaultProject: GetProjectQuery["project"] = {
  __typename: "Project",
  id: 1,
  evidenceItems: emptyNodes,
  name: "Project",
  notes: emptyNodes,
  projectMembers: {
    nodes: projectMembers
  },
  roofArea: 0,
  technology: "PITCHED",
  guarantees: {
    nodes: [defaultGuarantee]
  },
  company: {
    id: 1,
    tier: "T1",
    name: "test"
  },
  siteAddress: {
    id: 1,
    country: "UK",
    postcode: "12345",
    town: "test"
  },
  buildingOwnerMail: "buildingOwnerMail",
  buildingOwnerFirstname: "buildingOwnerFirstname",
  buildingOwnerLastname: "",
  buildingOwnerAddress: {
    id: 1
  },
  startDate: "12/12/2021",
  endDate: "12/12/2022"
};

const project2 = generateProject({
  siteAddress: null,
  company: null,
  guarantees: null,
  buildingOwnerFirstname: null
});
const projects = [defaultProject, project2];

describe("ProjectReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN" } })(
      <ProjectReport />
    );

    expect(container).toMatchSnapshot();
  });
  it("should export button click as SUPER_ADMIN", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN" } })(<ProjectReport />);

    mockProjectReport.mockReturnValueOnce(
      mockOnCompleted({ projectsByMarket: { nodes: projects } })
    );

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockProjectReport).toHaveBeenCalled();
    expect(exportCsvSpy).toHaveBeenCalled();
  });

  it("should export button click as COMPANY_ADMIN", () => {
    renderAsReal({ account: { role: "COMPANY_ADMIN" } })(<ProjectReport />);

    mockProjectReport.mockReturnValueOnce(
      mockOnCompleted({ projectsByMarket: { nodes: projects } })
    );

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockProjectReport).toHaveBeenCalled();
    expect(exportCsvSpy).toHaveBeenCalled();
  });
});
