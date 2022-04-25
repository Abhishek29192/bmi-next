import { Context, Node } from "../../types";
import { getUrlFromPath, resolvePath } from "../path";

describe("Path resolver util", () => {
  it("getUrlFromPath successfully gets url from path", () => {
    const testObject = [
      {
        path: "/en/test-*1/path/thingy/?q=1",
        queryParams: "?q=1",
        slug: "/en/test-*1/path/thingy/"
      },
      {
        path: '/en/test-"2/path/thingy/?q=2',
        queryParams: "?q=2",
        slug: '/test-"2/path/thingy/'
      }
    ];

    const url = getUrlFromPath(testObject);

    expect(url).toBe("/en/test-1/path/thingy/test-2/path/thingy/?q=1&q=2");
  });

  describe("resolvePath", () => {
    const source: Node = {
      id: "source",
      parent: null,
      children: null,
      internal: null,
      title: "source-title",
      slug: "source-slug",
      parentPage___NODE: "parentPage___NODE",
      site___NODE: ["site"]
    };
    const context: Context = {
      nodeModel: {
        getNodeById: jest.fn(),
        getNodesByIds: jest.fn(),
        findAll: jest.fn()
      }
    };

    it("should return path from source if no site___NODE found", async () => {
      expect(
        await resolvePath(
          { ...source, parentPage___NODE: null, site___NODE: null },
          null,
          context
        )
      ).toEqual([{ id: "source", label: "source-title", slug: "source-slug" }]);
    });

    it("should return path from source if no menuNavigation___NODE found", async () => {
      context.nodeModel.getNodeById = jest
        .fn()
        .mockResolvedValueOnce({ menuNavigation___NODE: null });

      expect(
        await resolvePath({ ...source, parentPage___NODE: null }, null, context)
      ).toEqual([{ id: "source", label: "source-title", slug: "source-slug" }]);
    });

    it("should return path from source if no links___NODE found", async () => {
      context.nodeModel.getNodeById = jest
        .fn()
        .mockResolvedValueOnce({
          menuNavigation___NODE: "menuNavigation___NODE"
        })
        .mockResolvedValueOnce({
          links___NODE: null
        });

      expect(
        await resolvePath({ ...source, parentPage___NODE: null }, null, context)
      ).toEqual([{ id: "source", label: "source-title", slug: "source-slug" }]);
    });

    it("should resolve path", async () => {
      context.nodeModel.getNodeById = jest
        .fn()
        .mockResolvedValueOnce({
          menuNavigation___NODE: "menuNavigation___NODE"
        })
        .mockResolvedValueOnce({
          links___NODE: ["link-1", "link-3", "link-2"]
        })
        .mockImplementation(({ id }) => {
          switch (id) {
            case "link-1":
              return {
                internal: {
                  type: "ContentfulLink"
                },
                linkedPage___NODE: null
              };
            case "link-2":
              return {
                internal: {
                  type: "ContentfulLink"
                },
                linkedPage___NODE: "linked-page-1"
              };
            case "link-3":
              return {
                internal: {
                  type: "ContentfulLink"
                },
                linkedPage___NODE: "linked-page-invalid"
              };
            case "link-4":
              return {
                internal: {
                  type: "ContentfulLink"
                },
                linkedPage___NODE: "linked-page-1",
                label: "link-4-label",
                queryParams: "?q=a"
              };
            case "linked-page-1":
              return {
                id: "source",
                slug: "slug",
                internal: {
                  title: "title"
                }
              };
            case "link-5":
              return {
                internal: {
                  type: "ContentfulNavigation"
                },
                link___NODE: "link-6",
                links___NODE: ["link-7"]
              };
            case "link-6":
              return {
                id: "source"
              };
            default:
              return null;
          }
        });

      expect(
        await resolvePath({ ...source, parentPage___NODE: null }, null, context)
      ).toEqual([
        { id: "source", label: undefined, slug: "slug", queryParams: "" }
      ]);
    });

    it("should resolve navigation", async () => {
      context.nodeModel.getNodeById = jest
        .fn()
        .mockResolvedValueOnce({
          menuNavigation___NODE: "menuNavigation___NODE"
        })
        .mockResolvedValueOnce({
          links___NODE: ["link-1"]
        })
        .mockImplementation(({ id }) => {
          switch (id) {
            case "link-1":
              return {
                internal: {
                  type: "ContentfulNavigation"
                },
                link___NODE: "link-2",
                links___NODE: ["link-3"]
              };
            case "link-2":
              return {
                internal: {
                  type: "ContentfulLink"
                },
                linkedPage___NODE: "linked-page-1"
              };
            case "link-3":
              return {
                internal: {
                  type: "ContentfulLink"
                },
                id: "source"
              };
            case "linked-page-1":
              return {
                id: "source"
              };
            default:
              return null;
          }
        });

      expect(
        await resolvePath({ ...source, parentPage___NODE: null }, null, context)
      ).toEqual([
        {
          id: "source",
          label: undefined,
          queryParams: "",
          slug: undefined
        }
      ]);
    });

    it("should resolve internal navigation", async () => {
      context.nodeModel.getNodeById = jest
        .fn()
        .mockResolvedValueOnce({
          menuNavigation___NODE: "menuNavigation___NODE"
        })
        .mockResolvedValueOnce({
          links___NODE: ["link-1"]
        })
        .mockImplementation(({ id }) => {
          switch (id) {
            case "link-1":
              return {
                internal: {
                  type: "ContentfulNavigation"
                },
                id: "link-1",
                label: "link-1-label",
                link___NODE: "link-2",
                links___NODE: ["link-3"]
              };
            case "link-2":
              return null;
            case "link-3":
              return {
                internal: {
                  type: "ContentfulLink"
                },
                label: "link-3-label",
                linkedPage___NODE: "linked-page-1"
              };
            case "linked-page-1":
              return {
                id: "source"
              };
            default:
              return null;
          }
        });

      expect(
        await resolvePath({ ...source, parentPage___NODE: null }, null, context)
      ).toEqual([
        {
          id: "link-1",
          label: "link-1-label"
        },
        {
          id: "source",
          label: "link-3-label",
          queryParams: "",
          slug: undefined
        }
      ]);
    });

    it("should resolve node from parent page", async () => {
      context.nodeModel.getNodeById = jest.fn().mockImplementation(({ id }) => {
        switch (id) {
          case "parentPage___NODE":
            return { ...source, parentPage___NODE: null };
          case "site":
            return {
              menuNavigation___NODE: "menuNavigation___NODE"
            };
          case "menuNavigation___NODE":
            return {
              links___NODE: ["link-1"]
            };
          case "link-1":
            return {
              internal: {
                type: "ContentfulNavigation"
              },
              id: "link-1",
              label: "link-1-label",
              link___NODE: "link-2",
              links___NODE: ["link-3"]
            };
          case "link-2":
            return null;
          case "link-3":
            return {
              internal: {
                type: "ContentfulLink"
              },
              label: "link-3-label",
              linkedPage___NODE: "linked-page-1"
            };
          case "linked-page-1":
            return {
              id: "source"
            };
          default:
            return null;
        }
      });

      expect(await resolvePath(source, null, context)).toEqual([
        {
          id: "link-1",
          label: "link-1-label"
        },
        {
          id: "source",
          label: "link-3-label",
          queryParams: "",
          slug: undefined
        },
        {
          id: "source",
          label: "source-title",
          slug: "source-slug"
        }
      ]);
    });
  });
});
