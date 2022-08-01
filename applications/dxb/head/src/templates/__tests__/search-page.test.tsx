import { fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import * as SearchTabDocuments from "../../components/SearchTabDocuments";
import * as SearchTabPages from "../../components/SearchTabPages";
import * as SearchTabProducts from "../../components/SearchTabProducts";
import { ConfigProvider } from "../../contexts/ConfigProvider";
import { createMockSiteData } from "../../test/mockSiteData";
import { renderWithRouter } from "../../test/renderWithRouter";
import * as elasticSearch from "../../utils/elasticSearch";
import SearchPage, { Props as SearchPageData } from "../search-page";

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

  it("render correctly", () => {
    const { container, getByTestId, getByText } = renderWithRouter(
      <SearchPage data={data} pageContext={null} />
    );

    // expect(container).toMatchSnapshot();
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector(".Footer")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelector(".Hero")).toBeTruthy();
    expect(container.querySelector(".Breadcrumbs")).toBeTruthy();
    expect(getByText("Home")).toBeTruthy();
    expect(container.querySelector(".content .title").textContent).toBe(
      "MC: searchPage.title"
    );
    expect(
      container.querySelector(".Section.Section--white.Section--slim")
    ).toBeTruthy();
    expect(container.querySelector(".SearchBlock")).toBeTruthy();
    expect(
      container.querySelector("[type='submit'] .MuiButton-label").textContent
    ).toBe("MC: searchPage.title");
    expect(getByText("MC: searchPage.helperText")).toBeTruthy();
    expect(getByText("MC: searchPage.placeholder")).toBeTruthy();
  });

  it("should setup tab if provided in url params", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString&tab=pages"
    });

    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(3);
    const { getByText, container } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.products (2)")).toBeTruthy()
    );
    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.pages (3)")).toBeTruthy()
    );

    expect(
      container
        .querySelector("#tab-products")
        .classList.contains("Mui-selected")
    ).toBeFalsy();
    expect(
      container.querySelector("#tab-pages").classList.contains("Mui-selected")
    ).toBeTruthy();
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
    const { getByText, container } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.products (2)")).toBeTruthy()
    );

    elasticSearchSpy.mockReset();

    fireEvent.click(container.querySelector('input[type="checkbox"]'));

    await waitFor(() =>
      expect((window.history.replaceState as jest.Mock).mock.calls).toEqual([
        [
          null,
          null,
          "/?filters=%5B%7B%22name%22%3A%22filterName%22%2C%22value%22%3A%5B%22filterValue%22%5D%7D%5D&q=queryString"
        ],
        [null, null, "/?q=queryString"]
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
    const { getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.products (2)")).toBeTruthy()
    );

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

    const { getByText, container } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.products (2)")).toBeTruthy()
    );
    expect(getByText("MC: search.tabHeadings.products (2)")).toBeTruthy();
    expect(
      container.querySelector("#tab-pages").classList.contains("Mui-selected")
    ).toBeTruthy();

    elasticSearchSpy.mockReset();

    const filter: HTMLInputElement = container.querySelector(
      'input[type="checkbox"]'
    );
    expect(filter.checked).toBeTruthy();
  });

  it("render search Result correctly", async () => {
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

    const { container, getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    expect(spyOnGetProductsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetDocumentsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetPagesCount).toHaveBeenCalledTimes(1);

    await waitFor(() =>
      expect(getByText("MC: searchPage.title.withQuery")).toBeTruthy()
    );
    // expect(container).toMatchSnapshot();
    expect(container.querySelectorAll(".TabPanel").length).toBe(3);
    expect(getByText("MC: search.tabHeadings.products (3)")).toBeTruthy();
    expect(getByText("MC: search.tabHeadings.documents (2)")).toBeTruthy();
    expect(getByText("MC: search.tabHeadings.pages (1)")).toBeTruthy();
    // expect(elasticSearchSpy).toHaveBeenCalledTimes();
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
    const { container, getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    expect(spyOnGetProductsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetDocumentsCount).toHaveBeenCalledTimes(1);
    expect(spyOnGetPagesCount).toHaveBeenCalledTimes(1);

    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.documents (2)")).toBeTruthy()
    );
    // expect(container).toMatchSnapshot();
    expect(container.querySelectorAll(".TabPanel").length).toBe(2);
    expect(getByText("MC: search.tabHeadings.pages (1)")).toBeTruthy();
  });

  it("show no result text when url has querystring but no result found", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(null);
    const { container, getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: searchPage.noResultsTitle")).toBeTruthy()
    );

    // expect(container).toMatchSnapshot();
    expect(container.querySelector(".Tab")).toBeFalsy();
    expect(container.querySelectorAll(".TabPanel").length).toBe(0);
  });

  it("should switch Tab when click on tab title", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(1);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(1);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(1);
    const { container, getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );
    const documentTabButton = container.querySelector("#tab-documents");

    fireEvent.click(documentTabButton);
    expect(
      container.querySelector(
        "[heading='MC: search.tabHeadings.documents (1)'] .Container"
      )
    ).toBeTruthy();
  });

  it("update result count when filter changed on current tab", async () => {
    locationSpy.mockReturnValue({
      ...window.location,
      search: "q=queryString"
    });
    jest.spyOn(SearchTabProducts, "getCount").mockResolvedValueOnce(2);
    jest.spyOn(SearchTabDocuments, "getCount").mockResolvedValueOnce(null);
    jest.spyOn(SearchTabPages, "getCount").mockResolvedValueOnce(null);
    const { getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.products (2)")).toBeTruthy()
    );

    // expect(container).toMatchSnapshot();

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
    const nextPageButton = getByText("MC: plp.filters.clearAll");

    fireEvent.click(nextPageButton);
    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.products (3)")).toBeTruthy()
    );
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
    const { container, getByText } = renderWithRouter(
      <ConfigProvider configObject={{ isPreviewMode: true }}>
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
    );

    const alertSpy = jest.spyOn(window, "alert");

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );

    const form = container.querySelector(".Search");

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
    const { container, getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    const alertSpy = jest.spyOn(window, "alert");
    delete process.env.GATSBY_PREVIEW;

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );
    const form = container.querySelector(".Search");

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
    const { container, getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    process.env.GATSBY_PREVIEW = "true";

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );

    expect(container.querySelector(".Tab")).toBeFalsy();
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
    const { container, getByText } = renderWithRouter(
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );

    expect(container.querySelector(".Tab")).toBeFalsy();
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
    const { queryByText } = renderWithRouter(
      <SearchPage
        data={newData}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    // expect(container).toMatchSnapshot();
    await waitFor(() =>
      expect(queryByText("searchPageNextBestActionsTitle")).toBeTruthy()
    );
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
    const { queryByText } = renderWithRouter(
      <SearchPage
        data={newData}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode"
        }}
      />
    );

    await waitFor(() =>
      expect(queryByText("searchPageExploreBarTitle")).toBeTruthy()
    );
    // expect(container).toMatchSnapshot();
  });
});
