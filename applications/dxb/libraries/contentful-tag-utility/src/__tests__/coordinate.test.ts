import { Asset, Entry, Environment } from "contentful-management";
import mockConsole from "jest-mock-console";
import {} from "../tag";
import SampleAssetsPage1 from "./resources/assets_page_1.json";
import SampleAssetsPage2 from "./resources/assets_page_2.json";
import SampleAssetsPage3 from "./resources/assets_page_3.json";
import SampleEntriesPage1 from "./resources/entries_page_1.json";
import SampleEntriesPage2 from "./resources/entries_page_2.json";
import SampleEntriesPage3 from "./resources/entries_page_3.json";
import SpaceLocales from "./resources/locales.json";

const tagAndUpdate = async (environment: Partial<Environment>) =>
  (await import("../coordinate")).tagAndUpdate(environment as Environment);

const publishAll = async (environment: Partial<Environment>) =>
  (await import("../coordinate")).publishAll(environment as Environment);

const fillDefaultValues = async (
  environment: Partial<Environment>,
  tag: string,
  marketLocales: string[]
) =>
  (await import("../coordinate")).fillDefaultValues(
    environment as Environment,
    tag,
    marketLocales
  );

const tagEntity = jest.fn();
jest.mock("../tag", () => {
  return { tagEntity };
});

const copyDefaultValues = jest.fn().mockResolvedValue(true);
const findIrrelevantLocales = jest
  .fn()
  .mockResolvedValue(SpaceLocales.items.filter((i) => i.code !== "en-GB"));
jest.mock("../locale", () => {
  return { copyDefaultValues, findIrrelevantLocales };
});

let getEntries: jest.Mock;
let getAssets: jest.Mock;

const update = jest.fn();
const addFunctions = (object: Entry | Asset) => {
  Object.assign(object, { update });
};

SampleEntriesPage1.items.forEach((i) => addFunctions(i as unknown as Entry));
SampleEntriesPage2.items.forEach((i) => addFunctions(i as unknown as Entry));
SampleEntriesPage3.items.forEach((i) => addFunctions(i as unknown as Entry));
SampleAssetsPage1.items.forEach((i) => addFunctions(i as unknown as Entry));
SampleAssetsPage2.items.forEach((i) => addFunctions(i as unknown as Entry));
SampleAssetsPage3.items.forEach((i) => addFunctions(i as unknown as Entry));

const waitProcessing = jest.fn().mockResolvedValue({});
const createPublishBulkAction = jest.fn().mockReturnValue({ waitProcessing });
const getLocales = jest.fn().mockResolvedValue(SpaceLocales);
const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.createTag = jest.fn();
  env.getEntries = getEntries;
  env.getAssets = getAssets;
  env.createPublishBulkAction = createPublishBulkAction;
  env.getLocales = getLocales;
  return env;
};

let apiRateLimit: string | undefined;
let waitDuration: string | undefined;
beforeAll(() => {
  apiRateLimit = process.env.API_RATE_LIMIT;
  // This essentially disables the API rate limiter functionality.
  process.env.API_RATE_LIMIT = "100";

  waitDuration = process.env.WAIT_DURATION_MS;
  process.env.WAIT_DURATION_MS = "1"; // wait for 1 millisecond.
});

afterAll(() => {
  process.env.API_RATE_LIMIT = apiRateLimit;
  process.env.WAIT_DURATION_MS = waitDuration;
});

beforeEach(() => {
  mockConsole();

  getEntries = jest
    .fn()
    .mockReturnValueOnce(SampleEntriesPage1)
    .mockReturnValueOnce(SampleEntriesPage2)
    .mockReturnValueOnce(SampleAssetsPage3)
    .mockReturnValueOnce({
      sys: {
        type: Array
      },
      total: 0,
      skip: 2000,
      limit: 100,
      items: []
    });

  getAssets = jest
    .fn()
    .mockReturnValueOnce(SampleAssetsPage1)
    .mockReturnValueOnce(SampleAssetsPage2)
    .mockReturnValueOnce(SampleAssetsPage3)
    .mockReturnValueOnce({
      sys: {
        type: Array
      },
      total: 0,
      skip: 2000,
      limit: 100,
      items: []
    });
});

describe("tagAndUpdate", () => {
  it("Tries to add a tag to all entries and assets", async () => {
    const environment = mockEnvironment();
    await tagAndUpdate(environment);

    expect(update).toBeCalledTimes(600);
  });
});

describe("publishAll", () => {
  it("Creates bulk publish action", async () => {
    const environment = mockEnvironment();
    await publishAll(environment);

    expect(createPublishBulkAction).toBeCalledTimes(6);
  });
});

describe("fillDefaultValues", () => {
  it("Fills default values", async () => {
    const environment = mockEnvironment();
    const marketLocales = ["en-GB"];
    const tag = "market__uk";
    update.mockResolvedValueOnce({});
    await fillDefaultValues(environment, tag, marketLocales);

    expect(copyDefaultValues).toBeCalledTimes(600);
  });

  it("Throws an error if target locales are not found", async () => {
    const environment = mockEnvironment();
    const marketLocales = ["en-GB"];
    const tag = "market__uk";
    update.mockResolvedValueOnce({});
    findIrrelevantLocales.mockResolvedValueOnce([]);
    try {
      await fillDefaultValues(environment, tag, marketLocales);
    } catch (e) {
      expect((e as Error).message).toEqual("Could not find irrelevant locales");
    }
  });

  it("adds the tag filter to the query", async () => {
    const environment = mockEnvironment();
    const marketLocales = ["en-GB"];
    const tag = "market__uk";
    update.mockResolvedValueOnce({});
    await fillDefaultValues(environment, tag, marketLocales);

    expect(getEntries).toBeCalledWith({
      skip: 0,
      limit: 100,
      order: "sys.createdAt",
      "metadata.tags.sys.id[in]": tag
    });
  });
});
