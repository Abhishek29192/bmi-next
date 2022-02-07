import report from "gatsby-cli/lib/reporter";

import {
  value as clientIndices,
  callstack,
  config,
  reset,
  bulk,
  cat
} from "@elastic/elasticsearch";
// @ts-ignore
import { onPostBuild } from "../gatsby-node";

let reporterStatuses: string[] = [];
jest.mock("gatsby-cli/lib/reporter", () => ({
  activityTimer: jest.fn().mockReturnValue({
    start: jest.fn(() => reporterStatuses.push("activityTimer.start")),
    setStatus: jest.fn((status: string) => reporterStatuses.push(status)),
    end: jest.fn(() => reporterStatuses.push("activityTimer.end"))
  }),
  panic: jest.fn((error: string) => {
    reporterStatuses.push(`report.panic ${error}`);
    throw new Error(error);
  }),
  error: jest.fn((error: string) => {
    reporterStatuses.push(`report.error ${error}`);
  })
}));

jest.mock("@elastic/elasticsearch");

const queries = [
  {
    indexName: jest.fn().mockReturnValue("alias-1"),
    query: jest.fn().mockReturnValue("query-1"),
    transformer: jest
      .fn()
      .mockResolvedValue(
        new Array(10).fill(1).map((_, i: number) => `doc-${i}`)
      ),
    indexConfig: {
      mappings: { mapping: "alias-1-mapping" },
      settings: { setting: "alias-1-setting" }
    }
  }
];

const graphql = { graphql: jest.fn().mockReturnValue({ errors: null }) };
const params = {
  node: "node",
  apiKey: "apiKey",
  auth: null,
  chunkSize: 4,
  queries
};

