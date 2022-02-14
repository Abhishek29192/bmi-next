/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "fs";
import path from "path";
import mockConsole from "jest-mock-console";
import { filterFunctionMetadata } from "../filter";

jest.mock("@bmi-digital/functions-logger");

const resourcesBasePath = `${path.resolve(__dirname)}/resources`;

beforeAll(() => {
  mockConsole();
});

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("When called with empty content", () => {
  it("Returns null", async () => {
    const value = filterFunctionMetadata([Buffer.of()], "somefile.zip");
    expect(value).toBe(null);
  });
});

describe("When called with valid content and source matches only one function", () => {
  const buffer = fs.readFileSync(`${resourcesBasePath}/market1_metadata.json`);
  const jsonObject = JSON.parse(
    fs.readFileSync(
      `${resourcesBasePath}/market1_function1_metadata.json`,
      "utf8"
    )
  );
  it("returns content back", async () => {
    const value = filterFunctionMetadata([buffer], "sources/somefunction1.zip");

    expect(value).toHaveLength(1);
    expect(value![0]).toStrictEqual(jsonObject);
  });
});

describe("When called with valid content and source does not match", () => {
  const buffer = fs.readFileSync(`${resourcesBasePath}/market1_metadata.json`);
  it("returns null", async () => {
    const value = filterFunctionMetadata([buffer], "sources/unmatched.zip");

    expect(value).toBe(null);
  });
});

describe("When called with valid content and source matches multiple functions", () => {
  const buffer = fs.readFileSync(`${resourcesBasePath}/market1_metadata.json`);
  const jsonObjectFunc1 = JSON.parse(
    fs.readFileSync(
      `${resourcesBasePath}/market1_function2_metadata.json`,
      "utf8"
    )
  );
  const jsonObjectFunc2 = JSON.parse(
    fs.readFileSync(
      `${resourcesBasePath}/market1_function3_metadata.json`,
      "utf8"
    )
  );
  it("returns content back", async () => {
    const values = filterFunctionMetadata([buffer], "sources/upload.zip");

    expect(values).toHaveLength(2);
    expect(values![0]).toStrictEqual(jsonObjectFunc1);
    expect(values![1]).toStrictEqual(jsonObjectFunc2);
  });
});
