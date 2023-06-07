import {
  getMarketsToRun,
  getRolesPermissionsToCreate,
  getRolesPermissionsToUpdate
} from "../configurations";
import { RolesEnum } from "../types";

describe("getRolesPermissionsToCreate", () => {
  it("should return permission configurations for a publisher role if the role is of publisher type", () => {
    const permission = getRolesPermissionsToCreate(
      RolesEnum.publisher,
      { name: "uk", locales: ["en-GB"] },
      ["test"]
    );

    expect(permission).toMatchSnapshot();
  });

  it("should return permission configurations for a editor role if the role is of editor type", () => {
    const permission = getRolesPermissionsToCreate(
      RolesEnum.editor,
      { name: "uk", locales: ["en-GB"] },
      ["test"]
    );
    expect(permission).toMatchSnapshot();
  });
});

describe("getRolesPermissionsToUpdate", () => {
  it("should return an empty object if the role is publisher", () => {
    const permission = getRolesPermissionsToUpdate(
      RolesEnum.publisher,
      { name: "uk", locales: ["en-GB"] },
      ["someMarketTag"]
    );

    expect(permission).toEqual({});
  });

  it("should return an empty object if the role is editor", () => {
    const permission = getRolesPermissionsToUpdate(
      RolesEnum.editor,
      { name: "uk", locales: ["en-GB"] },
      ["someMarketTag"]
    );

    expect(permission).toEqual({});
  });
});

describe("getMarketsToRun", () => {
  it("should return an empty array", () => {
    const markets = getMarketsToRun();

    expect(markets).toEqual([]);
  });
});
