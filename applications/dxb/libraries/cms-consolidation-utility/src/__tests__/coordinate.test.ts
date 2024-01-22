import createSampleEntry from "./helpers/entryHelper";
import sampleAsset from "./resources/sample_asset";
import type { Environment } from "contentful-management";

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
const findIrrelevantLocales = jest.fn();
jest.mock("../locale", () => {
  return { copyDefaultValues, findIrrelevantLocales };
});

const getEntries = jest.fn();
const getAssets = jest.fn();

const update = jest.fn();

const createEntry = () => {
  const entry = createSampleEntry();
  Object.assign(entry, { update });
  return entry;
};

const createAsset = () => {
  const entry = sampleAsset;
  Object.assign(entry, { update });
  return entry;
};

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
  jest.clearAllMocks();
  jest.resetModules();
});

describe("tagAndUpdate", () => {
  it("Tries to add a tag to all entries and assets", async () => {
    getEntries
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 0,
        limit: 2,
        items: [createEntry(), createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 2,
        limit: 2,
        items: [createEntry(), createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 4,
        limit: 2,
        items: []
      });
    getAssets
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 0,
        limit: 2,
        items: [createAsset(), createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 2,
        limit: 2,
        items: [createAsset(), createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 4,
        limit: 2,
        items: []
      });

    const environment = mockEnvironment();
    await tagAndUpdate(environment);

    expect(getEntries).toHaveBeenCalledTimes(3);
    expect(getEntries).toHaveBeenNthCalledWith(1, {
      limit: 100,
      order: "sys.createdAt",
      skip: 0,
      "sys.archivedVersion[exists]": false
    });
    expect(getEntries).toHaveBeenNthCalledWith(2, {
      limit: 100,
      order: "sys.createdAt",
      skip: 2,
      "sys.archivedVersion[exists]": false
    });
    expect(getEntries).toHaveBeenNthCalledWith(3, {
      limit: 100,
      order: "sys.createdAt",
      skip: 4,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenCalledTimes(3);
    expect(getAssets).toHaveBeenNthCalledWith(1, {
      limit: 100,
      order: "sys.createdAt",
      skip: 0,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenNthCalledWith(2, {
      limit: 100,
      order: "sys.createdAt",
      skip: 2,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenNthCalledWith(3, {
      limit: 100,
      order: "sys.createdAt",
      skip: 4,
      "sys.archivedVersion[exists]": false
    });
    expect(update).toHaveBeenCalledTimes(8);
  });

  it("handles API request limits", async () => {
    const originalApiRateLimit = process.env.API_RATE_LIMIT;
    const originalWaitDurationMs = process.env.WAIT_DURATION_MS;
    process.env.API_RATE_LIMIT = "7";
    process.env.WAIT_DURATION_MS = "1500";
    getEntries
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 0,
        limit: 8,
        items: [
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry()
        ]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 8,
        limit: 8,
        items: []
      });
    getAssets
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 0,
        limit: 8,
        items: [
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset()
        ]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 8,
        limit: 8,
        items: []
      });

    const start = new Date().getTime();
    const environment = mockEnvironment();
    await tagAndUpdate(environment);
    const diff = new Date().getTime() - start;

    expect(diff).toBeGreaterThan(3000);
    expect(getEntries).toHaveBeenCalled();
    expect(getAssets).toHaveBeenCalled();
    expect(update).toHaveBeenCalledTimes(16);

    process.env.API_RATE_LIMIT = originalApiRateLimit;
    process.env.WAIT_DURATION_MS = originalWaitDurationMs;
  });
});

describe("publishAll", () => {
  it("Creates bulk publish action", async () => {
    getEntries
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 0,
        limit: 2,
        items: [createEntry(), createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 2,
        limit: 2,
        items: [createEntry(), createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 4,
        limit: 2,
        items: []
      });
    getAssets
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 0,
        limit: 2,
        items: [createAsset(), createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 2,
        limit: 2,
        items: [createAsset(), createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 4,
        limit: 2,
        items: []
      });

    const environment = mockEnvironment();
    await publishAll(environment);

    expect(getEntries).toHaveBeenCalledTimes(3);
    expect(getEntries).toHaveBeenNthCalledWith(1, {
      limit: 200,
      order: "sys.createdAt",
      skip: 0,
      "sys.archivedVersion[exists]": false
    });
    expect(getEntries).toHaveBeenNthCalledWith(2, {
      limit: 200,
      order: "sys.createdAt",
      skip: 2,
      "sys.archivedVersion[exists]": false
    });
    expect(getEntries).toHaveBeenNthCalledWith(3, {
      limit: 200,
      order: "sys.createdAt",
      skip: 4,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenCalledTimes(3);
    expect(getAssets).toHaveBeenNthCalledWith(1, {
      limit: 200,
      order: "sys.createdAt",
      skip: 0,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenNthCalledWith(2, {
      limit: 200,
      order: "sys.createdAt",
      skip: 2,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenNthCalledWith(3, {
      limit: 200,
      order: "sys.createdAt",
      skip: 4,
      "sys.archivedVersion[exists]": false
    });
    expect(createPublishBulkAction).toHaveBeenCalledTimes(4);
  });

  it("only runs 5 bulk publish actions at a time", async () => {
    const originalWaitDurationMs = process.env.WAIT_DURATION_MS;
    process.env.WAIT_DURATION_MS = "1500";

    getEntries
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 0,
        limit: 1,
        items: [createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 1,
        limit: 1,
        items: [createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 2,
        limit: 1,
        items: [createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 3,
        limit: 1,
        items: [createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 4,
        limit: 1,
        items: [createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 5,
        limit: 1,
        items: [createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 6,
        limit: 1,
        items: []
      });
    getAssets
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 0,
        limit: 1,
        items: [createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 1,
        limit: 1,
        items: [createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 2,
        limit: 1,
        items: [createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 3,
        limit: 1,
        items: [createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 4,
        limit: 1,
        items: [createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 5,
        limit: 1,
        items: [createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 6,
        skip: 6,
        limit: 1,
        items: []
      });

    const start = new Date().getTime();
    const environment = mockEnvironment();
    await publishAll(environment);
    const diff = new Date().getTime() - start;

    expect(diff).toBeGreaterThan(2000);
    expect(getEntries).toHaveBeenCalled();
    expect(getAssets).toHaveBeenCalled();
    expect(createPublishBulkAction).toHaveBeenCalledTimes(12);

    process.env.WAIT_DURATION_MS = originalWaitDurationMs;
  });
});

describe("fillDefaultValues", () => {
  it("Fills default values", async () => {
    findIrrelevantLocales.mockResolvedValueOnce(["fi-FI"]);
    getEntries
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 0,
        limit: 2,
        items: [createEntry(), createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 2,
        limit: 2,
        items: [createEntry(), createEntry()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 4,
        limit: 2,
        items: []
      });
    getAssets
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 0,
        limit: 2,
        items: [createAsset(), createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 2,
        limit: 2,
        items: [createAsset(), createAsset()]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 4,
        skip: 4,
        limit: 2,
        items: []
      });
    update.mockResolvedValueOnce({});

    const environment = mockEnvironment();
    const marketLocales = ["en-GB"];
    const tag = "market__uk";

    await fillDefaultValues(environment, tag, marketLocales);

    expect(findIrrelevantLocales).toHaveBeenCalledWith(
      environment,
      marketLocales
    );
    expect(getEntries).toHaveBeenCalledTimes(3);
    expect(getEntries).toHaveBeenNthCalledWith(1, {
      limit: 100,
      "metadata.tags.sys.id[in]": tag,
      order: "sys.createdAt",
      skip: 0,
      "sys.archivedVersion[exists]": false
    });
    expect(getEntries).toHaveBeenNthCalledWith(2, {
      limit: 100,
      "metadata.tags.sys.id[in]": tag,
      order: "sys.createdAt",
      skip: 2,
      "sys.archivedVersion[exists]": false
    });
    expect(getEntries).toHaveBeenNthCalledWith(3, {
      limit: 100,
      "metadata.tags.sys.id[in]": tag,
      order: "sys.createdAt",
      skip: 4,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenCalledTimes(3);
    expect(getAssets).toHaveBeenNthCalledWith(1, {
      limit: 100,
      "metadata.tags.sys.id[in]": tag,
      order: "sys.createdAt",
      skip: 0,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenNthCalledWith(2, {
      limit: 100,
      "metadata.tags.sys.id[in]": tag,
      order: "sys.createdAt",
      skip: 2,
      "sys.archivedVersion[exists]": false
    });
    expect(getAssets).toHaveBeenNthCalledWith(3, {
      limit: 100,
      "metadata.tags.sys.id[in]": tag,
      order: "sys.createdAt",
      skip: 4,
      "sys.archivedVersion[exists]": false
    });
    expect(copyDefaultValues).toHaveBeenCalledTimes(8);
  });

  it("handles API request limits", async () => {
    const originalApiRateLimit = process.env.API_RATE_LIMIT;
    const originalWaitDurationMs = process.env.WAIT_DURATION_MS;
    process.env.API_RATE_LIMIT = "7";
    process.env.WAIT_DURATION_MS = "1500";

    findIrrelevantLocales.mockResolvedValueOnce(["fi-FI"]);
    getEntries
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 0,
        limit: 8,
        items: [
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry(),
          createEntry()
        ]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 8,
        limit: 8,
        items: []
      });
    getAssets
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 0,
        limit: 8,
        items: [
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset(),
          createAsset()
        ]
      })
      .mockReturnValueOnce({
        sys: {
          type: Array
        },
        total: 8,
        skip: 8,
        limit: 8,
        items: []
      });
    update.mockResolvedValueOnce({});

    const environment = mockEnvironment();
    const marketLocales = ["en-GB"];
    const tag = "market__uk";

    const start = new Date().getTime();
    await fillDefaultValues(environment, tag, marketLocales);
    const diff = new Date().getTime() - start;

    expect(diff).toBeGreaterThan(3000);
    expect(findIrrelevantLocales).toHaveBeenCalled();
    expect(getEntries).toHaveBeenCalled();
    expect(getAssets).toHaveBeenCalled();
    expect(copyDefaultValues).toHaveBeenCalledTimes(16);

    process.env.API_RATE_LIMIT = originalApiRateLimit;
    process.env.WAIT_DURATION_MS = originalWaitDurationMs;
  });

  it("Throws an error if target locales are not found", async () => {
    findIrrelevantLocales.mockResolvedValueOnce([]);
    const environment = mockEnvironment();
    const marketLocales = ["en-GB"];
    const tag = "market__uk";

    try {
      await fillDefaultValues(environment, tag, marketLocales);
    } catch (e) {
      expect((e as Error).message).toEqual("Could not find irrelevant locales");
    }

    expect(findIrrelevantLocales).toHaveBeenCalledWith(
      environment,
      marketLocales
    );
    expect(getEntries).not.toHaveBeenCalled();
    expect(getAssets).not.toHaveBeenCalled();
  });
});
