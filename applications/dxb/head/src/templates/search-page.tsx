import Hero from "@bmi/hero";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import { QUERY_KEY } from "@bmi/search";
import { graphql } from "gatsby";
import React, { useEffect, useMemo, useState, FormEvent } from "react";
import { Filter } from "@bmi/filters";
import Breadcrumbs from "../components/Breadcrumbs";
import ExploreBar from "../components/ExploreBar";
import { generateGetMicroCopy } from "../components/MicroCopy";
import NextBestActions from "../components/NextBestActions";
import Page from "../components/Page";
import ProgressIndicator from "../components/ProgressIndicator";
import SearchBlock from "../components/SearchBlock";
import Scrim from "../components/Scrim";
import { Data as SiteData } from "../components/Site";
import SearchTabPanelProducts, {
  getCount as getProductsCount
} from "../components/SearchTabProducts";
import SearchTabPanelDocuments, {
  getCount as getDocumentsCount
} from "../components/SearchTabDocuments";
import SearchTabPanelPages, {
  getCount as getPagesCount
} from "../components/SearchTabPages";

type Props = {
  // TODO: pageContext is/should be the same for all pages, same type
  pageContext: {
    variantCode?: string;
    siteId: string;
    countryCode: string;
    categoryCode: string; // this is optional?
    pimClassificationCatalogueNamespace: string;
    variantCodeToPathMap: Record<string, string>;
  };
  data: {
    contentfulSite: SiteData;
    allContentfulAssetType: {
      nodes: ReadonlyArray<{
        name: string;
        pimCode: string;
      }>;
    };
    productFilters: ReadonlyArray<Filter>;
  };
};

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  if (process.env.GATSBY_PREVIEW) {
    e.preventDefault();
    alert("You cannot search on the preview environment.");
    return;
  }
};

