import * as all from "@bmi-digital/components";
import { ThemeProvider } from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within
} from "@testing-library/react";
import React from "react";
import * as SearchTabDocuments from "../../components/SearchTabDocuments";
import * as SearchTabPages from "../../components/SearchTabPages";
import * as SearchTabProducts from "../../components/SearchTabProducts";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import { createMockSiteData } from "../../test/mockSiteData";
import {
  renderToStaticMarkupWithRouter,
  renderWithRouter
} from "../../test/renderWithRouter";
import * as elasticSearch from "../../utils/elasticSearch";
import SearchPage, { Props as SearchPageData } from "../search-page";

const useClientSpy = jest.spyOn(all, "useIsClient");
useClientSpy.mockImplementation(() => ({ isClient: true, key: "" }));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn()
}));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;
// by default render search page in desktop view
mockUseMediaQuery.mockReturnValue(true);

beforeEach(() => {
  jest.resetModules();
});

describe("Search Page Template", () => {
  const contentfulAsset = {
    name: "asset1",
    pimCode: "pimCode"
  };
  const filter = {
    filterCode: "filterName",
    label: "filterLabel",
    name: "filterName",
    options: [
      {
        label: "label",
        value: "filterValue",
        isDisabled: false
      }
    ]
  };
  const data: SearchPageData["data"] = {
    contentfulSite: createMockSiteData(),
    allContentfulAssetType: { nodes: [contentfulAsset] },
    searchFilters: { filters: [filter], allowFilterBy: [] }
  };
  const locationSpy = jest.spyOn(window, "location", "get");

  jest.setTimeout(15000);

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("render correctly", async () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <SearchPage data={data} pageContext={null} />
      </ThemeProvider>
    );

    expect(container).toMatchSnapshot();
  });

  it("should setup tab if provided in url params", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString&tab=pages"
    });

    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(3);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    expect(
      await screen.findByText("MC: search.tabHeadings.products (2)")
    ).toBeInTheDocument();
    expect(
      await screen.findByText("MC: search.tabHeadings.pages (3)")
    ).toBeInTheDocument();

    expect(screen.getByTestId("tab-products")).not.toHaveClass("Mui-selected");
    expect(screen.getByTestId("tab-pages")).toHaveClass("Mui-selected");
  });

  it("should setup url filters for products if provided in url params", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search:
        'q=queryString&filters=%5B%7B"name"%3A"filterName"%2C"value"%3A%5B"filterValue"%5D%7D%5D'
    });

    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(null);

    const elasticSearchSpy = jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValue({
        hits: {
          hits: [],
          total: { value: 2 }
        },
        aggregations: {
          unique_base_products_count: { value: 2 },
          filterName: {
            buckets: [{ key: "filterValue", doc_count: 2 }]
          }
        }
      });

    window.history.replaceState = jest.fn();
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    await screen.findByText("MC: search.tabHeadings.products (2)");

    elasticSearchSpy.mockReset();

    fireEvent.click(screen.getByTestId("filter-checkbox"));

    // eslint-disable-next-line testing-library/no-node-access -- can't add test ID to checkbox and as hidden, role won't find it
    const filterCheckbox = screen.getByTestId("filter-checkbox").firstChild;
    expect(filterCheckbox).toHaveAttribute("name", "filterValue");
    expect(filterCheckbox).toHaveAttribute("checked");

    await waitFor(() =>
      expect((window.history.replaceState as jest.Mock).mock.calls).toEqual([
        [
          null,
          null,
          "/?filters=%5B%7B%22name%22%3A%22filterName%22%2C%22value%22%3A%5B%22filterValue%22%5D%7D%5D&q=queryString"
        ]
        // [null, null, "/?q=queryString"]
      ])
    );
  });

  it("should reset url filters if invalid", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search:
        'q=queryString&filters=%5B%7B"name"%3A"filterName"%2C"value"%3A%5B"filterValue"'
    });

    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(null);

    const elasticSearchSpy = jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValue({
        hits: {
          hits: [],
          total: { value: 2 }
        },
        aggregations: {
          unique_base_products_count: { value: 2 },
          allCategories: {
            buckets: [{ key: "filterValue", doc_count: 2 }]
          }
        }
      });

    window.history.replaceState = jest.fn();
    const consoleSpy = jest.spyOn(console, "error");
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    await screen.findByText("MC: search.tabHeadings.products (2)");

    expect(consoleSpy.mock.calls).toContainEqual(["Filters can not be parsed"]);
    expect(window.history.replaceState).toBeCalledWith(
      null,
      null,
      "/?q=queryString"
    );

    elasticSearchSpy.mockReset();
  });

  it("should setup url filters for pages if provided in url params", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search:
        'q=queryString&filters=%5B%7B"name"%3A"filterName"%2C"value"%3A%5B"filterValue"%5D%7D%5D&tab=pages&tab=products'
    });

    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(2);

    const elasticSearchSpy = jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValue({
        hits: {
          hits: [],
          total: { value: 2 }
        },
        aggregations: {
          unique_base_products_count: { value: 2 },
          filterName: {
            buckets: [{ key: "filterValue", doc_count: 2 }]
          },
          tags: {
            buckets: []
          }
        }
      });

    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    expect(
      await screen.findByText("MC: search.tabHeadings.products (2)")
    ).toBeTruthy();
    expect(screen.getByTestId("tab-pages")).toHaveClass("Mui-selected");

    elasticSearchSpy.mockReset();

    const filter = screen.getByTestId("filter-checkbox");
    fireEvent.click(filter);

    // eslint-disable-next-line testing-library/no-node-access -- can't add test ID to checkbox and as hidden, role won't find it
    const filterCheckbox = screen.getByTestId("filter-checkbox").firstChild;
    expect(filterCheckbox).toHaveAttribute("name", "filterValue");
    expect(filterCheckbox).toHaveAttribute("checked", "");
  });

  it("render search Result correctly and hides search button from header on desktop view", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    const spyOnGetProductsCount = jest
      .spyOn(SearchTabProducts, "getCount")
      .mockResolvedValueOnce(3);
    const spyOnGetDocumentsCount = jest
      .spyOn(SearchTabDocuments, "getCount")
      .mockResolvedValueOnce(2);
    const spyOnGetPagesCount = jest
      .spyOn(SearchTabPages, "getCount")
      .mockResolvedValueOnce("1");

    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    expect(spyOnGetProductsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetDocumentsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetPagesCount).toHaveBeenCalledTimes(1);

    expect(
      await screen.findByRole("heading", {
        name: "MC: searchPage.title.withQuery"
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("MC: search.tabHeadings.products (3)")
    ).toBeTruthy();
    expect(
      screen.getByText("MC: search.tabHeadings.documents (2)")
    ).toBeTruthy();
    expect(screen.getByText("MC: search.tabHeadings.pages (1)")).toBeTruthy();

    const topNavigationBarButtons = screen.getByTestId("navigationBar-buttons");
    // top navigation bar with buttons is present in the document
    expect(topNavigationBarButtons).toBeInTheDocument();
    // header search icon is not present on the top navigation bar
    expect(
      within(topNavigationBarButtons).queryByTestId("search-button")
    ).not.toBeInTheDocument();
  });

  it("render search Result correctly and shows search button on Small Screens", async () => {
    mockUseMediaQuery.mockReturnValue(false);
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    const spyOnGetProductsCount = jest
      .spyOn(SearchTabProducts, "getCount")
      .mockResolvedValueOnce(3);
    const spyOnGetDocumentsCount = jest
      .spyOn(SearchTabDocuments, "getCount")
      .mockResolvedValueOnce(2);
    const spyOnGetPagesCount = jest
      .spyOn(SearchTabPages, "getCount")
      .mockResolvedValueOnce("1");

    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    expect(spyOnGetProductsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetDocumentsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetPagesCount).toHaveBeenCalledTimes(1);

    expect(
      await screen.findByRole("heading", {
        name: "MC: searchPage.title.withQuery"
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("MC: search.tabHeadings.products (3)")
    ).toBeTruthy();
    expect(
      screen.getByText("MC: search.tabHeadings.documents (2)")
    ).toBeTruthy();
    expect(screen.getByText("MC: search.tabHeadings.pages (1)")).toBeTruthy();

    const topNavigationBarButtons = screen.getByTestId("navigationBar-buttons");
    // top navigation bar with search icon button is present in the document
    expect(topNavigationBarButtons).toBeInTheDocument();
    // header search icon is also present on the top navigation bar
    expect(
      within(topNavigationBarButtons).getByTestId("search-button")
    ).toBeInTheDocument();
  });

  it("should not render tab when result count is null", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    const spyOnGetProductsCount = jest
      .spyOn(SearchTabProducts, "getCount")
      .mockResolvedValueOnce(null);
    const spyOnGetDocumentsCount = jest
      .spyOn(SearchTabDocuments, "getCount")
      .mockResolvedValueOnce(2);
    const spyOnGetPagesCount = jest
      .spyOn(SearchTabPages, "getCount")
      .mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    expect(spyOnGetProductsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetDocumentsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetPagesCount).toHaveBeenCalledTimes(1);

    await screen.findByText("MC: search.tabHeadings.documents (2)");
    expect(screen.getByText("MC: search.tabHeadings.pages (1)")).toBeTruthy();
    expect(screen.queryByTestId("tabpanel-products")).not.toBeInTheDocument();
  });

  it("show no result text when url has querystring but no result found", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(null);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    expect(
      await screen.findByRole("heading", {
        name: "MC: searchPage.noResultsTitle"
      })
    ).toBeInTheDocument();

    expect(screen.queryByTestId("tabpanel-products")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-documents")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-pages")).not.toBeInTheDocument();
  });

  it("should switch Tab when click on tab title", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(1);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(1);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    await screen.findByText("MC: searchPage.helperText");
    const documentTabButton = await screen.findByTestId("tab-documents");

    fireEvent.click(documentTabButton);
    expect(
      await screen.findByTestId("container-documents")
    ).toBeInTheDocument();
  });

  it("update result count when filter changed on current tab", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(null);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    await screen.findByText("MC: search.tabHeadings.products (2)");

    const elasticSearchSpy = jest
      .spyOn(elasticSearch, "queryElasticSearch")
      .mockResolvedValueOnce({
        hits: {
          hits: [],
          total: { value: 20 }
        },
        aggregations: {
          total: { value: 1 },
          unique_base_products_count: { value: 3 },
          assetTypes: { buckets: [] },
          tags: {
            buckets: []
          }
        }
      });
    const nextPageButton = screen.getByText("MC: plp.filters.clearAll");

    fireEvent.click(nextPageButton);
    await screen.findByText("MC: search.tabHeadings.products (3)");
    expect(elasticSearchSpy).toBeCalledTimes(2);
  });

  it("run handleSubmit and return message correctly when GATSBY_PREVIEW exists", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <ConfigProvider configOverride={{ isPreviewMode: true }}>
          <SearchPage
            data={data}
            pageContext={{
              variantCodeToPathMap: null,
              siteId: "siteId",
              countryCode: "en",
              categoryCode: "categoryCode"
            }}
          />
        </ConfigProvider>
      </ThemeProvider>
    );

    const alertSpy = jest.spyOn(window, "alert");

    await screen.findByText("MC: searchPage.helperText");

    const form = screen.getByTestId("search-form");

    fireEvent.submit(form);
    expect(alertSpy).toHaveBeenCalledWith(
      "You cannot search on the preview environment."
    );
  });

  it("run handleSubmit and do nothing when GATSBY_PREVIEW does not exist", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    const alertSpy = jest.spyOn(window, "alert");
    delete process.env.GATSBY_PREVIEW;

    await screen.findByText("MC: searchPage.helperText");
    const form = screen.getByTestId("search-form");

    fireEvent.submit(form);
    expect(alertSpy).toHaveBeenCalledTimes(0);
  });

  it("should not render result when GATSBY_PREVIEW is true", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <ConfigProvider configOverride={{ isPreviewMode: true }}>
          <SearchPage
            data={data}
            pageContext={{
              variantCodeToPathMap: null,
              siteId: "siteId",
              countryCode: "en",
              categoryCode: "categoryCode"
            }}
          />
        </ConfigProvider>
      </ThemeProvider>
    );

    await screen.findByText("MC: searchPage.helperText");

    expect(screen.queryByTestId("tabpanel-products")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-documents")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-pages")).not.toBeInTheDocument();
  });

  it("should not render result when window is not defined", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    const windowSpy = jest.spyOn(global, "window", "get");
    windowSpy.mockImplementationOnce(() => undefined);
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(1);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(1);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    const { view } = renderToStaticMarkupWithRouter(
      <ThemeProvider>
        <SearchPage
          data={data}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    // Have to render it so we can use a selector later
    render(<div dangerouslySetInnerHTML={{ __html: view }} />);

    await screen.findByText("MC: searchPage.helperText");

    expect(screen.queryByTestId("tabpanel-products")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-documents")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-pages")).not.toBeInTheDocument();
  });

  it("render searchPageNextBestActions if searchPageNextBestActions exists", async () => {
    const newData = { ...data };
    newData.contentfulSite.resources.searchPageNextBestActions = [
      {
        __typename: "ContentfulPromo",
        id: "id",
        title: "searchPageNextBestActionsTitle",
        subtitle: null,
        name: "name",
        body: null,
        brandLogo: null,
        tags: null,
        featuredMedia: null,
        cta: null,
        featuredVideo: null,
        backgroundColor: null
      }
    ];
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q="
    });
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={newData}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    await screen.findByText("searchPageNextBestActionsTitle");
  });

  it("render searchPageExploreBar if searchPageExploreBar exists", async () => {
    const newData = { ...data };
    newData.contentfulSite.resources.searchPageExploreBar = {
      label: "searchPageExploreBarTitle",
      links: []
    };
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage
          data={newData}
          pageContext={{
            variantCodeToPathMap: null,
            siteId: "siteId",
            countryCode: "en",
            categoryCode: "categoryCode"
          }}
        />
      </ThemeProvider>
    );

    await screen.findByText("searchPageExploreBarTitle");
  });
});