describe("gatsby-plugin-elasicsearch gatsby-node", () => {
  afterEach(() => {
    reset();
    reporterStatuses = [];
  });

  it("should create client with specific props and procceed indices", async () => {
    jest.spyOn(report, "activityTimer");
    await onPostBuild(graphql, params);
    expect(report.activityTimer).toBeCalledWith("Indexing to ElasticSearch");

    expect(clientIndices).toEqual({ "alias-1_2": { name: "alias-1" } });

    expect(config).toEqual({ auth: { apiKey: "apiKey" }, node: "node" });

    expect(callstack).toEqual([
      { name: "getAlias", props: { name: "alias-1" } },
      {
        name: "delete",
        props: {
          index: "alias-1_0"
        }
      },
      {
        name: "delete",
        props: {
          index: "alias-1_1"
        }
      },
      { name: "create", props: { index: "alias-1_2" } },
      { name: "close", props: { index: "alias-1_2" } },
      {
        name: "putSettings",
        props: {
          body: { settings: { setting: "alias-1-setting" } },
          index: "alias-1_2"
        }
      },
      { name: "open", props: { index: "alias-1_2" } },
      {
        name: "putMapping",
        props: { body: { mapping: "alias-1-mapping" }, index: "alias-1_2" }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-0",
            { index: { _index: "alias-1_2" } },
            "doc-1",
            { index: { _index: "alias-1_2" } },
            "doc-2",
            { index: { _index: "alias-1_2" } },
            "doc-3"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-4",
            { index: { _index: "alias-1_2" } },
            "doc-5",
            { index: { _index: "alias-1_2" } },
            "doc-6",
            { index: { _index: "alias-1_2" } },
            "doc-7"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-8",
            { index: { _index: "alias-1_2" } },
            "doc-9"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      { name: "getAlias", props: { name: "alias-1" } },
      {
        name: "delete",
        props: {
          index: "alias-1_2"
        }
      },
      { name: "putAlias", props: { index: "alias-1_2", name: "alias-1" } }
    ]);
  });

  it("should create reporter and collect statuses", async () => {
    await onPostBuild(graphql, params);

    expect(reporterStatuses).toEqual([
      "activityTimer.start",
      "1 queries to index",
      "indices [alias-1_0,alias-1_1]  already exists",
      "index 'alias-1_2' created",
      "query 0: executing query",
      "query 0: splitting in 3 jobs",
      "deleting index 'alias-1_2'",
      "moved alias 'alias-1' -> 'alias-1_2'",
      "done",
      "activityTimer.end"
    ]);
  });

  it("should use auth param if provided to create elastic client", async () => {
    await onPostBuild(graphql, { ...params, auth: "auth" });
    expect(config).toEqual({ auth: "auth", node: "node" });
  });

  it("should execute queries if it is function", async () => {
    const queriesRequest = jest.fn(() => queries.map(async (query) => query));
    await onPostBuild(graphql, {
      ...params,
      queries: queriesRequest
    });

    expect(queriesRequest).toBeCalledWith(graphql.graphql);
  });

  it("should notify if no 'query' in queries found", async () => {
    await expect(
      onPostBuild(graphql, {
        ...params,
        queries: queries.map((query) => ({ ...query, query: null }))
      })
    ).rejects.toThrow("failed to index to ElasticSearch");

    expect(reporterStatuses).toEqual([
      "activityTimer.start",
      "1 queries to index",
      'report.panic failed to index to Elasticsearch. You did not give "query" to this query',
      "report.panic failed to index to ElasticSearch"
    ]);
  });

  it("should notify if no 'alias' in queries found", async () => {
    await expect(
      onPostBuild(graphql, {
        ...params,
        queries: queries.map((query) => ({ ...query, indexName: null }))
      })
    ).rejects.toThrow("failed to index to ElasticSearch");

    expect(reporterStatuses).toEqual([
      "activityTimer.start",
      "1 queries to index",
      'report.panic "null" is not a valid indexName.',
      "report.panic failed to index to ElasticSearch"
    ]);
  });

  it("should notify if graphql request fails", async () => {
    await expect(
      onPostBuild(
        { graphql: jest.fn().mockResolvedValue({ errors: ["error-1"] }) },
        params
      )
    ).rejects.toThrow("failed to index to ElasticSearch");

    expect(reporterStatuses).toEqual([
      "activityTimer.start",
      "1 queries to index",
      "indices [alias-1_0,alias-1_1]  already exists",
      "index 'alias-1_2' created",
      "query 0: executing query",
      "report.panic failed to index to ElasticSearch",
      "report.panic failed to index to ElasticSearch"
    ]);
  });

  it("should notify if bulk throws errors", async () => {
    bulk.mockResolvedValueOnce({
      body: {
        errors: ["error-bulk-1"],
        items: [
          {
            index: {
              error: {
                message: "error-bulk-message-1",
                code: "error-bulk-code-1"
              }
            }
          }
        ]
      }
    });
    await onPostBuild(graphql, params);

    expect(reporterStatuses).toEqual([
      "activityTimer.start",
      "1 queries to index",
      "indices [alias-1_0,alias-1_1]  already exists",
      "index 'alias-1_2' created",
      "query 0: executing query",
      "query 0: splitting in 3 jobs",
      'report.error {"message":"error-bulk-message-1","code":"error-bulk-code-1"}',
      "deleting index 'alias-1_2'",
      "moved alias 'alias-1' -> 'alias-1_2'",
      "done",
      "activityTimer.end"
    ]);
  });

  it("should warn if no aliased index found", async () => {
    cat.indices.mockResolvedValueOnce(
      "alias-0_2\nalias-1_0\nalias-1_1\nalias-1_not-existing-alias"
    );
    jest.spyOn(console, "warn");
    await onPostBuild(graphql, {
      ...params,
      queries: [
        {
          indexName: jest.fn().mockReturnValue("alias-2"),
          query: jest.fn().mockReturnValue("query-2"),
          transformer: jest
            .fn()
            .mockResolvedValue(
              new Array(10).fill(1).map((_, i: number) => `doc-${i}`)
            ),
          indexConfig: {
            mappings: { mapping: "alias-2-mapping" },
            settings: { setting: "alias-2-setting" }
          }
        }
      ]
    });

    // eslint-disable-next-line no-console
    expect(console.warn).toBeCalledWith(Error("Alias with alias-2 not found"));
  });

  it("should use default chunk size if no provided", async () => {
    await onPostBuild(graphql, { ...params, chunkSize: undefined });

    expect(reporterStatuses).toEqual([
      "activityTimer.start",
      "1 queries to index",
      "indices [alias-1_0,alias-1_1]  already exists",
      "index 'alias-1_2' created",
      "query 0: executing query",
      "query 0: splitting in 1 jobs",
      "deleting index 'alias-1_2'",
      "moved alias 'alias-1' -> 'alias-1_2'",
      "done",
      "activityTimer.end"
    ]);
  });

  it("should create client without auth if no provided", async () => {
    await onPostBuild(graphql, { ...params, apiKey: undefined });

    expect(config).toEqual({ node: "node" });
  });

  it("should use default transformer if not provided", async () => {
    await onPostBuild(
      {
        graphql: jest
          .fn()
          .mockResolvedValue(["gql-doc-0", "gql-doc-1", "gql-doc-2"])
      },
      {
        ...params,
        chunkSize: 2,
        queries: queries.map((query) => ({ ...query, transformer: undefined }))
      }
    );

    expect(reporterStatuses).toEqual([
      "activityTimer.start",
      "1 queries to index",
      "indices [alias-1_0,alias-1_1]  already exists",
      "index 'alias-1_2' created",
      "query 0: executing query",
      "query 0: splitting in 2 jobs",
      "deleting index 'alias-1_2'",
      "moved alias 'alias-1' -> 'alias-1_2'",
      "done",
      "activityTimer.end"
    ]);
  });

  it("should skip executing 'query' in query if not a function", async () => {
    await onPostBuild(graphql, {
      ...params,
      queries: queries.map((query) => ({ ...query, query: "query" }))
    });

    expect(graphql.graphql).toBeCalledWith("query");
  });

  it("should skip settings set if no indexConfig provided", async () => {
    await onPostBuild(graphql, {
      ...params,
      queries: queries.map((query) => ({ ...query, indexConfig: null }))
    });

    expect(callstack).toEqual([
      { name: "getAlias", props: { name: "alias-1" } },
      {
        name: "delete",
        props: {
          index: "alias-1_0"
        }
      },
      {
        name: "delete",
        props: {
          index: "alias-1_1"
        }
      },
      { name: "create", props: { index: "alias-1_2" } },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-0",
            { index: { _index: "alias-1_2" } },
            "doc-1",
            { index: { _index: "alias-1_2" } },
            "doc-2",
            { index: { _index: "alias-1_2" } },
            "doc-3"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-4",
            { index: { _index: "alias-1_2" } },
            "doc-5",
            { index: { _index: "alias-1_2" } },
            "doc-6",
            { index: { _index: "alias-1_2" } },
            "doc-7"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-8",
            { index: { _index: "alias-1_2" } },
            "doc-9"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      { name: "getAlias", props: { name: "alias-1" } },
      {
        name: "delete",
        props: {
          index: "alias-1_2"
        }
      },
      { name: "putAlias", props: { index: "alias-1_2", name: "alias-1" } }
    ]);
  });

  it("should skip delete orphan indices if found", async () => {
    cat.indices.mockResolvedValueOnce({ body: "alias-3_1" });
    await onPostBuild(graphql, {
      ...params,
      queries: [
        {
          indexName: jest.fn().mockReturnValue("alias-3"),
          query: jest.fn().mockReturnValue("query-3"),
          transformer: jest
            .fn()
            .mockResolvedValue(
              new Array(10).fill(1).map((_, i: number) => `doc-${i}`)
            ),
          indexConfig: {
            mappings: { mapping: "alias-3-mapping" },
            settings: { setting: "alias-3-setting" }
          }
        }
      ]
    });

    expect(callstack).toEqual([
      { name: "getAlias", props: { name: "alias-3" } },
      { name: "create", props: { index: "alias-3_1" } },
      { name: "close", props: { index: "alias-3_1" } },
      {
        name: "putSettings",
        props: {
          body: { settings: { setting: "alias-3-setting" } },
          index: "alias-3_1"
        }
      },
      { name: "open", props: { index: "alias-3_1" } },
      {
        name: "putMapping",
        props: { body: { mapping: "alias-3-mapping" }, index: "alias-3_1" }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-3_1" } },
            "doc-0",
            { index: { _index: "alias-3_1" } },
            "doc-1",
            { index: { _index: "alias-3_1" } },
            "doc-2",
            { index: { _index: "alias-3_1" } },
            "doc-3"
          ],
          index: "alias-3_1",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-3_1" } },
            "doc-4",
            { index: { _index: "alias-3_1" } },
            "doc-5",
            { index: { _index: "alias-3_1" } },
            "doc-6",
            { index: { _index: "alias-3_1" } },
            "doc-7"
          ],
          index: "alias-3_1",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-3_1" } },
            "doc-8",
            { index: { _index: "alias-3_1" } },
            "doc-9"
          ],
          index: "alias-3_1",
          refresh: true,
          type: "_doc"
        }
      },
      { name: "getAlias", props: { name: "alias-3" } },
      { name: "delete", props: { index: "alias-3_1" } },
      { name: "putAlias", props: { index: "alias-3_1", name: "alias-3" } }
    ]);
  });

  it("should skip putSettings if no indexConfig.settings provided", async () => {
    await onPostBuild(graphql, {
      ...params,
      queries: queries.map((query) => ({
        ...query,
        indexConfig: {
          mappings: { mapping: "alias-1-mapping" }
        }
      }))
    });

    expect(callstack).toEqual([
      { name: "getAlias", props: { name: "alias-1" } },
      { name: "delete", props: { index: "alias-1_0" } },
      { name: "delete", props: { index: "alias-1_1" } },
      { name: "create", props: { index: "alias-1_2" } },
      {
        name: "putMapping",
        props: { body: { mapping: "alias-1-mapping" }, index: "alias-1_2" }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-0",
            { index: { _index: "alias-1_2" } },
            "doc-1",
            { index: { _index: "alias-1_2" } },
            "doc-2",
            { index: { _index: "alias-1_2" } },
            "doc-3"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-4",
            { index: { _index: "alias-1_2" } },
            "doc-5",
            { index: { _index: "alias-1_2" } },
            "doc-6",
            { index: { _index: "alias-1_2" } },
            "doc-7"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      {
        name: "bulk",
        props: {
          body: [
            { index: { _index: "alias-1_2" } },
            "doc-8",
            { index: { _index: "alias-1_2" } },
            "doc-9"
          ],
          index: "alias-1_2",
          refresh: true,
          type: "_doc"
        }
      },
      { name: "getAlias", props: { name: "alias-1" } },
      { name: "delete", props: { index: "alias-1_2" } },
      { name: "putAlias", props: { index: "alias-1_2", name: "alias-1" } }
    ]);
  });
});
