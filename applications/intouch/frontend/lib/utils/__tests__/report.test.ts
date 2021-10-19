import { exportCsv } from "../report";

const mockGenerateCsv = jest.fn();
jest.mock("export-to-csv", () => {
  return {
    ExportToCsv: jest.fn(() => ({
      generateCsv: mockGenerateCsv
    }))
  };
});
describe("Report utility", () => {
  const mockData = [
    {
      name: "Test 1",
      description: "Test 1 description"
    },
    {
      name: "Test 2",
      description: "Test 2 description"
    }
  ];
  it("exportCsv", () => {
    exportCsv(mockData);
    expect(mockGenerateCsv).toBeCalledTimes(1);
  });
});
