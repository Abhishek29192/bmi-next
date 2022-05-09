import { Environment, Entry, Link } from "contentful-management";
import mockConsole from "jest-mock-console";

const createTag = async (environment: Partial<Environment>, market: string) =>
  (await import("../tag")).CreateTag(environment as Environment, market);

const tagEntity = async (entry: Partial<Entry>, market: string) =>
  await (await import("../tag")).TagEntity(entry as Entry, market);

const mockEnvironment = (): Partial<Environment> => {
  const env: Partial<Environment> = {};
  env.createTag = jest.fn();
  return env;
};

const mockEntry = (): Partial<Entry> => {
  const entry: Partial<Entry> = {};
  entry.sys = {
    space: {
      sys: {
        type: "Link",
        linkType: "Space",
        id: "123456"
      }
    },
    id: "qwerty",
    type: "Entry",
    createdAt: "2022-03-10T14:30:26.308Z",
    updatedAt: "2022-04-20T10:09:55.815Z",
    environment: {
      sys: {
        id: "master",
        type: "Link",
        linkType: "Environment"
      }
    },
    publishedVersion: 1,
    publishedAt: "2022-03-10T14:39:01.851Z",
    firstPublishedAt: "2022-03-10T14:39:01.851Z",
    createdBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "1234sdfg"
      }
    },
    updatedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "3355sdfhgh"
      }
    },
    publishedCounter: 1,
    version: 3,
    publishedBy: {
      sys: {
        type: "Link",
        linkType: "User",
        id: "234545645asdfgh"
      }
    },
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "page"
      }
    }
  };
  return entry;
};

beforeEach(() => {
  mockConsole();
});

describe("CreateTag", () => {
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

    await createTag(environment, market);

    expect(console.warn).toBeCalled();
  });

  it("Logs an error if the API error response is not recognised", async () => {
    const environment = mockEnvironment();
    const errorMessage = { status: 500 };
    environment.getTag = jest
      .fn()
      .mockRejectedValueOnce({ message: JSON.stringify(errorMessage) });
    const market = "Norway";

    await createTag(environment, market);

    expect(console.error).toBeCalledTimes(1);
  });
});

describe("TagEntity", () => {
  it("Creates a tag if a tag does not exist", async () => {
    const entry = mockEntry();
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
    const entry = mockEntry();
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
    const entry = mockEntry();
    entry.metadata = { tags: [tag] };
    const market = "Norway";

    await tagEntity(entry, market);

    expect(console.log).toBeCalledWith(
      `DXB market tag found on :${entry.sys?.id}`
    );
  });

  it("Does not add tags, if metadata is undefined", async () => {
    const entry = mockEntry();
    entry.metadata = undefined;
    const market = "Norway";

    await tagEntity(entry, market);

    expect(entry.metadata).toBeUndefined();
  });
});
