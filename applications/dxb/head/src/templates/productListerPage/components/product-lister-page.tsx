import {
  AnchorLink,
  AnchorLinkProps,
  Grid,
  HeroProps,
  IconList,
  LeadBlock,
  PLPFilterResponse,
  Section,
  SpotlightHeroProps,
  Typography
} from "@bmi-digital/components";
import type { Product as ESProduct } from "@bmi/elasticsearch-types";
import CheckIcon from "@mui/icons-material/Check";
import { styled } from "@mui/material/styles";
import { useLocation } from "@reach/router";
import { graphql } from "gatsby";
import queryString from "query-string";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../../../components/Breadcrumbs";
import FiltersSidebar from "../../../components/FiltersSidebar";
import {
  Data as LinkData,
  getClickableActionFromUrl
} from "../../../components/Link";
import Page, { Data as PageData } from "../../../components/Page";
import { Data as PageInfoData } from "../../../components/PageInfo";
import ProgressIndicator from "../../../components/ProgressIndicator";
import ResultsPagination from "../../../components/ResultsPagination";
import RichText, { RichTextData } from "../../../components/RichText";
import Scrim from "../../../components/Scrim";
import { Data as SiteData } from "../../../components/Site";
import { microCopy } from "../../../constants/microCopies";
import { useConfig } from "../../../contexts/ConfigProvider";
import { ProductFilter } from "../../../types/pim";
import { updateBreadcrumbTitleFromContentful } from "../../../utils/breadcrumbUtils";
import { devLog } from "../../../utils/devLog";
import {
  compileElasticSearchQuery,
  disableFiltersFromAggregations,
  queryElasticSearch
} from "../../../utils/elasticSearch";
import { xferFilterValue } from "../../../utils/elasticSearchPLP";
import {
  clearFilterValues,
  convertToURLFilters,
  replaceDotFiltersParameter,
  updateFilterValue,
  URLProductFilter
} from "../../../utils/filters";
import withGTM from "../../../utils/google-tag-manager";
import {
  generateHeroLevel,
  generateHeroProps
} from "../../../utils/heroLevelUtils";
import { renderHero } from "../../../utils/heroTypesUI";
import { removePLPFilterPrefix } from "../../../utils/product-filters";
import {
  renderProducts,
  resolveFilters
} from "../utils/productListerPageUtils";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_PRODUCTS;

export type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulProductListerPage";
    allowFilterBy: string[] | null;
    content: RichTextData | null;
    features: string[] | null;
    featuresLink: LinkData | null;
    breadcrumbs: BreadcrumbsData;
    breadcrumbTitle: string;
    heroType:
      | "Hierarchy"
      | "Spotlight"
      | "Level 1"
      | "Level 2"
      | "Level 3"
      | null;
    cta: LinkData | null;
  };

type QueryParams = {
  filters: URLProductFilter[];
};

export type PageContextType = {
  variantCode?: string;
  siteId: string;
  countryCode: string;
  categoryCodes: string[];
  allowFilterBy: string[];
  variantCodeToPathMap?: Record<string, string>;
};

export type Props = {
  pageContext: PageContextType;
  data: {
    contentfulProductListerPage: Data;
    contentfulSite: SiteData;
    plpFilters: PLPFilterResponse;
    initialProducts?: ESProduct[];
  };
};

const StyledBlueCheckIcon = styled(CheckIcon)(({ theme }) => ({
  color: theme.colours.inter
}));

const BlueCheckIcon = () => {
  return <StyledBlueCheckIcon />;
};

const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

