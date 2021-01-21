import { InputValue } from "@bmi/form";
import Hero from "@bmi/hero";
import LeadBlock from "@bmi/lead-block";
import Search from "@bmi/search";
import Section from "@bmi/section";
import Typography from "@bmi/typography";
import Filters from "@bmi/filters";
import Tabs from "@bmi/tabs";
import Button from "@bmi/button";
import Grid from "@bmi/grid";
import Pagination from "@bmi/pagination";
import OverviewCard from "@bmi/overview-card";
import AnchorLink from "@bmi/anchor-link";
import PerfectScrollbar from "@bmi/perfect-scrollbar";
import { graphql, Link } from "gatsby";
import React, { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Breadcrumbs from "../components/Breadcrumbs";
import ExploreBar from "../components/ExploreBar";
import { generateGetMicroCopy } from "../components/MicroCopy";
import NextBestActions from "../components/NextBestActions";
import Page from "../components/Page";
import ProgressIndicator from "../components/ProgressIndicator";
import RichText from "../components/RichText";
import Scrim from "../components/Scrim";
import { Data as SiteData } from "../components/Site";
import { Data as TitleWithContentData } from "../components/TitleWithContent";
// TODO: Move type away from a page
import { Product } from "./product-details-page";
import {
  clearFilterValues,
  getFilters,
  updateFilterValue
} from "../utils/filters";
import {
  queryElasticSearch,
  compileElasticSearchQuery,
  disableFiltersFromAggregations,
  removeIrrelevantFilters
} from "../utils/elasticSearch";
import { devLog } from "../utils/devLog";
import {
  findMasterImageUrl,
  findUniqueVariantClassifications,
  getProductUrl,
  mapClassificationValues
} from "../utils/product-details-transforms";
import { iconMap } from "../components/Icon";

const PAGE_SIZE = 24;

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

type QueryInput = Extract<string, InputValue>;

const SearchTips = ({
  title,
  content
}: Omit<TitleWithContentData, "__typename">) => (
  <LeadBlock.Content.Section>
    <Typography variant="h5">{title}</Typography>
    <RichText document={content} />
  </LeadBlock.Content.Section>
);

const SearchSidebarItems = ({
  title,
  content
}: Omit<TitleWithContentData, "__typename">) => (
  <LeadBlock.Card theme="pearl">
    <LeadBlock.Card.Section>
      <LeadBlock.Card.Heading hasUnderline>{title}</LeadBlock.Card.Heading>
      <LeadBlock.Card.Content>
        <RichText document={content} />
      </LeadBlock.Card.Content>
    </LeadBlock.Card.Section>
  </LeadBlock.Card>
);

const SearchPage = ({ pageContext, data }: Props) => {
  const { contentfulSite } = data;
  const QUERY_KEY = "q";
  const params = new URLSearchParams(
    typeof window !== `undefined` ? window.location.search : ""
  );
  const [query, setQuery] = useState<QueryInput>(params.get(QUERY_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const resultsElement = useRef<HTMLDivElement>(null);

  // TODO: Focusing on products tab initially, then to more generic results
  const initialProducts = [];
  const [products, setProducts] = useState(initialProducts);
  const [totalProductsCount, setTotalProductsCount] = useState(
    initialProducts.length
  );
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
  );
  const hasResults = products.length > 0;

  const { countryCode, menuNavigation, resources } = contentfulSite;
  const getMicroCopy = generateGetMicroCopy(resources.microCopy);
  const defaultTitle = getMicroCopy("searchPage.title");

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
      return getMicroCopy("searchPage.title.withQuery").replace(
        "{{query}}",
        query
      );
    } else {
      return getMicroCopy("searchPage.noResultsTitle").replace(
        "{{query}}",
        query
      );
    }
  }, [query, hasResults]);

  const isInitialLoad = useRef(true);

  // This will trigger on page load (mount) and any time query changes
  // and will execute clearFilters and data fetch even if query is empty
  useEffect(() => {
    setIsLoading(true);

    // Resetting the filters, trigger a query with initial filters
    // It's not super obvious, opportunity to refactor
    onFiltersChange(initialFilters);
    setIsLoading(false);
  }, [query]);

  const initialFilters = getFilters(
    pageContext.pimClassificationCatalogueNamespace,
    // Don't really like this as it seems like too much computation for the page
    data.allProducts.nodes
  );
  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = async (
    filters,
    categoryCode,
    page,
    pageSize,
    searchQuery?: string
  ) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    setIsLoading(true);

    let query = compileElasticSearchQuery(
      filters,
      categoryCode,
      page,
      pageSize,
      searchQuery
    );

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryElasticSearch(query);

    if (results && results.hits) {
      const { hits } = results;
      const newPageCount = Math.ceil(hits.total.value / PAGE_SIZE);

      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      setProducts(hits.hits.map((hit) => hit._source));
      setTotalProductsCount(hits.total.value);
    }

    setIsLoading(false);

    return results;
  };

  const onFiltersChange = async (newFilters) => {
    const result = await fetchProducts(newFilters, null, 0, PAGE_SIZE, query);

    if (result && result.aggregations) {
      newFilters = disableFiltersFromAggregations(
        newFilters,
        result.aggregations
      );

      if (isInitialLoad.current) {
        newFilters = removeIrrelevantFilters(newFilters, result.aggregations);
        isInitialLoad.current = false;
      }
    }

    setFilters(newFilters);
  };

  const handleFiltersChange = (filterName, filterValue, checked) => {
    const newFilters = updateFilterValue(
      filters,
      filterName,
      filterValue,
      checked
    );

    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const newFilters = clearFilterValues(filters);

    onFiltersChange(newFilters);
  };

  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    fetchProducts(filters, null, page - 1, PAGE_SIZE, query);
  };

  return (
    <Page
      title={pageTitle}
      pageData={{ slug: "search", inputBanner: null }}
      siteData={contentfulSite}
    >
      {isLoading ? (
        <Scrim theme="light">
          <ProgressIndicator theme="light" />
        </Scrim>
      ) : null}
      <Hero
        level={3}
        title={pageTitle}
        breadcrumbs={
          <Breadcrumbs
            title={pageTitle}
            slug="search"
            menuNavigation={menuNavigation}
          />
        }
      />
      <Section isSlim backgroundColor="white">
        <LeadBlock>
          <LeadBlock.Content>
            <LeadBlock.Content.Section>
              <Search
                action={`/${countryCode}/search`}
                buttonText={
                  query ? getMicroCopy("searchPage.searchText") : defaultTitle
                }
                defaultValue={query || null}
                fieldName={QUERY_KEY}
                onSubmit={handleSubmit}
                helperText={getMicroCopy("searchPage.helperText")}
                placeholder={getMicroCopy("searchPage.placeholder")}
              />
            </LeadBlock.Content.Section>
            {!hasResults && resources.searchPageSearchTips && (
              <SearchTips
                title={resources.searchPageSearchTips.title}
                content={resources.searchPageSearchTips.content}
              />
            )}
          </LeadBlock.Content>
          {!hasResults && resources.searchPageSidebarItems && (
            <SearchSidebarItems
              title={resources.searchPageSidebarItems.title}
              content={resources.searchPageSidebarItems.content}
            />
          )}
        </LeadBlock>
      </Section>
      {hasResults ? (
        <Section isSlim backgroundColor="white">
          <Tabs initialValue="products" theme="secondary">
            <Tabs.TabPanel
              heading={`Products (${totalProductsCount})`}
              index="products"
            >
              {/* TODO: Sure the ref should be on here? how does this work across tabs? */}
              <Grid container spacing={3} ref={resultsElement}>
                <Grid item xs={12} md={12} lg={3}>
                  <PerfectScrollbar
                    style={{
                      position: "sticky",
                      top: "180px",
                      maxHeight: "calc(100vh - 200px)",
                      overflow: "hidden"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 4
                      }}
                    >
                      <Typography variant="h5">
                        {getMicroCopy("plp.filters.title")}
                      </Typography>
                      <Button variant="text" onClick={clearFilters}>
                        {getMicroCopy("plp.filters.clearAll")}
                      </Button>
                    </div>
                    <Filters filters={filters} onChange={handleFiltersChange} />
                  </PerfectScrollbar>
                </Grid>
                <Grid item xs={12} md={12} lg={9} style={{ paddingTop: 60 }}>
                  <Grid container spacing={3}>
                    {products.length === 0 && (
                      <Typography>No results found</Typography>
                    )}
                    {products.map((variant) => {
                      const brandLogoCode = variant.brandCode;
                      const brandLogo = iconMap[brandLogoCode];
                      const mainImage = findMasterImageUrl(variant.images);
                      const product: Product = variant.baseProduct;

                      const uniqueClassifications = mapClassificationValues(
                        findUniqueVariantClassifications(
                          { ...variant, _product: product },
                          pageContext.pimClassificationCatalogueNamespace
                        )
                      );

                      return (
                        <Grid
                          item
                          key={`${product.code}-${variant.code}`}
                          xs={12}
                          md={6}
                          lg={4}
                        >
                          <OverviewCard
                            title={product.name}
                            titleVariant="h5"
                            subtitle={uniqueClassifications}
                            subtitleVariant="h6"
                            imageSource={mainImage}
                            imageSize="contain"
                            brandImageSource={brandLogo}
                            footer={
                              <AnchorLink
                                iconEnd
                                action={{
                                  model: "routerLink",
                                  linkComponent: Link,
                                  to: getProductUrl(countryCode, variant.code)
                                }}
                              >
                                {getMicroCopy("plp.product.viewDetails")}
                              </AnchorLink>
                            }
                          >
                            {variant.shortDescription}
                          </OverviewCard>
                        </Grid>
                      );
                    })}
                  </Grid>
                  {/* TODO: Not sure if the spacing aligns correctly, also, offset? */}
                  <Grid container style={{ marginTop: 48, marginBottom: 48 }}>
                    <Grid item xs={12} md={6} lg={6}></Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Pagination
                        page={page + 1}
                        onChange={handlePageChange}
                        count={pageCount}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Tabs.TabPanel>
            <Tabs.TabPanel heading="Documents" index="documents">
              Coming soon
            </Tabs.TabPanel>
            <Tabs.TabPanel heading="Content pages" index="content-pages">
              Coming soon
            </Tabs.TabPanel>
            <Tabs.TabPanel heading="Tools" index="tools">
              Coming soon
            </Tabs.TabPanel>
          </Tabs>
        </Section>
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
