import Container from "@bmi-digital/components/container";
import { PLPFilterResponse } from "@bmi-digital/components/filters";
import Hero from "@bmi-digital/components/hero";
import { useIsClient } from "@bmi-digital/components/hooks";
import Article from "@bmi-digital/components/icon/Article";
import Folder from "@bmi-digital/components/icon/Folder";
import Tile from "@bmi-digital/components/icon/Tile";
import { QUERY_KEY } from "@bmi-digital/components/search";
import Section from "@bmi-digital/components/section";
import Tabs from "@bmi-digital/components/tabs";
import { microCopy } from "@bmi/microcopies";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { graphql } from "gatsby";
import Breadcrumbs from "../components/Breadcrumbs";
import ExploreBar from "../components/ExploreBar";
import { generateGetMicroCopy } from "../components/MicroCopy";
import Page from "../components/Page";
import ProgressIndicator from "../components/ProgressIndicator";
import Scrim from "../components/Scrim";
import SearchBlock from "../components/SearchBlock";
import SearchTabPanelDocuments, {
  getCount as getDocumentsCount
} from "../components/SearchTabDocuments";
import SearchTabPanelPages, {
  getCount as getPagesCount
} from "../components/SearchTabPages";
import SearchTabPanelProducts, {
  getCount as getProductsCount
} from "../components/SearchTabProducts";
import { Data as SiteData } from "../components/Site";
import NextBestActions from "../components/next-best-actions/NextBestActions";
import { useConfig } from "../contexts/ConfigProvider";
import { getSearchTabUrl, setSearchTabUrl } from "../utils/filters";

export type PageContext = {
  variantCode?: string;
  siteId: string;
  countryCode: string;
  categoryCode: string; // this is optional?
  variantCodeToPathMap?: Record<string, string>;
};

type ResultType = "products" | "documents" | "pages";

type Results = Record<
  ResultType,
  {
    component: React.ElementType;
    heading: string;
    count?: number;
    hasBeenDisplayed?: boolean;
    icon?: React.ReactNode;
  }
>;

export type Props = {
  // TODO: pageContext is/should be the same for all pages, same type
  pageContext: PageContext;
  data: {
    contentfulSite: SiteData;
    allContentfulAssetType: {
      nodes: ReadonlyArray<{
        name: string;
        pimCode: string;
      }>;
    };
    searchFilters: PLPFilterResponse;
  };
};

const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  alert("You cannot search on the preview environment.");
  return;
};

