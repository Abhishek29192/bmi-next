import AnchorLink from "@bmi/anchor-link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { graphql, Link as GatsbyLink } from "gatsby";
import Button from "@bmi/button";
import Hero, { HeroItem } from "@bmi/hero";
import SpotlightHero from "@bmi/spotlight-hero";
import LeadBlock from "@bmi/lead-block";
import Section from "@bmi/section";
import CheckIcon from "@material-ui/icons/Check";
import IconList from "@bmi/icon-list";
import OverviewCard, { OverviewCardProps } from "@bmi/overview-card";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import { Filter } from "@bmi/filters";
import queryString from "query-string";
import { useLocation } from "@reach/router";
import {
  findMasterImageUrl,
  findUniqueVariantClassifications,
  getProductUrl,
  mapClassificationValues
} from "../utils/product-details-transforms";
import ResultsPagination from "../components/ResultsPagination";
import withGTM from "../utils/google-tag-manager";
import {
  clearFilterValues,
  convertToURLFilters,
  updateFilterValue,
  URLProductFilter
} from "../utils/filters";
import { enhanceColourFilterWithSwatches } from "../utils/filtersUI";
import Scrim from "../components/Scrim";
import ProgressIndicator from "../components/ProgressIndicator";
import { iconMap } from "../components/Icon";
import RichText, { RichTextData } from "../components/RichText";
import { Data as PageInfoData } from "../components/PageInfo";
import Link, {
  Data as LinkData,
  getClickableActionFromUrl
} from "../components/Link";
import { Data as SiteData } from "../components/Site";
import Page, { Data as PageData } from "../components/Page";
import Breadcrumbs, {
  Data as BreadcrumbsData
} from "../components/Breadcrumbs";
import {
  queryElasticSearch,
  disableFiltersFromAggregations,
  compileElasticSearchQuery
} from "../utils/elasticSearch";
import {
  compileESQueryPLP,
  disableFiltersFromAggregationsPLP,
  xferFilterValue
} from "../utils/elasticSearchPLP";

import { devLog } from "../utils/devLog";
import FiltersSidebar from "../components/FiltersSidebar";
import { Product } from "../components/types/pim";
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";
import { ProductFilter, removePLPFilterPrefix } from "../utils/product-filters";
import { updateBreadcrumbTitleFromContentful } from "../utils/breadcrumbUtils";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_PRODUCTS;

type Data = PageInfoData &
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
  pimClassificationCatalogueNamespace: string;
  variantCodeToPathMap: Record<string, string>;
};

type Props = {
  pageContext: PageContextType;
  data: {
    contentfulProductListerPage: Data;
    contentfulSite: SiteData;
    productFilters: ReadonlyArray<Filter>;
    plpFilters: ReadonlyArray<Filter>;
    initialProducts?: any[];
  };
};

const BlueCheckIcon = (
  <CheckIcon style={{ color: "var(--color-theme-accent)" }} />
);

