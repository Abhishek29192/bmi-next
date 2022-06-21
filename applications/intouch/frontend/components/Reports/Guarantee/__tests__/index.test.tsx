import React from "react";
import { renderAsReal, screen } from "../../../../lib/tests/utils";
import GuaranteeReport from "..";

const mockGetGuaranteesReport = jest.fn();
const mockOnCompleted = jest.fn();
jest.mock("../../../../graphql/generated/hooks", () => ({
  __esModule: true,
  useGetGuaranteesReportLazyQuery: ({ onCompleted }) => {
    mockOnCompleted.mockImplementation((data) => onCompleted(data));
    return [mockGetGuaranteesReport, { loading: false }];
  }
}));

const exportCsvSpy = jest.fn();
jest.mock("../../../../lib/utils/report", () => ({
  exportCsv: () => exportCsvSpy()
}));

const defaultGuarantee = {
  id: 1,
  guaranteeReferenceCode: "PITCHED_SOLUTION",
  coverage: "SOLUTION",
  status: "NEW",
  guaranteeType: {
    sys: {
      id: "sys_id"
    },
    name: "Test"
  },
  project: {
    name: "test",
    company: {
      name: "Company 1"
    }
  },
  productByProductBmiRef: {
    name: "productTest"
  },
  systemBySystemBmiRef: {
    name: "systemTest"
  },
  requestorAccount: {
    firstName: "firstName",
    lastName: "lastName"
  }
};

const defaultGuarantee2 = {
  id: 1,
  guaranteeReferenceCode: "PITCHED_SOLUTION",
  coverage: "SOLUTION",
  status: "NEW",
  project: {
    name: "test",
    company: {
      name: "Company 1"
    }
  }
};

const guarantees = [defaultGuarantee, defaultGuarantee2];

describe("GuaranteeReport Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it("renders correctly", () => {
    const { container } = renderAsReal({ account: { role: "SUPER_ADMIN" } })(
      <GuaranteeReport />
    );

    expect(container).toMatchSnapshot();
  });
  it("should export button click", () => {
    renderAsReal({ account: { role: "SUPER_ADMIN" } })(<GuaranteeReport />);

    mockGetGuaranteesReport.mockReturnValueOnce(
      mockOnCompleted({ guaranteesByMarket: { nodes: guarantees } })
    );

    const exportButton = screen.getByTestId("export-button");
    exportButton.click();

    expect(mockGetGuaranteesReport).toHaveBeenCalled();
    expect(exportCsvSpy).toHaveBeenCalled();
  });
});
