import React from "react";
import { fireEvent, waitFor } from "@testing-library/react";
import { renderWithRouter } from "../../test/renderWithRouter";
import SearchPage, { Props as SearchPageData } from "../search-page";
import { createMockSiteData } from "../../test/mockSiteData";
import * as SearchTabProducts from "../../components/SearchTabProducts";
import * as SearchTabDocuments from "../../components/SearchTabDocuments";
import * as SearchTabPages from "../../components/SearchTabPages";
import * as elasticSearch from "../../utils/elasticSearch";

describe("Search Page Template", () => {
  const contentfulAsset = {
    name: "asset1",
    pimCode: "pimCode"
  };
  const filter = {
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
    productFilters: [filter]
  };
  const locationSpy = jest.spyOn(window, "location", "get");
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.env = OLD_ENV;
  });

  it("render correctly", () => {
    const { container, getByTestId, getByText } = renderWithRouter(
      <SearchPage data={data} pageContext={null} />
    );

    // expect(container).toMatchSnapshot();
    expect(container.querySelector("header")).toBeTruthy();
    expect(container.querySelector("[class^='Footer']")).toBeTruthy();
    expect(getByTestId("brand-colors-provider")).toBeTruthy();
    expect(container.querySelector("[class^='Hero']")).toBeTruthy();
    expect(container.querySelector("[class^='Breadcrumbs']")).toBeTruthy();
    expect(getByText("Home")).toBeTruthy();
    expect(
      container.querySelector(
        "[class^='Hero-module_content'] [class*='Hero-module_title']"
      ).textContent
    ).toBe("MC: searchPage.title");
    expect(
      container.querySelector(
        "[class*='Section-module_Section'][class*='Section-module_Section--white'][class*='Section-module_Section--slim']"
      )
    ).toBeTruthy();
    expect(container.querySelector(".SearchBlock")).toBeTruthy();
    expect(
      container.querySelector("[type='submit'] .MuiButton-label").textContent
    ).toBe("MC: searchPage.title");
    expect(getByText("MC: searchPage.helperText")).toBeTruthy();
    expect(getByText("MC: searchPage.placeholder")).toBeTruthy();
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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
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
    expect(
      container.querySelectorAll("[class*='Tabs-module_TabPanel_']").length
    ).toBe(3);
    expect(getByText("MC: search.tabHeadings.products (3)")).toBeTruthy();
    expect(getByText("MC: search.tabHeadings.documents (2)")).toBeTruthy();
    expect(getByText("MC: search.tabHeadings.pages (1)")).toBeTruthy();
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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
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
    expect(
      container.querySelectorAll("[class*='Tabs-module_TabPanel_']").length
    ).toBe(2);
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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
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
        "[heading='MC: search.tabHeadings.documents (1)'] [class*='Container-module_Container_']"
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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
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
          hits: []
        },
        aggregations: {
          total: { value: 1 },
          unique_base_products_count: { value: 3 }
        }
      });
    const nextPageButton = getByText("MC: plp.filters.clearAll");

    fireEvent.click(nextPageButton);
    await waitFor(() =>
      expect(getByText("MC: search.tabHeadings.products (3)")).toBeTruthy()
    );
    expect(elasticSearchSpy).toBeCalledTimes(1);
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
      <SearchPage
        data={data}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
        }}
      />
    );

    const alertSpy = jest.spyOn(window, "alert");
    process.env.GATSBY_PREVIEW = "true";

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );

    const form = container.querySelector("[class^='Search']");

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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
        }}
      />
    );

    const alertSpy = jest.spyOn(window, "alert");
    delete process.env.GATSBY_PREVIEW;

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );
    const form = container.querySelector("[class^='Search']");

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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
        }}
      />
    );

    await waitFor(() =>
      expect(getByText("MC: searchPage.helperText")).toBeTruthy()
    );

    expect(container.querySelector(".Tab")).toBeFalsy();
  });

  it("render searchPageNextBestActions if searchPageNextBestActions exists", () => {
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
    const { queryByText } = renderWithRouter(
      <SearchPage
        data={newData}
        pageContext={{
          variantCodeToPathMap: null,
          siteId: "siteId",
          countryCode: "en",
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
        }}
      />
    );

    // expect(container).toMatchSnapshot();
    expect(queryByText("searchPageNextBestActionsTitle")).toBeTruthy();
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
          categoryCode: "categoryCode",
          pimClassificationCatalogueNamespace: "nameSpace"
        }}
      />
    );

    await waitFor(() =>
      expect(queryByText("searchPageExploreBarTitle")).toBeTruthy()
    );
    // expect(container).toMatchSnapshot();
  });
});
