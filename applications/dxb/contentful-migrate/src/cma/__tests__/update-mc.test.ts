import { jest } from "@jest/globals";
import {
  createBulkAction,
  createCollection,
  createEntry,
  createEntryMetaSysProps,
  createEnvironment,
  createLink,
  createLocale,
  createMetadataProps,
  createSpace,
  createTag,
  createTagSysProps
} from "@bmi/functions-contentful-management-client";
import { microCopy } from "@bmi/microcopies";
import { isDefined } from "@bmi/utils";
import { QueryOptions } from "contentful-management/dist/typings/common-types.js";
import { KEYS_REQUEST_PAGE_SIZE } from "../constants.js";
import type {
  BulkAction,
  ClientAPI,
  Entry,
  Environment,
  Space
} from "contentful-management";

const mockGetSpace = jest.fn<ClientAPI["getSpace"]>();
jest.mock("@bmi/functions-contentful-management-client", () => ({
  getContentfulClient: () => ({
    getSpace: mockGetSpace
  })
}));

jest.mock("dotenv/config", () => {});

const main = async (isToBePublished: boolean, isConsolidated: boolean) =>
  (await import("../update-mc.js")).main(isToBePublished, isConsolidated);

beforeEach(() => {
  process.env.SPACE_ID = "space-id";
  process.env.CONTENTFUL_ENVIRONMENT = "environment-id";

  jest.clearAllMocks();
  jest.resetModules();
});

describe("main with isPublished false and isConsolidated false", () => {
  it("should throw error if SPACE_ID was not provided", async () => {
    const originalSpaceId = process.env.SPACE_ID;
    delete process.env.SPACE_ID;

    await expect(main(false, false)).rejects.toThrowError(
      "SPACE_ID was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.SPACE_ID = originalSpaceId;
  });

  it("should throw error if CONTENTFUL_ENVIRONMENT was not provided", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    await expect(main(false, false)).rejects.toThrowError(
      "CONTENTFUL_ENVIRONMENT was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("should propagate error if getSpace throws an error", async () => {
    mockGetSpace.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
  });

  it("should propagate error if getEnvironment throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    mockGetEnvironment.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
  });

  it("should propagate error if getting microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries
      })
    );
    mockGetEntries.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
  });

  it("should propagate error if getting paginated microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries
      })
    );
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: 101,
          items: Array.from(Array(100).keys()).map(() => createEntry())
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 100,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
  });

  it("should throw error if a microcopy has multiple tags", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createEntry({
            metadata: createMetadataProps({
              tags: [createLink(), createLink()]
            })
          })
        ]
      })
    );

    await expect(main(false, false)).rejects.toThrowError(
      "Please fix multi tagged entries and start this process again."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
  });

  it("should create do nothing if microcopy already exists", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );

    await main(false, false);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockCreateEntry).not.toHaveBeenCalled();
  });

  it("should propagate error thrown getting locales", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    // need to have a microcopy to create
    microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetLocales).toHaveBeenCalled();
  });

  it("should propagate error thrown creating microcopy", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, false)).rejects.toThrowError(
      "1 entries failed to be created in contentful."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
  });

  it("should propagate error if getting resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());

    await expect(main(false, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should throw error if getting resources returns nothing", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(createCollection({ total: 0, items: [] }));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());

    await expect(main(false, false)).rejects.toThrowError(
      `Unable to find any resources with tag .`
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should propagate error if updating resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());
    mockEntryUpdate.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should create new microcopy if it doesn't exist without publishing it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());

    await main(false, false);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should create multiple new microcopies if they don't exist without publishing it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate1 = microcopies.pop()!;
    const newMicrocopyToCreate2 = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry
      .mockResolvedValueOnce(createEntry())
      .mockResolvedValueOnce(createEntry());

    await main(false, false);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });
});

