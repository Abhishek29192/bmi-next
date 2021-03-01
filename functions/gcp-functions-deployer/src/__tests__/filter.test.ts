import fs from "fs";
import path from "path";
import mockConsole from "jest-mock-console";

const resourcesBasePath = `${path.resolve(__dirname)}/resources`;

beforeAll(() => {
  mockConsole();
});

let filterFunctionMetadata;

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  const filter = require("../filter");
  filterFunctionMetadata = filter.filterFunctionMetadata;
});

describe("When called with null content", () => {
  it("Returns null", async () => {
    var value = await filterFunctionMetadata(null, "somefile.zip");
    expect(value).toBe(null);
  });
});

describe("When called with valid content and source matches", () => {
  var buffer = fs.readFileSync(`${resourcesBasePath}/market1_metadata.json`);
  var jsonObject = JSON.parse(
    fs.readFileSync(
      `${resourcesBasePath}/market1_function1_metadata.json`,
      "utf8"
    )
  );
  it("returns content back", async () => {
    var value = await filterFunctionMetadata(
      [buffer],
      "sources/somefunction1.zip"
    );

    expect(value).toStrictEqual(jsonObject);
  });
});

describe("When called with valid content and source does not match", () => {
  var buffer = fs.readFileSync(`${resourcesBasePath}/market1_metadata.json`);
  it("returns null", async () => {
    var value = await filterFunctionMetadata([buffer], "sources/unmatched.zip");

    expect(value).toBe(null);
  });
});
