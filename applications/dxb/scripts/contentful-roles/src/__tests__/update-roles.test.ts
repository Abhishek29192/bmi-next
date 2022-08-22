import mockConsole from "jest-mock-console";
import { IMarket, RolesEnum } from "../types";

const getMarketsToRun = jest.fn();
const getUpdateRolesRequestBody = jest.fn();
jest.mock("../configurations", () => {
  const originalModule = jest.requireActual("../configurations");
  return {
    ...originalModule,
    getMarketsToRun: () => getMarketsToRun(),
    getUpdateRolesRequestBody: (
      role: RolesEnum,
      market: IMarket,
      otherMarketsTags: string[]
    ) => getUpdateRolesRequestBody(role, market, otherMarketsTags)
  };
});
const triggerGetAllSpaceRoles = jest.fn();
const triggerUpdateExistingRole = jest.fn();
jest.mock("../requests", () => {
  const originalModule = jest.requireActual("../requests");
  return {
    ...originalModule,
    triggerGetAllSpaceRoles: () => triggerGetAllSpaceRoles(),
    triggerUpdateExistingRole: () => triggerUpdateExistingRole()
  };
});

const consoleSpy = jest.spyOn(console, "info");

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("update roles", () => {
  it("with empty markets array", async () => {
    getMarketsToRun.mockReturnValue([]);
    const main = async () => await import("../update-roles");

    await main();

    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Please provide markets with locales to update roles in the space"
    );
    expect(triggerGetAllSpaceRoles).not.toHaveBeenCalled();
    expect(getUpdateRolesRequestBody).not.toHaveBeenCalled();
    expect(triggerUpdateExistingRole).not.toHaveBeenCalled();
  });
  it("with markets array without existing roles", async () => {
    const market = { name: "uk", locales: ["en-GB"] };
    getMarketsToRun.mockReturnValue([market]);
    const main = async () => await import("../update-roles");

    await main();

    expect(triggerGetAllSpaceRoles).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Don't have any roles for the space - TEST_CONTENTFUL_SPACE_ID"
    );
    expect(getUpdateRolesRequestBody).not.toHaveBeenCalled();
    expect(triggerUpdateExistingRole).not.toHaveBeenCalled();
  });
  it("with markets array and existing another market roles for space", async () => {
    const market = { name: "uk", locales: ["en-GB"] };
    getMarketsToRun.mockReturnValue([market]);
    triggerGetAllSpaceRoles.mockReturnValue({
      items: [{ name: "DXB - finland content publisher" }]
    });
    const main = async () => await import("../update-roles");

    await main();

    expect(triggerGetAllSpaceRoles).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Space - TEST_CONTENTFUL_SPACE_ID - doesn't have publisher role for uk market"
    );
    expect(getUpdateRolesRequestBody).not.toHaveBeenCalled();
    expect(triggerUpdateExistingRole).not.toHaveBeenCalled();
  });
  it("with one market in markets array and existing market roles for space", async () => {
    const market = { name: "uk", locales: ["en-GB"] };
    getMarketsToRun.mockReturnValue([market]);
    triggerGetAllSpaceRoles.mockReturnValue({
      items: [{ name: "DXB - uk content publisher" }]
    });
    const main = async () => await import("../update-roles");

    await main();

    expect(triggerGetAllSpaceRoles).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Getting request body for DXB - uk content publisher role"
    );
    expect(getUpdateRolesRequestBody).toHaveBeenCalledWith(
      RolesEnum.publisher,
      market,
      []
    );
    expect(triggerUpdateExistingRole).toHaveBeenCalled();
  });
  it("with a few markets in markets array and existing market roles for space", async () => {
    const market1 = { name: "uk", locales: ["en-GB"] };
    const market2 = { name: "finland", locales: ["fi-FI"] };
    getMarketsToRun.mockReturnValue([market1, market2]);
    triggerGetAllSpaceRoles.mockReturnValue({
      items: [{ name: "DXB - uk content publisher" }]
    });
    const main = async () => await import("../update-roles");

    await main();

    expect(triggerGetAllSpaceRoles).toHaveBeenCalled();
    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Getting request body for DXB - uk content publisher role"
    );
    expect(getUpdateRolesRequestBody).toHaveBeenCalledWith(
      RolesEnum.publisher,
      market1,
      ["market__finland"]
    );
    expect(triggerUpdateExistingRole).toHaveBeenCalled();
  });
});