describe("main with isPublished true and isConsolidated false", () => {
  it("should throw error if SPACE_ID was not provided", async () => {
    const originalSpaceId = process.env.SPACE_ID;
    delete process.env.SPACE_ID;

    await expect(main(true, false)).rejects.toThrowError(
      "SPACE_ID was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.SPACE_ID = originalSpaceId;
  });

  it("should throw error if CONTENTFUL_ENVIRONMENT was not provided", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    await expect(main(true, false)).rejects.toThrowError(
      "CONTENTFUL_ENVIRONMENT was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("should propagate error if getSpace throws an error", async () => {
    mockGetSpace.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
  });

  it("should propagate error if getEnvironment throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    mockGetEnvironment.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
  });

  it("should propagate error if getting microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries
      })
    );
    mockGetEntries.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
  });

  it("should propagate error if getting paginated microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries
      })
    );
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: 101,
          items: Array.from(Array(100).keys()).map(() => createEntry())
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 100,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
  });

  it("should throw error if a microcopy has multiple tags", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createEntry({
            metadata: createMetadataProps({
              tags: [createLink(), createLink()]
            })
          })
        ]
      })
    );

    await expect(main(true, false)).rejects.toThrowError(
      "Please fix multi tagged entries and start this process again."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
  });

  it("should create do nothing if microcopy already exists", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );

    await main(true, false);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockCreateEntry).not.toHaveBeenCalled();
  });

  it("should propagate error thrown getting locales", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    // need to have a microcopy to create
    microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetLocales).toHaveBeenCalled();
  });

  it("should propagate error thrown creating microcopy", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError(
      "1 entries failed to be created in contentful."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
  });

  it("should propagate error if getting resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry();
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should throw error if getting resources returns nothing", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(createCollection({ total: 0, items: [] }));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry();
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);

    await expect(main(true, false)).rejects.toThrowError(
      `Unable to find any resources with tag .`
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should propagate error if updating resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry();
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    mockEntryUpdate.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should propagate error thrown publishing new microcopies", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry();
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    mockCreatePublishBulkAction.mockRejectedValueOnce(
      new Error("Expected Error")
    );

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should propagate error thrown waiting for the bulk publish action to be processed", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry();
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction.mockResolvedValueOnce(
      createBulkAction({
        waitProcessing: mockWaitProcessing
      })
    );
    mockWaitProcessing.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, false)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalled();
  });

  it("should create new microcopy if it doesn't exist and publish it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry();
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction.mockResolvedValueOnce(
      createBulkAction({
        waitProcessing: mockWaitProcessing
      })
    );

    await main(true, false);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalled();
  });

  it("should create multiple new microcopies if they don't exist and publish it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getEntries: mockGetEntries,
        getLocales: mockGetLocales,
        createEntry: mockCreateEntry,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate1 = microcopies.pop()!;
    const newMicrocopyToCreate2 = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy1 = createEntry();
    const createdMicrocopy2 = createEntry();
    mockCreateEntry
      .mockResolvedValueOnce(createdMicrocopy1)
      .mockResolvedValueOnce(createdMicrocopy2);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction.mockResolvedValueOnce(
      createBulkAction({
        waitProcessing: mockWaitProcessing
      })
    );

    await main(true, false);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        }
      },
      metadata: undefined
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy1.sys.id,
              version: createdMicrocopy1.sys.version
            }
          },
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy2.sys.id,
              version: createdMicrocopy2.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalled();
  });
});

