import { getProjectStatus } from "../project";

describe("getProjectStatus utility", () => {
  it("returns status NOT STARTED correctly", () => {
    Date.now = jest.fn(() => Date.parse("2020-01-01"));
    const status = getProjectStatus("02/01/2020", "01/02/2020");
    expect(status).toMatchSnapshot();
  });

  it("returns status IN PROGRESS correctly", () => {
    Date.now = jest.fn(() => Date.parse("2020-01-01"));
    const status = getProjectStatus("01/01/2019", "01/02/2020");
    expect(status).toMatchSnapshot();
  });

  it("returns status COMPLETED correctly", () => {
    Date.now = jest.fn(() => Date.parse("2020-01-01"));
    const status = getProjectStatus("01/01/2019", "01/02/2019");
    expect(status).toMatchSnapshot();
  });
});
