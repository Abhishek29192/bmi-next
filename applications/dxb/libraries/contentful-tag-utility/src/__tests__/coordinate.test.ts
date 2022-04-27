import { Environment, Entry, Asset } from "contentful-management";
import {} from "../tag";
import mockConsole from "jest-mock-console";
import SampleEntriesPage1 from "./resources/entries_page_1.json";
import SampleEntriesPage2 from "./resources/entries_page_2.json";
import SampleEntriesPage3 from "./resources/entries_page_3.json";
import SampleAssetsPage1 from "./resources/assets_page_1.json";
import SampleAssetsPage2 from "./resources/assets_page_2.json";
import SampleAssetsPage3 from "./resources/assets_page_3.json";

const tagAndUpdate = async (environment: Partial<Environment>) =>
  (await import("../coordinate")).TagAndUpdate(environment as Environment);

const publishAll = async (environment: Partial<Environment>) =>
  (await import("../coordinate")).PublishAll(environment as Environment);

const tagEntity = jest.fn();
jest.mock("../tag", () => {
  return { TagEntity: tagEntity };
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
const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.createTag = jest.fn();
  env.getEntries = getEntries;
  env.getAssets = getAssets;
  env.createPublishBulkAction = createPublishBulkAction;
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

describe("TagAndUpdate", () => {
  it("Tries to add a tag to all entries and assets", async () => {
    const environment = mockEnvironment();
    await tagAndUpdate(environment);

    expect(update).toBeCalledTimes(600);
  });
});

describe("PublishAll", () => {
  it("Creates bulk publish action", async () => {
    const environment = mockEnvironment();
    await publishAll(environment);

    expect(createPublishBulkAction).toBeCalledTimes(6);
  });
});