describe("main with isPublished false and isConsolidated true", () => {
  it("should throw error if SPACE_ID was not provided", async () => {
    const originalSpaceId = process.env.SPACE_ID;
    delete process.env.SPACE_ID;

    await expect(main(false, true)).rejects.toThrowError(
      "SPACE_ID was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.SPACE_ID = originalSpaceId;
  });

  it("should throw error if CONTENTFUL_ENVIRONMENT was not provided", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    await expect(main(false, true)).rejects.toThrowError(
      "CONTENTFUL_ENVIRONMENT was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("should propagate error if getSpace throws an error", async () => {
    mockGetSpace.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
  });

  it("should propagate error if getEnvironment throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    mockGetEnvironment.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
  });

  it("should propagate error if getting tags throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should throw error if getting tags returns no results", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockResolvedValueOnce(
      createCollection({ total: 0, items: [] })
    );

    await expect(main(false, true)).rejects.toThrowError(
      "The environment 'master' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should throw error if only private tags are returned", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createTag({
            sys: createTagSysProps({ id: "market__uk", visibility: "private" })
          })
        ]
      })
    );

    await expect(main(false, true)).rejects.toThrowError(
      "The environment 'master' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should throw error if public tags are returned but do not start with market__", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createTag({
            sys: createTagSysProps({ id: "uk", visibility: "public" })
          })
        ]
      })
    );

    await expect(main(false, true)).rejects.toThrowError(
      "The environment 'master' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should propagate error if getting microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    mockGetEntries.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
  });

  it("should propagate error if getting paginated microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: 101,
          items: Array.from(Array(100).keys()).map(() => createEntry())
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 100,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
  });

  it("should throw error if a microcopy has multiple tags", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createEntry({
            metadata: createMetadataProps({
              tags: [createLink(), createLink()]
            })
          })
        ]
      })
    );

    await expect(main(false, true)).rejects.toThrowError(
      "Please fix multi tagged entries and start this process again."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
  });

  it("should create do nothing if microcopy already exists", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );

    await main(false, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockCreateEntry).not.toHaveBeenCalled();
  });

  it("should propagate error thrown getting locales", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    // need to have a microcopy to create
    microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
  });

  it("should propagate error thrown creating microcopy", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError(
      "1 entries failed to be created in contentful."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
  });

  it("should propagate error if getting resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should propagate error if getting resources returns nothing", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(createCollection({ total: 0, items: [] }));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());

    await expect(main(false, true)).rejects.toThrowError(
      `Unable to find any resources with tag ${tag.name}.`
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should propagate error if updating resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());
    mockEntryUpdate.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(false, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should create new microcopy if it doesn't exist without publishing it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockResolvedValueOnce(createEntry());

    await main(false, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should create multiple new microcopies if they don't exist without publishing it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate1 = microcopies.pop()!;
    const newMicrocopyToCreate2 = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry
      .mockResolvedValueOnce(createEntry())
      .mockResolvedValueOnce(createEntry());

    await main(false, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should create new microcopy for each tag if it doesn't exist without publishing it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag1 = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    const tag2 = createTag({
      sys: createTagSysProps({ id: "market__no", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 2,
        items: [tag1, tag2]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdateForTag1 = jest.fn<Entry["update"]>();
    const resourcesForTag1 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag1
    });
    const mockEntryUpdateForTag2 = jest.fn<Entry["update"]>();
    const resourcesForTag2 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag2
    });
    mockGetEntries.mockImplementation(async (query?: QueryOptions) => {
      if (query?.content_type === "resource") {
        return createCollection({
          total: microcopies.length,
          items: microcopies
        });
      } else if (
        query?.content_type === "resources" &&
        query["metadata.tags.sys.id[in]"] === tag2.sys.id
      ) {
        return createCollection({ total: 1, items: [resourcesForTag1] });
      }
      return createCollection({ total: 1, items: [resourcesForTag2] });
    });
    mockGetLocales
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      )
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      );
    mockCreateEntry
      .mockResolvedValueOnce(createEntry())
      .mockResolvedValueOnce(createEntry());

    await main(false, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(4);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag2.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag2.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag1.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag2.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdateForTag1).toHaveBeenCalledTimes(1);
    expect(mockEntryUpdateForTag2).toHaveBeenCalledTimes(1);
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });

  it("should create microcopy that exists for one tag, but not another without publishing it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag1 = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    const tag2 = createTag({
      sys: createTagSysProps({ id: "market__no", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 2,
        items: [tag1, tag2]
      })
    );
    let newMicrocopyToCreateForTag1: Entry;
    const microcopiesForTag1 = Object.values(microCopy)
      .map((microCopyKey) => {
        const entry = createEntry({
          fields: {
            key: {
              "en-US": microCopyKey
            }
          }
        });
        if (microCopyKey === microCopy.SHARE_COPY) {
          newMicrocopyToCreateForTag1 = entry;
          return undefined;
        }
        return entry;
      })
      .filter(isDefined);
    let newMicrocopyToCreateForTag2: Entry;
    const microcopiesForTag2 = Object.values(microCopy)
      .map((microCopyKey) => {
        const entry = createEntry({
          fields: {
            key: {
              "en-US": microCopyKey
            }
          }
        });
        if (microCopyKey === microCopy.BASKET_LABEL) {
          newMicrocopyToCreateForTag2 = entry;
          return undefined;
        }
        return entry;
      })
      .filter(isDefined);
    const mockEntryUpdateForTag1 = jest.fn<Entry["update"]>();
    const resourcesForTag1 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag1
    });
    const mockEntryUpdateForTag2 = jest.fn<Entry["update"]>();
    const resourcesForTag2 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag2
    });
    mockGetEntries.mockImplementation(async (query?: QueryOptions) => {
      if (
        query?.content_type === "resource" &&
        query["metadata.tags.sys.id[in]"] === tag1.sys.id
      ) {
        return createCollection({
          total: microcopiesForTag1.length,
          items: microcopiesForTag1
        });
      } else if (
        query?.content_type === "resource" &&
        query["metadata.tags.sys.id[in]"] === tag2.sys.id
      ) {
        return createCollection({
          total: microcopiesForTag2.length,
          items: microcopiesForTag2
        });
      } else if (
        query?.content_type === "resources" &&
        query["metadata.tags.sys.id[in]"] === tag1.sys.id
      ) {
        return createCollection({ total: 1, items: [resourcesForTag1] });
      }
      return createCollection({ total: 1, items: [resourcesForTag2] });
    });
    mockGetLocales
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      )
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      );
    mockCreateEntry
      .mockResolvedValueOnce(createEntry())
      .mockResolvedValueOnce(createEntry());

    await main(false, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(4);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag2.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag2.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreateForTag1!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag1!.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreateForTag1!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag1!.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag1.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreateForTag2!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag2!.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreateForTag2!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag2!.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag2.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdateForTag1).toHaveBeenCalledTimes(1);
    expect(mockEntryUpdateForTag2).toHaveBeenCalledTimes(1);
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalled();
  });
});