const ProductListerPage = ({ pageContext, data }: Props) => {
  const {
    allowFilterBy,
    brandLogo,
    title,
    subtitle,
    content,
    featuredMedia,
    features,
    featuresLink,
    breadcrumbs,
    breadcrumbTitle,
    inputBanner,
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

  const heroProps: HeroItem = {
    title,
    children: subtitle,
    media: featuredVideo
      ? renderVideo(featuredVideo)
      : renderImage(featuredMedia, { size: "cover" }),
    cta: cta && (
      <Link component={Button} data={cta}>
        {cta.label}
      </Link>
    )
  };
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
        ? { filters: JSON.parse(parsedQueryParams.filters as string) }
        : { filters: [] })
    };
  }, [location]);

  //TODO: remove filter.name === "colour" condition when feature flag 'GATSBY_USE_LEGACY_FILTERS' is removed
  // JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
  const resolveFilters = (filters: readonly Filter[]) => {
    return (filters || [])
      .filter((filter) => filter.options.length > 0)
      .map((filter) => {
        const filterName = filter.name.trim().toLowerCase();
        if (filterName === "colour" || filterName.endsWith("colourfamily")) {
          return enhanceColourFilterWithSwatches(filter);
        }

        return filter;
      });
  };

  const resolvedNewPLPFilters = useMemo(
    () => resolveFilters(data.plpFilters),
    [data.plpFilters]
  );

  const resolvedFilters = useMemo(
    () => resolveFilters(data.productFilters),
    [data.productFilters]
  );

  //TODO: Remove feature flag 'GATSBY_USE_LEGACY_FILTERS' branch code
  // JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
  const getResolvedFilters = () => {
    return process.env.GATSBY_USE_LEGACY_FILTERS === "true"
      ? resolvedFilters
      : resolvedNewPLPFilters;
  };

  const [filters, setFilters] = useState(getResolvedFilters());

  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
  );

  const handlePageChange = (_, page) => {
    const scrollY = resultsElement.current
      ? resultsElement.current.offsetTop - 200
      : 0;
    window.scrollTo(0, scrollY);
    fetchProducts(filters, pageContext.categoryCodes, page - 1, PAGE_SIZE);
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
        process.env.GATSBY_USE_LEGACY_FILTERS === "true"
          ? xferFilterValue(
              newFilters,
              disableFiltersFromAggregations(filters, result.aggregations)
            )
          : xferFilterValue(
              newFilters,
              disableFiltersFromAggregationsPLP(filters, result.aggregations)
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

    if (process.env.GATSBY_PREVIEW) {
      alert("You cannot search on the preview environment.");
      return;
    }

    setIsLoading(true);

    //TODO: remove feature flag 'GATSBY_USE_LEGACY_FILTERS' branch of code
    // JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
    let query =
      process.env.GATSBY_USE_LEGACY_FILTERS === "true"
        ? compileElasticSearchQuery(filters, categoryCodes, page, pageSize)
        : compileESQueryPLP({
            filters, //these are updated filters with user's selection from UI!
            allowFilterBy,
            categoryCodes,
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
      const newFilters =
        process.env.GATSBY_USE_LEGACY_FILTERS === "true"
          ? disableFiltersFromAggregations(filters, results.aggregations)
          : disableFiltersFromAggregationsPLP(filters, results.aggregations);

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
          ({ name }) => name === removePLPFilterPrefix(filter.name)
        )?.value;

        return {
          ...filter,
          value: [].concat(currentQueryFilterValue).filter(Boolean)
        };
      });

      setFilters(updatedFilters);
      fetchProducts(updatedFilters, pageContext.categoryCodes, 0, PAGE_SIZE);
    } else {
      // Default search (no filters)
      setFilters(getResolvedFilters());
      fetchProducts(
        getResolvedFilters(),
        pageContext.categoryCodes,
        0,
        PAGE_SIZE
      );
    }
  }, [location.search]);

  // NOTE: We wouldn't expect this to change, even if the data somehow came back incorrect,
  // maybe pointless for this value to rely on it as more will break.
  const categoryName = initialProducts[0]?.categories.find(
    ({ code }) => code === pageContext.categoryCodes[0]
  )?.name;

  const pageData: PageData = {
    breadcrumbs: enhancedBreadcrumbs,
    inputBanner,
    seo,
    path: data.contentfulProductListerPage.path
  };

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  let heroLevel;
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    heroLevel = (Math.min(
      enhancedBreadcrumbs.filter(({ slug }) => slug).length,
      3
    ) || 1) as 1 | 2 | 3;
  } else {
    const levelMap = {
      "Level 1": 1,
      "Level 2": 2,
      "Level 3": 3
    };
    // eslint-disable-next-line security/detect-object-injection
    heroLevel = levelMap[heroType] as 1 | 2 | 3;
  }
  const breadcrumbsNode = (
    <Breadcrumbs
      data={enhancedBreadcrumbs}
      isDarkThemed={heroType === "Spotlight" || heroLevel !== 3}
    />
  );

  const isFeaturesArrayExist = features?.length > 0;
  const isKeyFeatureBlockVisible = isFeaturesArrayExist || featuresLink;
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
          {heroType === "Spotlight" ? (
            <SpotlightHero
              {...heroProps}
              breadcrumbs={breadcrumbsNode}
              brand={brandLogo}
            />
          ) : (
            <Hero
              level={heroLevel}
              {...heroProps}
              breadcrumbs={breadcrumbsNode}
              brand={brandLogo}
            />
          )}
          <Section backgroundColor="white">
            <LeadBlock>
              <LeadBlock.Content>
                <RichText
                  document={content}
                  underlineHeadings={["h2", "h3", "h4"]}
                />
              </LeadBlock.Content>
              {isKeyFeatureBlockVisible ? (
                <LeadBlock.Card theme="pearl">
                  <LeadBlock.Card.Section>
                    <LeadBlock.Card.Heading hasUnderline>
                      {getMicroCopy("plp.keyFeatures.title")}
                    </LeadBlock.Card.Heading>
                    <LeadBlock.Card.Content>
                      {isFeaturesArrayExist && (
                        <IconList>
                          {features.map((feature, index) => (
                            <IconList.Item
                              key={index}
                              icon={BlueCheckIcon}
                              title={feature}
                              isCompact
                            />
                          ))}
                        </IconList>
                      )}
                      {featuresLink && (
                        <AnchorLink
                          action={getClickableActionFromUrl(
                            featuresLink.linkedPage,
                            featuresLink.url,
                            countryCode,
                            featuresLink.asset?.file?.url,
                            featuresLink.label
                          )}
                        >
                          {featuresLink.label}
                        </AnchorLink>
                      )}
                    </LeadBlock.Card.Content>
                  </LeadBlock.Card.Section>
                </LeadBlock.Card>
              ) : null}
            </LeadBlock>
          </Section>
          <Section backgroundColor="pearl" overflowVisible>
            {categoryName && (
              <Section.Title hasUnderline>{categoryName}</Section.Title>
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
                  {products.length === 0 && (
                    <Typography>
                      {getMicroCopy("plp.product.noResultsFound")}
                    </Typography>
                  )}
                  {products.flatMap((variant) => {
                    const brandLogoCode = variant.brandCode;
                    // eslint-disable-next-line security/detect-object-injection
                    const brandLogo = iconMap[brandLogoCode];
                    const mainImage = findMasterImageUrl(variant.images);
                    const product: Product = variant.baseProduct;
                    const productUrl = getProductUrl(
                      countryCode,
                      pageContext.variantCodeToPathMap[variant.code]
                    );
                    const uniqueClassifications = mapClassificationValues(
                      findUniqueVariantClassifications(
                        { ...variant, _product: product },
                        pageContext.pimClassificationCatalogueNamespace
                      )
                    );
                    const moreOptionsAvailable =
                      variant.all_variants?.length > 1 &&
                      getMicroCopy("plp.product.moreOptionsAvailable");

                    return (
                      <Grid
                        item
                        key={`${product.code}-${variant.code}`}
                        xs={12}
                        md={6}
                        lg={4}
                        xl={filters.length ? 4 : 3}
                      >
                        <GTMOverviewCard
                          title={product.name}
                          titleVariant="h5"
                          subtitle={uniqueClassifications}
                          subtitleVariant="h6"
                          media={
                            <img
                              src={mainImage}
                              alt={`${uniqueClassifications} ${product.name}`}
                            />
                          }
                          imageSize="contain"
                          brandImageSource={brandLogo}
                          action={{
                            model: "routerLink",
                            linkComponent: GatsbyLink,
                            to: productUrl
                          }}
                          gtm={{
                            id: "cta-click1",
                            action: productUrl,
                            label: getMicroCopy("plp.product.viewDetails")
                          }}
                          footer={
                            <AnchorLink iconEnd>
                              {getMicroCopy("plp.product.viewDetails")}
                            </AnchorLink>
                          }
                          moreOptionsAvailable={moreOptionsAvailable}
                        >
                          {variant.shortDescription}
                        </GTMOverviewCard>
                      </Grid>
                    );
                  })}
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
    $pimClassificationCatalogueNamespace: String!
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
    productFilters(
      pimClassificationCatalogueNamespace: $pimClassificationCatalogueNamespace
      categoryCodes: $categoryCodes
    ) {
      label
      name
      options {
        label
        value
      }
    }
    plpFilters(
      pimClassificationCatalogueNamespace: $pimClassificationCatalogueNamespace
      categoryCodes: $categoryCodes
      allowFilterBy: $allowFilterBy
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
