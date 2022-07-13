import React from "react";
import dayjs from "dayjs";
import { renderAsReal, screen, fireEvent } from "../../../../lib/tests/utils";
import UploadReport from "..";
import { evidenceItemFactory } from "../../../../lib/tests/factories/evidenceItem";

const mockProjectReport = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useGetEvidenceItemsReportLazyQuery: ({ onCompleted }) => {
    return [() => mockProjectReport({ onCompleted })];
  }
}));

const exportCsvSpy = jest.fn();
jest.mock("../../../../lib/utils/report", () => ({
  exportCsv: (...options) => exportCsvSpy(...options)
}));

describe("Upload Report", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const evidenceItems = { nodes: [evidenceItemFactory()] };
    const data = {
      "Project Name": evidenceItems.nodes[0].project.name,
      "Company Name": evidenceItems.nodes[0].project.company.name,
      "Company Tier": evidenceItems.nodes[0].project.company.tier,
      "Upload Type": evidenceItems.nodes[0].evidenceCategoryType,
      "File Type": "JPG",
      "File Name": "evidence-item",
      "Project Roof area(m2)": evidenceItems.nodes[0].project.roofArea,
      "Guarantee Type": evidenceItems.nodes[0].guarantee.coverage,
      "User Name": `${evidenceItems.nodes[0].uploaderAccount.firstName} ${evidenceItems.nodes[0].uploaderAccount.lastName}`,
      "User Email": evidenceItems.nodes[0].uploaderAccount.email,
      "Upload Date": dayjs(evidenceItems.nodes[0].createdAt).format(
        "YYYY-MM-DD HH:mm:ss"
      )
    };
    mockProjectReport.mockImplementationOnce(({ onCompleted }) =>
      onCompleted({ evidenceItemsByMarket: evidenceItems })
    );
    renderAsReal({ account: { role: "SUPER_ADMIN" } })(<UploadReport />);

    const button = screen.queryByText("report.projectUpload");
    fireEvent.click(button);

    expect(mockProjectReport).toHaveBeenCalledTimes(1);
    expect(exportCsvSpy).toHaveBeenCalledWith([data], {
      filename: expect.stringContaining(`project-uploads-`),
      title: "Project Uploads"
    });
  });

  describe("exceptional case", () => {
    const defaultEvidenceItem = evidenceItemFactory();

    it("uploaderAccount is missing", () => {
      const evidenceItems = {
        nodes: [
          {
            ...defaultEvidenceItem,
            uploaderAccount: null
          }
        ]
      };
      mockProjectReport.mockImplementationOnce(({ onCompleted }) =>
        onCompleted({ evidenceItemsByMarket: evidenceItems })
      );
      renderAsReal({ account: { role: "SUPER_ADMIN" } })(<UploadReport />);

      const button = screen.queryByText("report.projectUpload");
      fireEvent.click(button);

      expect(exportCsvSpy.mock.calls[0][0][0]["User Name"]).toBe("");
      expect(exportCsvSpy.mock.calls[0][0][0]["User Email"]).toBe("");
    });

    it("uploaderAccount firstName is missing", () => {
      const evidenceItems = {
        nodes: [
          {
            ...defaultEvidenceItem,
            uploaderAccount: {
              ...defaultEvidenceItem.uploaderAccount,
              firstName: null
            }
          }
        ]
      };
      mockProjectReport.mockImplementationOnce(({ onCompleted }) =>
        onCompleted({ evidenceItemsByMarket: evidenceItems })
      );
      renderAsReal({ account: { role: "SUPER_ADMIN" } })(<UploadReport />);

      const button = screen.queryByText("report.projectUpload");
      fireEvent.click(button);

      expect(exportCsvSpy.mock.calls[0][0][0]["User Name"]).toBe("");
    });

    it("uploaderAccount lastName is missing", () => {
      const evidenceItems = {
        nodes: [
          {
            ...defaultEvidenceItem,
            uploaderAccount: {
              ...defaultEvidenceItem.uploaderAccount,
              lastName: null
            }
          }
        ]
      };
      mockProjectReport.mockImplementationOnce(({ onCompleted }) =>
        onCompleted({ evidenceItemsByMarket: evidenceItems })
      );
      renderAsReal({ account: { role: "SUPER_ADMIN" } })(<UploadReport />);

      const button = screen.queryByText("report.projectUpload");
      fireEvent.click(button);

      expect(exportCsvSpy.mock.calls[0][0][0]["User Name"]).toBe("");
    });

    it("guarantee is missing", () => {
      const evidenceItems = {
        nodes: [
          {
            ...defaultEvidenceItem,
            guarantee: null
          }
        ]
      };
      mockProjectReport.mockImplementationOnce(({ onCompleted }) =>
        onCompleted({ evidenceItemsByMarket: evidenceItems })
      );
      renderAsReal({ account: { role: "SUPER_ADMIN" } })(<UploadReport />);

      const button = screen.queryByText("report.projectUpload");
      fireEvent.click(button);

      expect(exportCsvSpy.mock.calls[0][0][0]["Guarantee Type"]).toBe(
        "NOT REQUESTED"
      );
    });
  });
});