describe("main with isPublished true and isConsolidated true", () => {
  it("should throw error if SPACE_ID was not provided", async () => {
    const originalSpaceId = process.env.SPACE_ID;
    delete process.env.SPACE_ID;

    await expect(main(true, true)).rejects.toThrowError(
      "SPACE_ID was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.SPACE_ID = originalSpaceId;
  });

  it("should throw error if CONTENTFUL_ENVIRONMENT was not provided", async () => {
    const originalContentfulEnvironment = process.env.CONTENTFUL_ENVIRONMENT;
    delete process.env.CONTENTFUL_ENVIRONMENT;

    await expect(main(true, true)).rejects.toThrowError(
      "CONTENTFUL_ENVIRONMENT was not provided"
    );

    expect(mockGetSpace).not.toHaveBeenCalled();

    process.env.CONTENTFUL_ENVIRONMENT = originalContentfulEnvironment;
  });

  it("should propagate error if getSpace throws an error", async () => {
    mockGetSpace.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
  });

  it("should propagate error if getEnvironment throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    mockGetEnvironment.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
  });

  it("should propagate error if getting tags throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should throw error if getting tags returns no results", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockResolvedValueOnce(
      createCollection({ total: 0, items: [] })
    );

    await expect(main(true, true)).rejects.toThrowError(
      "The environment 'master' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should throw error if only private tags are returned", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createTag({
            sys: createTagSysProps({ id: "market__uk", visibility: "private" })
          })
        ]
      })
    );

    await expect(main(true, true)).rejects.toThrowError(
      "The environment 'master' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should throw error if public tags are returned but do not start with market__", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags
      })
    );
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createTag({
            sys: createTagSysProps({ id: "uk", visibility: "public" })
          })
        ]
      })
    );

    await expect(main(true, true)).rejects.toThrowError(
      "The environment 'master' is expected to be Consolidated space, however NO public tags prefix with 'market__' are present."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
  });

  it("should propagate error if getting microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    mockGetEntries.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
  });

  it("should propagate error if getting paginated microcopies throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: 101,
          items: Array.from(Array(100).keys()).map(() => createEntry())
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 100,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
  });

  it("should throw error if a microcopy has multiple tags", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [
          createEntry({
            metadata: createMetadataProps({
              tags: [createLink(), createLink()]
            })
          })
        ]
      })
    );

    await expect(main(true, true)).rejects.toThrowError(
      "Please fix multi tagged entries and start this process again."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
  });

  it("should create do nothing if microcopy already exists", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );

    await main(true, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockCreateEntry).not.toHaveBeenCalled();
  });

  it("should propagate error thrown getting locales", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    // need to have a microcopy to create
    microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
  });

  it("should propagate error thrown creating microcopy", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries.mockResolvedValueOnce(
      createCollection({
        total: microcopies.length,
        items: microcopies
      })
    );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    mockCreateEntry.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError(
      "1 entries failed to be created in contentful."
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
  });

  it("should propagate error if getting resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockRejectedValueOnce(new Error("Expected Error"));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should propagate error if getting resources returns nothing", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(createCollection({ total: 0, items: [] }));
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);

    await expect(main(true, true)).rejects.toThrowError(
      `Unable to find any resources with tag ${tag.name}.`
    );

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should propagate error if updating resources throws an error", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    mockEntryUpdate.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).not.toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should propagate error thrown publishing new microcopies", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    mockCreatePublishBulkAction.mockRejectedValueOnce(
      new Error("Expected Error")
    );

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
  });

  it("should propagate error thrown waiting for the bulk publish action to be processed", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction.mockResolvedValueOnce(
      createBulkAction({
        waitProcessing: mockWaitProcessing
      })
    );
    mockWaitProcessing.mockRejectedValueOnce(new Error("Expected Error"));

    await expect(main(true, true)).rejects.toThrowError("Expected Error");

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalled();
  });

  it("should create new microcopy if it doesn't exist and publish it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    mockCreateEntry.mockResolvedValueOnce(createdMicrocopy);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction.mockResolvedValueOnce(
      createBulkAction({
        waitProcessing: mockWaitProcessing
      })
    );

    await main(true, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy.sys.id,
              version: createdMicrocopy.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalled();
  });

  it("should create multiple new microcopies if they don't exist and publish it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 1,
        items: [tag]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate1 = microcopies.pop()!;
    const newMicrocopyToCreate2 = microcopies.pop()!;
    const mockEntryUpdate = jest.fn<Entry["update"]>();
    const resources = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdate
    });
    mockGetEntries
      .mockResolvedValueOnce(
        createCollection({
          total: microcopies.length,
          items: microcopies
        })
      )
      .mockResolvedValueOnce(
        createCollection({ total: 1, items: [resources] })
      );
    mockGetLocales.mockResolvedValueOnce(
      createCollection({
        items: [
          createLocale({ code: "en-US" }),
          createLocale({ code: "en-GB" })
        ]
      })
    );
    const createdMicrocopy1 = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    const createdMicrocopy2 = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy2" })
    });
    mockCreateEntry
      .mockResolvedValueOnce(createdMicrocopy1)
      .mockResolvedValueOnce(createdMicrocopy2);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction.mockResolvedValueOnce(
      createBulkAction({
        waitProcessing: mockWaitProcessing
      })
    );

    await main(true, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(2);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalled();
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate1.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate1.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate2.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate2.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdate).toHaveBeenCalled();
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy1.sys.id,
              version: createdMicrocopy1.sys.version
            }
          },
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy2.sys.id,
              version: createdMicrocopy2.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalled();
  });

  it("should create new microcopy for each tag if it doesn't exist and publish it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag1 = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    const tag2 = createTag({
      sys: createTagSysProps({ id: "market__no", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 2,
        items: [tag1, tag2]
      })
    );
    const microcopies = Object.values(microCopy).map((microCopyKey) =>
      createEntry({
        fields: {
          key: {
            "en-US": microCopyKey
          }
        }
      })
    );
    const newMicrocopyToCreate = microcopies.pop()!;
    const mockEntryUpdateForTag1 = jest.fn<Entry["update"]>();
    const resourcesForTag1 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag1
    });
    const mockEntryUpdateForTag2 = jest.fn<Entry["update"]>();
    const resourcesForTag2 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag2
    });
    mockGetEntries.mockImplementation(async (query?: QueryOptions) => {
      if (query?.content_type === "resource") {
        return createCollection({
          total: microcopies.length,
          items: microcopies
        });
      } else if (
        query?.content_type === "resources" &&
        query["metadata.tags.sys.id[in]"] === tag1.sys.id
      ) {
        return createCollection({ total: 1, items: [resourcesForTag1] });
      }
      return createCollection({ total: 1, items: [resourcesForTag2] });
    });
    mockGetLocales
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      )
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      );
    const createdMicrocopy1 = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    const createdMicrocopy2 = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy2" })
    });
    mockCreateEntry
      .mockResolvedValueOnce(createdMicrocopy1)
      .mockResolvedValueOnce(createdMicrocopy2);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction
      .mockResolvedValueOnce(
        createBulkAction({
          waitProcessing: mockWaitProcessing
        })
      )
      .mockResolvedValueOnce(
        createBulkAction({
          waitProcessing: mockWaitProcessing
        })
      );

    await main(true, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(4);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag2.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag1.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreate.fields.key["en-US"],
          "en-GB": newMicrocopyToCreate.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag2.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdateForTag1).toHaveBeenCalledTimes(1);
    expect(mockEntryUpdateForTag2).toHaveBeenCalledTimes(1);
    expect(mockCreatePublishBulkAction).toHaveBeenCalledTimes(2);
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy1.sys.id,
              version: createdMicrocopy1.sys.version
            }
          }
        ]
      }
    });
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy2.sys.id,
              version: createdMicrocopy2.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalledTimes(2);
  });

  it("should create microcopy that exists for one tag, but not another and publish it", async () => {
    const mockGetEnvironment = jest.fn<Space["getEnvironment"]>();
    mockGetSpace.mockResolvedValueOnce(
      createSpace({
        getEnvironment: mockGetEnvironment
      })
    );
    const mockGetTags = jest.fn<Environment["getTags"]>();
    const mockGetEntries = jest.fn<Environment["getEntries"]>();
    const mockCreateEntry = jest.fn<Environment["createEntry"]>();
    const mockGetLocales = jest.fn<Environment["getLocales"]>();
    const mockCreatePublishBulkAction =
      jest.fn<Environment["createPublishBulkAction"]>();
    mockGetEnvironment.mockResolvedValueOnce(
      createEnvironment({
        getTags: mockGetTags,
        getEntries: mockGetEntries,
        createEntry: mockCreateEntry,
        getLocales: mockGetLocales,
        createPublishBulkAction: mockCreatePublishBulkAction
      })
    );
    const tag1 = createTag({
      sys: createTagSysProps({ id: "market__uk", visibility: "public" })
    });
    const tag2 = createTag({
      sys: createTagSysProps({ id: "market__no", visibility: "public" })
    });
    mockGetTags.mockResolvedValueOnce(
      createCollection({
        total: 2,
        items: [tag1, tag2]
      })
    );
    let newMicrocopyToCreateForTag1: Entry;
    const microcopiesForTag1 = Object.values(microCopy)
      .map((microCopyKey) => {
        const entry = createEntry({
          fields: {
            key: {
              "en-US": microCopyKey
            }
          }
        });
        if (microCopyKey === microCopy.SHARE_COPY) {
          newMicrocopyToCreateForTag1 = entry;
          return undefined;
        }
        return entry;
      })
      .filter(isDefined);
    let newMicrocopyToCreateForTag2: Entry;
    const microcopiesForTag2 = Object.values(microCopy)
      .map((microCopyKey) => {
        const entry = createEntry({
          fields: {
            key: {
              "en-US": microCopyKey
            }
          }
        });
        if (microCopyKey === microCopy.BASKET_LABEL) {
          newMicrocopyToCreateForTag2 = entry;
          return undefined;
        }
        return entry;
      })
      .filter(isDefined);
    const mockEntryUpdateForTag1 = jest.fn<Entry["update"]>();
    const resourcesForTag1 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag1
    });
    const mockEntryUpdateForTag2 = jest.fn<Entry["update"]>();
    const resourcesForTag2 = createEntry({
      fields: {
        microCopy: { "en-US": [createLink()], "en-GB": [createLink()] }
      },
      update: mockEntryUpdateForTag2
    });
    mockGetEntries.mockImplementation(async (query?: QueryOptions) => {
      if (
        query?.content_type === "resource" &&
        query["metadata.tags.sys.id[in]"] === tag1.sys.id
      ) {
        return createCollection({
          total: microcopiesForTag1.length,
          items: microcopiesForTag1
        });
      } else if (
        query?.content_type === "resource" &&
        query["metadata.tags.sys.id[in]"] === tag2.sys.id
      ) {
        return createCollection({
          total: microcopiesForTag2.length,
          items: microcopiesForTag2
        });
      } else if (
        query?.content_type === "resources" &&
        query["metadata.tags.sys.id[in]"] === tag1.sys.id
      ) {
        return createCollection({ total: 1, items: [resourcesForTag1] });
      }
      return createCollection({ total: 1, items: [resourcesForTag2] });
    });
    mockGetLocales
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      )
      .mockResolvedValueOnce(
        createCollection({
          items: [
            createLocale({ code: "en-US" }),
            createLocale({ code: "en-GB" })
          ]
        })
      );
    const createdMicrocopy1 = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy1" })
    });
    const createdMicrocopy2 = createEntry({
      sys: createEntryMetaSysProps({ id: "microcopy2" })
    });
    mockCreateEntry
      .mockResolvedValueOnce(createdMicrocopy1)
      .mockResolvedValueOnce(createdMicrocopy2);
    const mockWaitProcessing = jest.fn<BulkAction["waitProcessing"]>();
    mockCreatePublishBulkAction
      .mockResolvedValueOnce(
        createBulkAction({
          waitProcessing: mockWaitProcessing
        })
      )
      .mockResolvedValueOnce(
        createBulkAction({
          waitProcessing: mockWaitProcessing
        })
      );

    await main(true, true);

    expect(mockGetSpace).toHaveBeenCalled();
    expect(mockGetEnvironment).toHaveBeenCalled();
    expect(mockGetTags).toHaveBeenCalledWith(undefined);
    expect(mockGetEntries).toHaveBeenCalledTimes(4);
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag1.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resource", // For some reason, microcopies have the ID resource in Contentful
      skip: 0,
      limit: KEYS_REQUEST_PAGE_SIZE,
      "metadata.tags.sys.id[in]": tag2.sys.id
    });
    expect(mockGetEntries).toHaveBeenCalledWith({
      content_type: "resources",
      limit: 1,
      "metadata.tags.sys.id[in]": tag2.sys.id
    });
    expect(mockGetLocales).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledTimes(2);
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreateForTag1!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag1!.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreateForTag1!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag1!.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag1.sys.id
            }
          }
        ]
      }
    });
    expect(mockCreateEntry).toHaveBeenCalledWith("resource", {
      fields: {
        key: {
          "en-US": newMicrocopyToCreateForTag2!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag2!.fields.key["en-US"]
        },
        value: {
          "en-US": newMicrocopyToCreateForTag2!.fields.key["en-US"],
          "en-GB": newMicrocopyToCreateForTag2!.fields.key["en-US"]
        }
      },
      metadata: {
        tags: [
          {
            sys: {
              type: "Link",
              linkType: "Tag",
              id: tag2.sys.id
            }
          }
        ]
      }
    });
    expect(mockEntryUpdateForTag1).toHaveBeenCalledTimes(1);
    expect(mockEntryUpdateForTag2).toHaveBeenCalledTimes(1);
    expect(mockCreatePublishBulkAction).toHaveBeenCalledTimes(2);
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy1.sys.id,
              version: createdMicrocopy1.sys.version
            }
          }
        ]
      }
    });
    expect(mockCreatePublishBulkAction).toHaveBeenCalledWith({
      entities: {
        sys: { type: "Array" },
        items: [
          {
            sys: {
              linkType: "Entry",
              type: "Link",
              id: createdMicrocopy2.sys.id,
              version: createdMicrocopy2.sys.version
            }
          }
        ]
      }
    });
    expect(mockWaitProcessing).toHaveBeenCalledTimes(2);
  });
});