const SearchPage = ({ pageContext, data }: Props) => {
  const { contentfulSite, allContentfulAssetType, searchFilters } = data;
  const { isPreviewMode } = useConfig();
  const { isClient } = useIsClient();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const params = useMemo(() => {
    return new URLSearchParams(
      isClient && window ? window.location.search : ""
    );
  }, [isClient]);

  const { countryCode, resources } = contentfulSite;
  const getMicroCopy = generateGetMicroCopy(resources?.microCopy);
  const defaultTitle = getMicroCopy(microCopy.SEARCH_PAGE_TITLE);

  const queryString = useMemo(() => {
    if (isPreviewMode) {
      return null;
    }

    return params.get(QUERY_KEY);
  }, [isPreviewMode, params]);
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(true);
  const [tabsLoading, setTabsLoading] = useState({});
  const [areTabsResolved, setAreTabsResolved] = useState(false);
  // NOTE: Kept in state so the page's state determined by initial page load is preserved as tabs' counts may change
  // It should not be possible to arrive at 0 results by interacting with filters
  // but this is an additional precaution as it's not expected.
  const [pageHasResults, setPageHasResults] = useState(false);
  const [results, setResults] = useState<Results>({
    // TODO: Should be as array?
    products: {
      component: SearchTabPanelProducts,
      heading: getMicroCopy(microCopy.SEARCH_TAB_HEADINGS_PRODUCTS),
      count: 0,
      hasBeenDisplayed: false,
      icon: <Tile />
    },
    documents: {
      component: SearchTabPanelDocuments,
      heading: getMicroCopy(microCopy.SEARCH_TAB_HEADINGS_DOCUMENTS),
      count: 0,
      hasBeenDisplayed: false,
      icon: <Folder />
    },
    pages: {
      component: SearchTabPanelPages,
      heading: getMicroCopy(microCopy.SEARCH_TAB_HEADINGS_PAGES),
      count: 0,
      hasBeenDisplayed: false,
      icon: <Article />
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

      const newResults: Results = {
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
      for (const tabKey in newResults) {
        const config = newResults[tabKey as ResultType];
        if (config.count) {
          config.hasBeenDisplayed = true;
          break;
        }
      }

      const urlTabKey = getSearchTabUrl();
      if (urlTabKey && newResults[urlTabKey as ResultType].count) {
        newResults[urlTabKey as ResultType].hasBeenDisplayed = true;
      } else {
        // Find first one that has some results and set it to display
        for (const tabKey in newResults) {
          const config = newResults[tabKey as ResultType];
          if (config.count) {
            config.hasBeenDisplayed = true;
            break;
          }
        }
      }

      setResults(newResults);
      setPageHasResults(Object.values(newResults).some(({ count }) => !!count));
      setAreTabsResolved(true);
      setPageIsLoading(false);
    };

    getCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Sets results inside of this hook
  }, [queryString]);

  const pageTitle = useMemo(() => {
    // If no query, we can't show a title referring to the query
    // if tabs not resolved yet, we can't conclude what will be the result
    if (!queryString || !areTabsResolved) {
      return defaultTitle;
    }

    // Otherwise, the title depends on if there are results.
    if (pageHasResults) {
      return getMicroCopy(microCopy.SEARCH_PAGE_TITLE_WITH_QUERY, {
        query: queryString
      });
    } else {
      return getMicroCopy(microCopy.SEARCH_PAGE_NO_RESULTS_TITLE, {
        query: queryString
      });
    }
  }, [
    queryString,
    pageHasResults,
    areTabsResolved,
    defaultTitle,
    getMicroCopy
  ]);

  // If any of the tabs are loading
  const tabIsLoading =
    Object.values(tabsLoading).some((isLoading) => isLoading) || pageIsLoading;

  const handleTabChange = (tabKey: ResultType) => {
    setResults({
      ...results,
      [tabKey]: {
        ...results[tabKey as ResultType],
        hasBeenDisplayed: true
      }
    });
    setSearchTabUrl(tabKey);
  };

  const onTabCountChange = (tabKey: ResultType, count: number) => {
    const newResults = {
      ...results,
      [tabKey]: {
        ...results[tabKey as ResultType],
        count
      }
    };

    setResults(newResults);
  };

  const renderTabs = (): (React.ReactElement | null)[] => {
    return Object.entries(results)
      .map(([tabKey, data]) => {
        if (!data.count) {
          return null;
        }

        const {
          component: Component,
          hasBeenDisplayed,
          heading,
          count,
          icon
        } = data;
        return (
          <Tabs.TabPanel
            key={tabKey}
            heading={`${heading} (${count})`}
            index={tabKey}
            icon={icon}
          >
            {hasBeenDisplayed ? (
              <Container
                data-testid={`container-${tabKey}`}
                disableGutters={tabKey === "documents" && !isDesktop}
              >
                <Component
                  queryString={queryString}
                  pageContext={pageContext}
                  onLoadingChange={(isLoading: boolean) =>
                    handleTabIsLoading(tabKey, isLoading)
                  }
                  initialFilters={searchFilters.filters}
                  extraData={{
                    allContentfulAssetType: allContentfulAssetType.nodes
                  }}
                  onCountChange={(count: number) =>
                    onTabCountChange(tabKey as ResultType, count)
                  }
                  count={count}
                />
              </Container>
            ) : null}
          </Tabs.TabPanel>
        );
      })
      .filter(Boolean);
  };

  const getInitialTabKey = () => {
    const urlTab = getSearchTabUrl();

    const validKeys = Object.entries(results)
      .filter(([_tabKey, config]) => config.count)
      .map(([tabKey]) => tabKey);

    if (urlTab && validKeys.includes(urlTab)) {
      return urlTab;
    }

    return validKeys[0];
  };

  const initialTabKey = getInitialTabKey();

  return (
    <Page
      title={pageTitle}
      pageData={{ breadcrumbs: null, signupBlock: null, seo: null, path: "" }}
      siteData={contentfulSite}
      disableSearch={isClient && isDesktop}
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
          <Breadcrumbs
            data={[{ id: "", label: pageTitle, slug: "search" }]}
            data-testid="search-page-breadcrumbs-top"
          />
        }
      />
      <Section
        backgroundColor="white"
        isSlim
        id={`search-block`}
        data-testid={`search-page-search-block-section`}
      >
        <SearchBlock
          buttonText={
            queryString
              ? getMicroCopy(microCopy.SEARCH_PAGE_SEARCH_TEXT)
              : defaultTitle
          }
          countryCode={countryCode}
          hasResults={pageHasResults}
          isLoading={tabIsLoading}
          helperText={getMicroCopy(microCopy.SEARCH_PAGE_HELPER_TEXT)}
          placeholder={getMicroCopy(microCopy.SEARCH_PAGE_PLACEHOLDER)}
          query={areTabsResolved ? queryString : ""}
          searchPageSearchTips={resources?.searchPageSearchTips}
          searchPageSidebarItems={resources?.searchPageSidebarItems}
          handleSubmit={(e) => isPreviewMode && handleSubmit(e)}
        />
      </Section>
      {pageHasResults && !pageIsLoading ? (
        <Tabs
          initialValue={initialTabKey}
          color="secondary"
          onChange={(event) => handleTabChange(event as ResultType)}
        >
          {renderTabs()}
        </Tabs>
      ) : null}
      {!pageHasResults && !pageIsLoading
        ? resources?.searchPageNextBestActions && (
            <NextBestActions data={resources.searchPageNextBestActions} />
          )
        : resources?.searchPageExploreBar && (
            <Section
              backgroundColor="pearl"
              isSlim
              id={`search-block-explorer-bar`}
            >
              <ExploreBar data={resources?.searchPageExploreBar} />
            </Section>
          )}
    </Page>
  );
};

export default SearchPage;

export const pageQuery = graphql`
  query SearchPageBySiteId(
    $siteId: String!
    $assetTypeFilter: ContentfulAssetTypeFilterInput
  ) {
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    allContentfulAssetType(filter: $assetTypeFilter) {
      nodes {
        name
        pimCode
      }
    }
    searchFilters {
      filters {
        filterCode
        label
        name
        options {
          label
          value
        }
      }
      allowFilterBy
    }
  }
`;
