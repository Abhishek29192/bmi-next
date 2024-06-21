import * as hooks from "@bmi-digital/components/hooks";
import ThemeProvider from "@bmi-digital/components/theme-provider";
import useMediaQuery from "@mui/material/useMediaQuery";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import React from "react";
import createLinkData from "../../__tests__/helpers/LinkHelper";
import * as SearchTabDocuments from "../../components/SearchTabDocuments";
import * as SearchTabPages from "../../components/SearchTabPages";
import * as SearchTabProducts from "../../components/SearchTabProducts";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import * as elasticSearch from "../../utils/elasticSearch";
import SearchPage, { Props } from "../search-page";
import createPromoData from "../../__tests__/helpers/PromoHelper";
import type { Data as Resources } from "../../components/Resources";

jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn()
}));

const useClientSpy = jest.spyOn(hooks, "useIsClient");
useClientSpy.mockImplementation(() => ({ isClient: true, key: "" }));

const mockUseMediaQuery = useMediaQuery as jest.Mock<
  ReturnType<typeof useMediaQuery>
>;
// by default render search page in desktop view
mockUseMediaQuery.mockReturnValue(true);

const mockContentfulSite = createMockSiteData();

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

const props: Props = {
  data: {
    contentfulSite: mockContentfulSite,
    allContentfulAssetType: {
      nodes: [
        {
          name: "asset1",
          pimCode: "pimCode"
        }
      ]
    },
    searchFilters: { filters: [filter], allowFilterBy: [] }
  },
  pageContext: {
    siteId: "someId",
    countryCode: "no",
    categoryCode: "category"
  }
};

beforeEach(() => {
  jest.resetModules();
});

describe("Search Page Template", () => {
  const locationSpy = jest.spyOn(window, "location", "get");

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("render correctly", async () => {
    const { container } = renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} />
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
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(3);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} />
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
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(0);

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
        <SearchPage {...props} />
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
          "",
          "/?filters=%5B%7B%22name%22%3A%22filterName%22%2C%22value%22%3A%5B%22filterValue%22%5D%7D%5D&q=queryString"
        ]
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
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(0);

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
        <SearchPage {...props} />
      </ThemeProvider>
    );

    await screen.findByText("MC: search.tabHeadings.products (2)");

    expect(consoleSpy.mock.calls).toContainEqual(["Filters can not be parsed"]);
    expect(window.history.replaceState).toBeCalledWith(
      null,
      "",
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
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(0);
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
        <SearchPage {...props} />
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
        <SearchPage {...props} />
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
        <SearchPage {...props} />
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

  it("should not render tab when result count is zero", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    const spyOnGetProductsCount = jest
      .spyOn(SearchTabProducts, "getCount")
      .mockResolvedValueOnce(0);
    const spyOnGetDocumentsCount = jest
      .spyOn(SearchTabDocuments, "getCount")
      .mockResolvedValueOnce(2);
    const spyOnGetPagesCount = jest
      .spyOn(SearchTabPages, "getCount")
      .mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} />
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
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(0);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} />
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
        <SearchPage {...props} />
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
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(0);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} />
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
    expect(elasticSearchSpy).toHaveBeenCalledTimes(2);
  });

  it("run handleSubmit and return message correctly when GATSBY_PREVIEW exists", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <ConfigProvider configOverride={{ isPreviewMode: true }}>
          <SearchPage {...props} />
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
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} />
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
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <ConfigProvider configOverride={{ isPreviewMode: true }}>
          <SearchPage {...props} />
        </ConfigProvider>
      </ThemeProvider>
    );

    await screen.findByText("MC: searchPage.helperText");

    expect(screen.queryByTestId("tabpanel-products")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-documents")).not.toBeInTheDocument();
    expect(screen.queryByTestId("tabpanel-pages")).not.toBeInTheDocument();
  });

  it("render searchPageNextBestActions if searchPageNextBestActions exists", async () => {
    const { data } = props;

    const resources = {
      ...mockContentfulSite.resources,
      searchPageNextBestActions: [createPromoData()]
    } as Resources;

    const newData: Props["data"] = {
      ...data,
      contentfulSite: {
        ...mockContentfulSite,
        resources
      }
    };

    locationSpy.mockReturnValue({
      ...window.location,
      search: "q="
    });

    renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} data={newData} />
      </ThemeProvider>
    );

    expect(screen.getByTestId("next-best-actions-section")).toBeInTheDocument();
  });

  it("render searchPageExploreBar if searchPageExploreBar exists", async () => {
    const { data } = props;

    const resources = {
      ...mockContentfulSite.resources,
      searchPageExploreBar: {
        label: "searchPageExploreBarTitle",
        links: [createLinkData()]
      }
    } as Resources;

    const newData: Props["data"] = {
      ...data,
      contentfulSite: {
        ...mockContentfulSite,
        resources
      }
    };

    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(0);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    renderWithRouter(
      <ThemeProvider>
        <SearchPage {...props} data={newData} />
      </ThemeProvider>
    );

    expect(
      screen.getByTestId("section-search-block-explorer-bar")
    ).toBeInTheDocument();
  });
});