const SearchPage = ({ pageContext, data }: Props) => {
  const { contentfulSite, allContentfulAssetType, productFilters } = data;
  const params = new URLSearchParams(
    typeof window !== `undefined` ? window.location.search : ""
  );

  const { countryCode, resources } = contentfulSite;
  const getMicroCopy = generateGetMicroCopy(resources.microCopy);
  const defaultTitle = getMicroCopy("searchPage.title");

  const queryString = useMemo(() => {
    if (process.env.GATSBY_PREVIEW) {
      return null;
    }

    return params.get(QUERY_KEY);
  }, [params]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);
  const [tabsLoading, setTabsLoading] = useState({});
  const [areTabsResolved, setAreTabsResolved] = useState(false);
  // NOTE: Kept in state so the page's state determined by initial page load is preserved as tabs' counts may change
  // It should not be possible to arrive at 0 results by interacting with filters
  // but this is an additional precaution as it's not expected.
  const [pageHasResults, setPageHasResults] = useState(false);
  const [results, setResults] = useState<
    Record<
      "products" | "documents" | "pages",
      {
        component: React.ElementType;
        heading: string;
        count?: number;
        hasBeenDisplayed?: boolean;
      }
    >
  >({
    // TODO: Should be as array?
    products: {
      component: SearchTabPanelProducts,
      heading: getMicroCopy("search.tabHeadings.products"),
      count: 0,
      hasBeenDisplayed: false
    },
    documents: {
      component: SearchTabPanelDocuments,
      heading: getMicroCopy("search.tabHeadings.documents"),
      count: 0,
      hasBeenDisplayed: false
    },
    pages: {
      component: SearchTabPanelPages,
      heading: getMicroCopy("search.tabHeadings.pages"),
      count: 0,
      hasBeenDisplayed: false
    }
  });

  const handleTabIsLoading = (tabKey: string, isLoading: boolean) => {
    setTabsLoading({
      ...tabsLoading,
      [tabKey]: isLoading
    });
  };

  useEffect(() => {
    const getCounts = async () => {
      if (!queryString) {
        setPageIsLoading(false);
        return;
      }

      // TODO: Can be put in the config object if arguments are consistent
      const [productsCount, documentsCount, pagesCount] = await Promise.all([
        getProductsCount(queryString),
        getDocumentsCount(queryString),
        getPagesCount(queryString)
      ]);

      const newResults = {
        ...results,
        products: {
          ...results.products,
          count: productsCount
        },
        documents: {
          ...results.documents,
          count: documentsCount
        },
        pages: {
          ...results.pages,
          count: pagesCount
        }
      };

      // Find first one that has some results and set it to display
      for (let tabKey in newResults) {
        const config = newResults[tabKey];
        if (config.count) {
          config.hasBeenDisplayed = true;
          break;
        }
      }

      setResults(newResults);
      setPageHasResults(Object.values(newResults).some(({ count }) => !!count));
      setAreTabsResolved(true);
      setPageIsLoading(false);
    };

    getCounts();
  }, [queryString]);

  const pageTitle = useMemo(() => {
    // If no query, we can't show a title referring to the query
    // if tabs not resolved yet, we can't conclude what will be the result
    if (!queryString || !areTabsResolved) {
      return defaultTitle;
    }

    // Otherwise, the title depends on if there are results.
    if (pageHasResults) {
      return getMicroCopy("searchPage.title.withQuery", { query: queryString });
    } else {
      return getMicroCopy("searchPage.noResultsTitle", { query: queryString });
    }
  }, [queryString, pageHasResults, areTabsResolved]);

  // If any of the tabs are loading
  const tabIsLoading =
    Object.values(tabsLoading).some((isLoading) => isLoading) || pageIsLoading;

  const handleTabChange = (tabKey) => {
    setResults({
      ...results,
      [tabKey]: {
        ...results[tabKey],
        hasBeenDisplayed: true
      }
    });
  };

  const onTabCountChange = (tabKey, count) => {
    const newResults = {
      ...results,
      [tabKey]: {
        ...results[tabKey],
        count
      }
    };

    setResults(newResults);
  };

  const renderTabs = (): React.ReactElement[] => {
    return Object.entries(results)
      .map(([tabKey, data]) => {
        if (!data.count) {
          return null;
        }

        const { component: Component, hasBeenDisplayed } = data;

        return (
          <Tabs.TabPanel
            key={tabKey}
            heading={`${data.heading} (${results[tabKey]?.count || 0})`}
            index={tabKey}
          >
            {hasBeenDisplayed ? (
              <Container>
                <Component
                  queryString={queryString}
                  pageContext={pageContext}
                  onLoadingChange={(isLoading) =>
                    handleTabIsLoading(tabKey, isLoading)
                  }
                  initialFilters={productFilters}
                  extraData={{
                    allContentfulAssetType: allContentfulAssetType.nodes
                  }}
                  onCountChange={(count) => onTabCountChange(tabKey, count)}
                />
              </Container>
            ) : null}
          </Tabs.TabPanel>
        );
      })
      .filter(Boolean);
  };

  const initialTabKey = Object.entries(results).find(
    ([tabKey, config]) => config.count
  )?.[0];

  return (
    <Page
      title={pageTitle}
      pageData={{ breadcrumbs: null, inputBanner: null, seo: null, path: null }}
      siteData={contentfulSite}
      isSearchPage
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
    >
      {tabIsLoading ? (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      ) : null}
      <Hero
        level={3}
        title={pageTitle}
        breadcrumbs={
          <Breadcrumbs data={[{ id: "", label: pageTitle, slug: "search" }]} />
        }
      />
      <Section backgroundColor="white" isSlim>
        <SearchBlock
          buttonText={
            queryString ? getMicroCopy("searchPage.searchText") : defaultTitle
          }
          countryCode={countryCode}
          hasResults={pageHasResults}
          isLoading={tabIsLoading}
          helperText={getMicroCopy("searchPage.helperText")}
          placeholder={getMicroCopy("searchPage.placeholder")}
          query={areTabsResolved ? queryString : ""}
          searchPageSearchTips={resources.searchPageSearchTips}
          searchPageSidebarItems={resources.searchPageSidebarItems}
          handleSubmit={handleSubmit}
        />
      </Section>
      {pageHasResults ? (
        <Tabs
          initialValue={initialTabKey}
          theme="secondary"
          onChange={handleTabChange}
        >
          {renderTabs()}
        </Tabs>
      ) : null}
      {!pageHasResults
        ? resources.searchPageNextBestActions && (
            <NextBestActions data={resources.searchPageNextBestActions} />
          )
        : resources.searchPageExploreBar && (
            <Section backgroundColor="pearl" isSlim>
              <ExploreBar data={resources.searchPageExploreBar} />
            </Section>
          )}
    </Page>
  );
};

export default SearchPage;

export const pageQuery = graphql`
  query SearchPageBySiteId(
    $siteId: String!
    $pimClassificationCatalogueNamespace: String!
  ) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    allContentfulAssetType {
      nodes {
        name
        pimCode
      }
    }
    productFilters(
      pimClassificationCatalogueNamespace: $pimClassificationCatalogueNamespace
      showBrandFilter: true
    ) {
      label
      name
      options {
        label
        value
      }
    }
  }
`;
