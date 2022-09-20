import mockConsole from "jest-mock-console";
import { IMarket, RolesEnum } from "../types";

const getMarketsToRun = jest.fn();
const getRolesPermissionsToCreate = jest.fn();
jest.mock("../configurations", () => {
  const originalModule = jest.requireActual("../configurations");
  return {
    ...originalModule,
    getMarketsToRun: () => getMarketsToRun(),
    getRolesPermissionsToCreate: (
      role: RolesEnum,
      market: IMarket,
      otherMarketsTags: string[]
    ) => getRolesPermissionsToCreate(role, market, otherMarketsTags)
  };
});
const createRoles = jest.fn();
jest.mock("../requests", () => {
  const originalModule = jest.requireActual("../requests");
  return {
    ...originalModule,
    createRoles: () => createRoles()
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

describe("create roles", () => {
  it("with empty markets array", async () => {
    getMarketsToRun.mockReturnValue([]);
    const main = async () => await import("../create-roles");

    await main();

    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Please provide markets with locales to create roles in the space"
    );
    expect(getRolesPermissionsToCreate).not.toHaveBeenCalled();
    expect(createRoles).not.toHaveBeenCalled();
  });
  it("with one market in markets array", async () => {
    const market = { name: "uk", locales: ["en-GB"] };
    getMarketsToRun.mockReturnValue([market]);
    const main = async () => await import("../create-roles");

    await main();

    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Triggering create roles for uk"
    );
    expect(getRolesPermissionsToCreate).toHaveBeenNthCalledWith(
      1,
      RolesEnum.publisher,
      market,
      []
    );
    expect(getRolesPermissionsToCreate).toHaveBeenNthCalledWith(
      2,
      RolesEnum.editor,
      market,
      []
    );
    expect(createRoles).toHaveBeenCalledTimes(2);
  });
  it("with two markets in markets array", async () => {
    const market1 = { name: "uk", locales: ["en-GB"] };
    const market2 = { name: "finland", locales: ["fi-FI"] };
    getMarketsToRun.mockReturnValue([market1, market2]);
    const main = async () => await import("../create-roles");

    await main();

    expect(consoleSpy.mock.calls[0][0]).toEqual(
      "Triggering create roles for uk"
    );
    expect(getRolesPermissionsToCreate).toHaveBeenNthCalledWith(
      1,
      RolesEnum.publisher,
      market1,
      ["market__finland"]
    );
    expect(getRolesPermissionsToCreate).toHaveBeenNthCalledWith(
      2,
      RolesEnum.publisher,
      market2,
      ["market__uk"]
    );
    expect(getRolesPermissionsToCreate).toHaveBeenNthCalledWith(
      3,
      RolesEnum.editor,
      market1,
      ["market__finland"]
    );
    expect(getRolesPermissionsToCreate).toHaveBeenNthCalledWith(
      4,
      RolesEnum.editor,
      market2,
      ["market__uk"]
    );
    expect(createRoles).toHaveBeenCalledTimes(4);
  });
});