const ProductListerPage = ({ pageContext, data }: Props) => {
  const {
    brandLogo,
    title,
    subtitle,
    content,
    featuredMedia,
    features,
    featuresLink,
    breadcrumbs,
    breadcrumbTitle,
    signupBlock,
    seo,
    heroType,
    featuredVideo,
    cta
  } = data.contentfulProductListerPage;
  const enhancedBreadcrumbs = updateBreadcrumbTitleFromContentful(
    breadcrumbs,
    breadcrumbTitle
  );
  const initialProducts = data.initialProducts || [];

  const {
    config: { isPreviewMode, isBrandProviderEnabled }
  } = useConfig();

  const heroLevel = generateHeroLevel(heroType, enhancedBreadcrumbs);
  const heroProps: HeroProps | SpotlightHeroProps = generateHeroProps(
    title,
    heroLevel,
    subtitle,
    featuredVideo,
    featuredMedia,
    cta
  );
  const { countryCode } = data.contentfulSite;

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(initialProducts);

  const resultsElement = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const queryParams = useMemo<QueryParams>(() => {
    const parsedQueryParams = queryString.parse(location.search);
    return {
      ...parsedQueryParams,
      ...(parsedQueryParams.filters
        ? {
            filters: JSON.parse(
              replaceDotFiltersParameter(parsedQueryParams.filters as string)
            )
          }
        : { filters: [] })
    };
  }, [location]);

  const resolvedFilters = useMemo(() => {
    return resolveFilters(data.plpFilters?.filters);
  }, [data.plpFilters]);

  const [filters, setFilters] = useState(resolvedFilters);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
  );

  const handlePageChange = async (_, page) => {
    await fetchProducts(
      filters,
      pageContext.categoryCodes,
      page - 1,
      PAGE_SIZE
    );
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
  };

  const onFiltersChange = async (newFilters: ProductFilter[]) => {
    // NOTE: If filters change, we reset pagination to first page
    const result = await fetchProducts(
      newFilters,
      pageContext.categoryCodes,
      0,
      PAGE_SIZE
    );

    // TODO: Remove 'GATSBY_USE_LEGACY_FILTERS' branch of code
    // JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
    if (result && result.aggregations) {
      setFilters(
        xferFilterValue(
          newFilters,
          disableFiltersFromAggregations(filters, result.aggregations)
        )
      );

      return;
    }

    setFilters(newFilters);
  };

  const handleFiltersChange = (filterName, filterValue, checked) => {
    const newFilters: ProductFilter[] = updateFilterValue(
      filters,
      filterName,
      filterValue,
      checked
    );
    const URLFilters = convertToURLFilters(newFilters);

    history.replaceState(
      null,
      null,
      `${location.pathname}?${queryString.stringify({
        filters: JSON.stringify(URLFilters)
      })}`
    );

    onFiltersChange(newFilters);
  };

  // Resets all selected filter values to nothing
  const handleClearFilters = () => {
    history.replaceState(null, null, location.pathname);
    const newFilters = clearFilterValues(filters);
    onFiltersChange(newFilters);
  };

  const fetchProducts = async (filters, categoryCodes, page, pageSize) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    if (isPreviewMode) {
      alert("You cannot search on the preview environment.");
      return;
    }

    setIsLoading(true);

    const query = compileElasticSearchQuery({
      allowFilterBy: data.plpFilters.allowFilterBy,
      categoryCodes,
      filters, //these are updated filters with user's selection from UI!
      groupByVariant: process.env.GATSBY_GROUP_BY_VARIANT === "true",
      page,
      pageSize
    });

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryElasticSearch(query, ES_INDEX_NAME);

    if (results && results.hits) {
      const { hits } = results;
      const uniqueBaseProductsCount =
        results.aggregations?.unique_base_products_count?.value || 0;
      const newPageCount = Math.ceil(uniqueBaseProductsCount / PAGE_SIZE);
      const variants = (() => {
        if ((page + 1) * PAGE_SIZE > uniqueBaseProductsCount) {
          return hits.hits.slice(0, uniqueBaseProductsCount - page * PAGE_SIZE);
        }
        return hits.hits;
      })();

      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      setProducts(
        variants.map((hit) => ({
          ...hit._source,
          all_variants: hit.inner_hits.all_variants.hits.hits || []
        }))
      );
    }

    if (results && results.aggregations) {
      // TODO: Remove 'GATSBY_USE_LEGACY_FILTERS' branch of code
      // JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
      const newFilters = disableFiltersFromAggregations(
        filters,
        results.aggregations
      );

      setFilters(newFilters);
    }

    setIsLoading(false);

    return results;
  };

  useEffect(() => {
    if (queryParams?.filters?.length) {
      // Filter search
      const updatedFilters = filters.map((filter) => {
        const currentQueryFilterValue = queryParams.filters.find(
          // TODO: DXB-3449 - remove toUpperCase when PIM has completed BPN-1055
          ({ name }) =>
            name.toUpperCase() ===
            removePLPFilterPrefix(filter.name).toUpperCase()
        )?.value;

        return {
          ...filter,
          value: [].concat(currentQueryFilterValue).filter(Boolean)
        };
      });

      setFilters(updatedFilters);
      fetchProducts(updatedFilters, pageContext.categoryCodes, 0, PAGE_SIZE);
    } else {
      //wait for allow filter by to be resolved before starting a seach
      if (data.plpFilters && data.plpFilters.allowFilterBy) {
        // Default search (no filters)
        setFilters(resolvedFilters);
        fetchProducts(resolvedFilters, pageContext.categoryCodes, 0, PAGE_SIZE);
      } else {
        devLog("could not resolve 'data.plpFilters'");
      }
    }
  }, [location.search]);

  // NOTE: We wouldn't expect this to change, even if the data somehow came back incorrect,
  // maybe pointless for this value to rely on it as more will break.
  const pageTitle = products[0]?.categories?.find(
    ({ code }) => code === pageContext.categoryCodes[0]
  )?.name;
  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    signupBlock,
    seo,
    path: data.contentfulProductListerPage.path
  };

  const breadcrumbsNode = (
    <Breadcrumbs
      data={enhancedBreadcrumbs}
      isDarkThemed={heroType === "Spotlight" || heroLevel !== 3}
    />
  );

  const isFeaturesArrayExist = features?.length > 0;
  const isKeyFeatureBlockVisible = isFeaturesArrayExist || featuresLink;
  const isHeroKeyLine = Boolean(isBrandProviderEnabled && brandLogo);
  return (
    <Page
      brand={brandLogo}
      title={title}
      pageData={pageData}
      siteData={data.contentfulSite}
      variantCodeToPathMap={pageContext?.variantCodeToPathMap}
      ogImageUrl={featuredMedia?.image?.file.url}
    >
      {({ siteContext: { getMicroCopy } }) => (
        <>
          {isLoading ? (
            <Scrim theme="light">
              <ProgressIndicator theme="light" />
            </Scrim>
          ) : null}
          {renderHero(heroProps, breadcrumbsNode, heroType, {
            isHeroKeyLine: isHeroKeyLine,
            isSpotlightHeroKeyLine: isHeroKeyLine
          })}
          <Section backgroundColor="white">
            <LeadBlock>
              <LeadBlock.Content>
                <RichText
                  document={content}
                  underlineHeadings={["h2", "h3", "h4"]}
                />
              </LeadBlock.Content>
              {isKeyFeatureBlockVisible ? (
                <LeadBlock.Card color="pearl">
                  <LeadBlock.Card.Section>
                    <LeadBlock.Card.Heading hasUnderline>
                      {getMicroCopy(microCopy.PLP_KEY_FEATURES_TITLE)}
                    </LeadBlock.Card.Heading>
                    <LeadBlock.Card.Content>
                      {isFeaturesArrayExist && (
                        <IconList>
                          {features.map((feature, index) => (
                            <IconList.Item
                              key={index}
                              icon={BlueCheckIcon()}
                              title={feature}
                              isCompact
                            />
                          ))}
                        </IconList>
                      )}
                      {featuresLink && (
                        <GTMAnchorLink
                          action={getClickableActionFromUrl(
                            featuresLink.linkedPage,
                            featuresLink.url,
                            countryCode,
                            featuresLink.asset?.file?.url,
                            featuresLink.label
                          )}
                          gtm={{
                            id: "cta-click1",
                            label: `${getMicroCopy(
                              microCopy.PLP_KEY_FEATURES_TITLE
                            )} - ${featuresLink.label}`
                          }}
                        >
                          {featuresLink.label}
                        </GTMAnchorLink>
                      )}
                    </LeadBlock.Card.Content>
                  </LeadBlock.Card.Section>
                </LeadBlock.Card>
              ) : null}
            </LeadBlock>
          </Section>
          <Section backgroundColor="pearl" overflowVisible>
            {pageTitle && (
              <Section.Title hasUnderline>{pageTitle}</Section.Title>
            )}
            <Grid container spacing={3}>
              {filters && filters.length ? (
                <Grid item xs={12} md={12} lg={3}>
                  <FiltersSidebar
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    onClearFilters={handleClearFilters}
                  />
                </Grid>
              ) : null}
              <Grid
                item
                xs={12}
                md={12}
                lg={filters.length ? 9 : 12}
                style={{ paddingTop: 60 }}
                ref={resultsElement}
              >
                <Grid container spacing={3}>
                  {!isLoading && products.length === 0 && (
                    <Typography>
                      {getMicroCopy(microCopy.PLP_PRODUCT_NO_RESULTS_FOUND)}
                    </Typography>
                  )}
                  {renderProducts(
                    products,
                    pageContext,
                    countryCode,
                    getMicroCopy,
                    filters
                  )}
                </Grid>
                <ResultsPagination
                  page={page + 1}
                  onPageChange={handlePageChange}
                  count={pageCount}
                />
              </Grid>
            </Grid>
          </Section>
          <Section backgroundColor="alabaster" isSlim>
            <Breadcrumbs data={enhancedBreadcrumbs} />
          </Section>
        </>
      )}
    </Page>
  );
};

export default ProductListerPage;

export const pageQuery = graphql`
  query ProductListerPageById(
    $pageId: String!
    $siteId: String!
    $categoryCodes: [String!]
    $allowFilterBy: [String!]
  ) {
    contentfulProductListerPage(id: { eq: $pageId }) {
      ...PageInfoFragment
      ...PageFragment
      ...BreadcrumbsFragment
      content {
        ...RichTextFragment
      }
      features
      featuresLink {
        ...LinkFragment
      }
      heroType
      cta {
        ...LinkFragment
      }
      allowFilterBy
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    plpFilters(categoryCodes: $categoryCodes, allowFilterBy: $allowFilterBy) {
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
