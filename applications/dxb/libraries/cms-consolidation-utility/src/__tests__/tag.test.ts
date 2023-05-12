import createEntry from "./helpers/entryHelper";
import type { Entry, Environment, Link } from "contentful-management";

const createTag = async (environment: Partial<Environment>, market: string) =>
  (await import("../tag")).createTag(environment as Environment, market);

const tagEntity = async (entry: Partial<Entry>, market: string) =>
  await (await import("../tag")).tagEntity(entry as Entry, market);

const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.createTag = jest.fn();
  return env;
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
});

describe("createTag", () => {
  it("Creates a tag if it does not exist", async () => {
    const environment = mockEnvironment();
    const errorMessage = { status: 404 };
    environment.getTag = jest
      .fn()
      .mockRejectedValueOnce({ message: JSON.stringify(errorMessage) });
    const market = "Norway";
    const tagId = "market__norway";

    await createTag(environment, market);

    expect(environment.createTag).toBeCalledWith(tagId, market, "public");
  });

  it("Logs a warning if tag already exists", async () => {
    const environment = mockEnvironment();
    environment.getTag = jest.fn().mockReturnValueOnce(Promise.resolve());
    const market = "Norway";
    const tagId = "market__norway";

    await createTag(environment, market);

    expect(console.warn).toBeCalledWith(
      `Tag with the ID: ${tagId} already exists.`
    );
  });

  it("Logs an error if the API error response is not recognised", async () => {
    const environment = mockEnvironment();
    const errorMessage = { status: 500 };
    environment.getTag = jest
      .fn()
      .mockRejectedValueOnce(new Error(JSON.stringify(errorMessage)));
    const market = "Norway";

    await createTag(environment, market);

    expect(console.error).toBeCalledWith(
      `Error Error: ${JSON.stringify(errorMessage)}`
    );
  });
});

describe("tagEntity", () => {
  it("Adds a tag if a tag does not exist", async () => {
    const entry = createEntry();
    entry.metadata = { tags: [] };

    const market = "Norway";
    const tagId = "market__norway";

    await tagEntity(entry, market);

    expect(entry.metadata.tags).toContainEqual({
      sys: {
        type: "Link",
        linkType: "Tag",
        id: tagId
      }
    });
  });

  it("Does not add a duplicate tag if it already exists", async () => {
    const tag: Link<"Tag"> = {
      sys: {
        type: "Link",
        linkType: "Tag",
        id: "market__norway"
      }
    };
    const entry = createEntry();
    entry.metadata = { tags: [tag] };
    const market = "Norway";

    await tagEntity(entry, market);

    const uniqueTags = new Set(entry.metadata.tags.map((t) => t.sys.id));
    expect(entry.metadata.tags).toHaveLength(uniqueTags.size);
  });
  it("Logs a message if it already exists", async () => {
    const tag: Link<"Tag"> = {
      sys: {
        type: "Link",
        linkType: "Tag",
        id: "market__norway"
      }
    };
    const entry = createEntry();
    entry.metadata = { tags: [tag] };
    const market = "Norway";

    await tagEntity(entry, market);

    expect(console.log).toBeCalledWith(
      `DXB market tag found on :${entry.sys?.id}`
    );
  });

  it("Does not add tags, if metadata is undefined", async () => {
    const entry = createEntry();
    entry.metadata = undefined;
    const market = "Norway";

    await tagEntity(entry, market);

    expect(entry.metadata).toBeUndefined();
  });
});
