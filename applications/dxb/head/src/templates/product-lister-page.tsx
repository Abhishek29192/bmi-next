import AnchorLink from "@bmi/anchor-link";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
import { flatten } from "lodash";
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
import { Link as GatsbyLink } from "gatsby";
import {
  getProductUrl,
  findMasterImageUrl,
  mapClassificationValues,
  findUniqueVariantClassifications
} from "../utils/product-details-transforms";
import ResultsPagination from "../components/ResultsPagination";
import withGTM from "../utils/google-tag-manager";
import {
  URLProductFilter,
  clearFilterValues,
  convertToURLFilters,
  updateFilterValue
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
  compileElasticSearchQuery,
  disableFiltersFromAggregations
} from "../utils/elasticSearch";
import { devLog } from "../utils/devLog";
import FiltersSidebar from "../components/FiltersSidebar";
import { Product } from "../components/types/pim";
import { renderVideo } from "../components/Video";
import { renderImage } from "../components/Image";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_PRODUCTS;

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulProductListerPage";
    content: RichTextData | null;
    features: string[] | null;
    featuresLink: LinkData | null;
    breadcrumbs: BreadcrumbsData;
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
  pimClassificationCatalogueNamespace: string;
  variantCodeToPathMap: Record<string, string>;
};

type Props = {
  pageContext: PageContextType;
  data: {
    contentfulProductListerPage: Data;
    contentfulSite: SiteData;
    productFilters: ReadonlyArray<Filter>;
    initialProducts?: any[];
  };
};

const BlueCheckIcon = (
  <CheckIcon style={{ color: "var(--color-theme-accent)" }} />
);

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
    inputBanner,
    seo,
    heroType,
    featuredVideo,
    cta
  } = data.contentfulProductListerPage;
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

  // NOTE: map colour filter values to specific colour swatch representation
  const resolveFilters = (filters: readonly Filter[]) => {
    return filters.map((filter) => {
      if (filter.name === "colour") {
        return enhanceColourFilterWithSwatches(filter);
      }

      return filter;
    });
  };

  const resolvedFilters = useMemo(
    () => resolveFilters(data.productFilters),
    [data.productFilters]
  );
  const [filters, setFilters] = useState(resolvedFilters);

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

  const onFiltersChange = async (newFilters) => {
    // NOTE: If filters change, we reset pagination to first page
    const result = await fetchProducts(
      newFilters,
      pageContext.categoryCodes,
      0,
      PAGE_SIZE
    );

    if (result && result.aggregations) {
      setFilters(
        disableFiltersFromAggregations(newFilters, result.aggregations)
      );

      return;
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

    const query = compileElasticSearchQuery(
      filters,
      categoryCodes,
      page,
      pageSize
    );

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryElasticSearch(query, ES_INDEX_NAME);

    if (results && results.hits) {
      const { hits } = results;
      const newPageCount = Math.ceil(hits.total.value / PAGE_SIZE);

      setPageCount(newPageCount);
      setPage(newPageCount < page ? 0 : page);
      setProducts(hits.hits.map((hit) => hit._source));
    }

    if (results && results.aggregations) {
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
          ({ name }) => name === filter.name
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
      setFilters(resolvedFilters);
      fetchProducts(resolvedFilters, pageContext.categoryCodes, 0, PAGE_SIZE);
    }
  }, [location.search]);

  // NOTE: We wouldn't expect this to change, even if the data somehow came back incorrect,
  // maybe pointless for this value to rely on it as more will break.
  const categoryName = initialProducts[0]?.categories.find(
    ({ code }) => code === pageContext.categoryCodes[0]
  )?.name;

  const pageData: PageData = { breadcrumbs, inputBanner, seo };

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  let heroLevel;
  if (heroType == "Spotlight" || heroType == "Hierarchy") {
    heroLevel = (Math.min(breadcrumbs.filter(({ slug }) => slug).length, 3) ||
      1) as 1 | 2 | 3;
  } else {
    const levelMap = {
      "Level 1": 1,
      "Level 2": 2,
      "Level 3": 3
    };
    heroLevel = levelMap[heroType] as 1 | 2 | 3;
  }
  const breadcrumbsNode = (
    <Breadcrumbs
      data={breadcrumbs}
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
              {filters.length ? (
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
                  {flatten(
                    products.map((variant) => {
                      const brandLogoCode = variant.brandCode;
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
                          >
                            {variant.shortDescription}
                          </GTMOverviewCard>
                        </Grid>
                      );
                    })
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
            <Breadcrumbs data={breadcrumbs} />
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
  }
`;
