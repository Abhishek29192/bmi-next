import { getUrlFromPath, resolvePath } from "../path";
import originalGetContentfulData from "../../../../utils/getContentfulData";
import createContentfulLink from "../../types/helpers/ContentfulLinkHelper";
import createContentfulNavigation from "../../types/helpers/ContentfulNavigationHelper";
import creatContentfulParentPage from "../../types/helpers/ContentfulParentPageHelper";
import type { Page as PathPageData } from "../path";

const getContentfulDataMock = jest.fn();
jest.mock("../../../../utils/getContentfulData", () => ({
  __esModule: true,
  default: (...args: Parameters<typeof originalGetContentfulData>) =>
    getContentfulDataMock(...args)
}));

const getContentfulMenuNavigationMock = jest.fn();
jest.mock("../../../../app/fetchers/navigation", () => ({
  __esModule: true,
  getContentfulMenuNavigation: () => getContentfulMenuNavigationMock()
}));

const pageData: PathPageData = {
  title: "Title",
  slug: "page-slug",
  sys: { id: "page-id" },
  parentPage: null
};

afterEach(() => {
  jest.clearAllMocks();
});

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
    it("should return path from page data if no menuNavigation found", async () => {
      getContentfulMenuNavigationMock.mockResolvedValue(null);
      expect(await resolvePath(pageData)).toEqual([
        { id: pageData.sys.id, label: pageData.title, slug: pageData.slug }
      ]);
    });

    it("should return path from source if no links found", async () => {
      getContentfulMenuNavigationMock.mockResolvedValue({
        linksCollection: {
          items: []
        }
      });
      expect(await resolvePath(pageData)).toEqual([
        { id: pageData.sys.id, label: pageData.title, slug: pageData.slug }
      ]);
    });

    it("should resolve path", async () => {
      const link = createContentfulLink({
        linkedPage: {
          __typename: "Page",
          sys: {
            id: pageData.sys.id
          },
          title: "Linked page title",
          slug: "slug",
          parentPage: null
        }
      });
      getContentfulMenuNavigationMock.mockResolvedValue({
        linksCollection: {
          items: [link]
        }
      });

      expect(await resolvePath(pageData)).toEqual([
        {
          id: link.linkedPage!.sys.id,
          label: link.label,
          slug: link.linkedPage!.slug,
          queryParams: link.queryParams
        }
      ]);
    });

    it("should resolve navigation", async () => {
      const link = createContentfulLink({
        linkedPage: {
          __typename: "Page",
          sys: {
            id: pageData.sys.id
          },
          title: "Linked page title",
          slug: "slug",
          parentPage: null
        }
      });

      getContentfulMenuNavigationMock.mockResolvedValue({
        linksCollection: {
          items: [createContentfulNavigation({ link })]
        }
      });

      expect(await resolvePath(pageData)).toEqual([
        {
          id: link.linkedPage!.sys.id,
          label: link.label,
          slug: link.linkedPage!.slug,
          queryParams: link.queryParams
        }
      ]);
    });

    it("should resolve internal navigation", async () => {
      const nestedLink = createContentfulLink({
        linkedPage: {
          __typename: "Page",
          sys: {
            id: pageData.sys.id
          },
          title: "Nested linked page",
          slug: "slug",
          parentPage: null
        }
      });
      const navigation = createContentfulNavigation({
        link: null,
        linksCollection: {
          items: [nestedLink]
        }
      });

      getContentfulMenuNavigationMock.mockResolvedValue({
        linksCollection: {
          items: [navigation]
        }
      });

      expect(await resolvePath(pageData)).toEqual([
        {
          id: navigation.sys.id,
          label: navigation.label
        },
        {
          id: nestedLink.linkedPage!.sys.id,
          label: nestedLink.label,
          slug: nestedLink.linkedPage!.slug,
          queryParams: nestedLink.queryParams
        }
      ]);
    });

    it("should resolve node from parent page", async () => {
      const parentPage = creatContentfulParentPage({ parentPage: null });
      getContentfulDataMock.mockReturnValue({
        data: { entryCollection: { items: [parentPage] } }
      });

      expect(await resolvePath({ ...pageData, parentPage })).toEqual([
        {
          id: parentPage.sys.id,
          label: parentPage.title,
          slug: parentPage.slug
        },
        {
          id: pageData.sys.id,
          label: pageData.title,
          slug: pageData.slug
        }
      ]);
    });

    it("should resolve node from parent page if it has its own parent page", async () => {
      const nestedParentPage = creatContentfulParentPage({
        sys: {
          id: "parent-page-2-id"
        },
        title: "Parent page title 2",
        slug: "parent-2-page-slug",
        parentPage: null
      });
      const parentPage = creatContentfulParentPage({
        sys: {
          id: "parent-page-1-id"
        },
        title: "Parent page title 1",
        slug: "parent-1-page-slug",
        parentPage: nestedParentPage
      });
      getContentfulDataMock
        .mockResolvedValueOnce({
          data: { entryCollection: { items: [parentPage] } }
        })
        .mockResolvedValueOnce({
          data: { entryCollection: { items: [nestedParentPage] } }
        });

      expect(await resolvePath({ ...pageData, parentPage })).toEqual([
        {
          id: nestedParentPage.sys.id,
          label: nestedParentPage.title,
          slug: nestedParentPage.slug
        },
        {
          id: parentPage.sys.id,
          label: parentPage.title,
          slug: parentPage.slug
        },
        {
          id: pageData.sys.id,
          label: pageData.title,
          slug: pageData.slug
        }
      ]);
    });
  });

  it("should throw an error if getContentfulData fails", async () => {
    const parentPage = creatContentfulParentPage({ parentPage: null });
    const error = new Error("getContentfulDataMock failed");
    getContentfulDataMock.mockRejectedValue(error);

    await expect(resolvePath({ ...pageData, parentPage })).rejects.toThrow(
      error
    );
  });

  it("should throw an error if creatContentfulParentPage returns an array of errors", async () => {
    const parentPage = creatContentfulParentPage({ parentPage: null });
    const errors = ["error-1", "error-2"];
    getContentfulDataMock.mockResolvedValue({ errors });

    await expect(resolvePath({ ...pageData, parentPage })).rejects.toThrow(
      JSON.stringify(errors)
    );
  });

  it("should return only page basic data if creatContentfulParentPage does not return a page", async () => {
    const parentPage = creatContentfulParentPage({ parentPage: null });
    getContentfulDataMock.mockResolvedValue({
      data: { entryCollection: { items: [] } }
    });

    expect(await resolvePath({ ...pageData, parentPage })).toEqual([
      {
        id: pageData.sys.id,
        label: pageData.title,
        slug: pageData.slug
      }
    ]);
  });
});
