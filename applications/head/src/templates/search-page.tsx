import Hero from "@bmi/hero";
import Container from "@bmi/container";
import Section from "@bmi/section";
import Tabs from "@bmi/tabs";
import { QUERY_KEY } from "@bmi/search";
import { graphql } from "gatsby";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import ExploreBar from "../components/ExploreBar";
import { generateGetMicroCopy } from "../components/MicroCopy";
import NextBestActions from "../components/NextBestActions";
import Page from "../components/Page";
import ProgressIndicator from "../components/ProgressIndicator";
import SearchBlock, { QueryInput } from "../components/SearchBlock";
import Scrim from "../components/Scrim";
import { Data as SiteData } from "../components/Site";
// TODO: Move type away from a page
import { Product } from "./product-details-page";
import { getFilters } from "../utils/filters";
import SearchTabPanelProducts, {
  getCount as getProductsCount
} from "../components/SearchTabProducts";
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
  };
  data: {
    contentfulSite: SiteData;
    allProducts: {
      nodes: ReadonlyArray<Product>;
    };
  };
};

const SearchPage = ({ pageContext, data }: Props) => {
  const { contentfulSite } = data;
  const params = new URLSearchParams(
    typeof window !== `undefined` ? window.location.search : ""
  );

  const { countryCode, menuNavigation, resources } = contentfulSite;
  const getMicroCopy = generateGetMicroCopy(resources.microCopy);
  const defaultTitle = getMicroCopy("searchPage.title");

  // TODO: rename to queryString or searchQuery to be clearer?
  const [query, setQuery] = useState<QueryInput>(params.get(QUERY_KEY));
  const [tabsLoading, setTabsLoading] = useState({});
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
      component: PlaceholderContent,
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
      if (!query) {
        return;
      }

      // TODO: Can be put in the config object if arguments are consistent
      const [productsCount, pagesCount] = await Promise.all([
        getProductsCount(query),
        getPagesCount(query)
      ]);

      const newResults = {
        ...results,
        products: {
          ...results.products,
          count: productsCount
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
    };

    getCounts();
  }, [query]);

  const hasResults =
    Object.values(results).reduce((sum, { count }) => sum + count, 0) > 0;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
    values: Record<typeof QUERY_KEY, QueryInput>
  ) => {
    event.preventDefault();
    params.set(QUERY_KEY, values[QUERY_KEY]);
    setQuery(values[QUERY_KEY]);
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params}`
    );
    // Reset as if the page is loaded fresh
    // It feels a little flaky, i'm sure can have a better approach
    isInitialLoad.current = true;
  };

  const pageTitle = useMemo(() => {
    // If no query, we can't show a title referring to the query
    if (!query) {
      return defaultTitle;
    }

    // Otherwise, the title depends on if there are results.
    if (hasResults) {
      return getMicroCopy("searchPage.title.withQuery", { query });
    } else {
      return getMicroCopy("searchPage.noResultsTitle", { query });
    }
  }, [query, hasResults]);

  const isInitialLoad = useRef(true);

  const initialFilters = getFilters(
    pageContext.pimClassificationCatalogueNamespace,
    // Don't really like this as it seems like too much computation for the page
    data.allProducts.nodes
  );

  // If any of the tabs are loading
  const tabIsLoading = Object.values(tabsLoading).some(
    (isLoading) => isLoading
  );

  const handleTabChange = (tabKey) => {
    setResults({
      ...results,
      [tabKey]: {
        ...results[tabKey],
        hasBeenDisplayed: true
      }
    });
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
                  queryString={query}
                  pageContext={pageContext}
                  onLoadingChange={(isLoading) =>
                    handleTabIsLoading(tabKey, isLoading)
                  }
                  initialFilters={initialFilters}
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
      pageData={{ slug: "search", inputBanner: null }}
      siteData={contentfulSite}
      isSearchPage
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
          <Breadcrumbs
            data={{ title: pageTitle, parentPage: null, slug: "search" }}
          />
        }
      />
      <SearchBlock
        buttonText={
          query ? getMicroCopy("searchPage.searchText") : defaultTitle
        }
        countryCode={countryCode}
        handleSubmit={handleSubmit}
        hasResults={hasResults}
        helperText={getMicroCopy("searchPage.helperText")}
        placeholder={getMicroCopy("searchPage.placeholder")}
        query={query}
        searchPageSearchTips={resources.searchPageSearchTips}
        searchPageSidebarItems={resources.searchPageSidebarItems}
      />
      {hasResults ? (
        <Tabs
          initialValue={initialTabKey}
          theme="secondary"
          onChange={handleTabChange}
        >
          {renderTabs()}
        </Tabs>
      ) : null}
      {!hasResults
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
  query SearchPageBySiteId($siteId: String!) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    allProducts {
      nodes {
        name
        code
        categories {
          categoryType
          code
          name
          parentCategoryCode
        }
        images {
          assetType
          containerId
          url
          format
        }
        classifications {
          name
          code
          features {
            name
            code
            featureValues {
              value
              code
            }
            featureUnit {
              symbol
            }
          }
        }
        variantOptions {
          code
          shortDescription
          images {
            assetType
            containerId
            url
            format
          }
          classifications {
            name
            code
            features {
              name
              code
              featureValues {
                value
                code
              }
              featureUnit {
                symbol
              }
            }
          }
        }
      }
    }
  }
`;
