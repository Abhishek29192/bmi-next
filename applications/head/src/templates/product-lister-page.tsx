import AnchorLink, { Props as AnchorLinkProps } from "@bmi/anchor-link";
import { ClickableAction } from "@bmi/clickable";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link, graphql } from "gatsby";
import { flatten } from "lodash";
import Hero, { HeroItem } from "@bmi/hero";
import LeadBlock from "@bmi/lead-block";
import Section from "@bmi/section";
import CheckIcon from "@material-ui/icons/Check";
import IconList from "@bmi/icon-list";
import OverviewCard from "@bmi/overview-card";
import Grid from "@bmi/grid";
import Typography from "@bmi/typography";
import ColorSwatch from "../components/ColorSwatch";
import withGTM from "../utils/google-tag-manager";
import {
  getProductUrl,
  findMasterImageUrl,
  mapClassificationValues,
  findUniqueVariantClassifications
} from "../utils/product-details-transforms";
import ResultsPagination from "../components/ResultsPagination";
import {
  clearFilterValues,
  ProductFilter,
  updateFilterValue
} from "../utils/filters";
import Scrim from "../components/Scrim";
import ProgressIndicator from "../components/ProgressIndicator";
import { iconMap } from "../components/Icon";
import RichText, { RichTextData } from "../components/RichText";
import { Data as PageInfoData } from "../components/PageInfo";
import { LinkData, getClickableActionFromUrl } from "../components/Link";
import { Data as SiteData, SiteContext } from "../components/Site";
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
import { Product } from "./product-details-page";

const PAGE_SIZE = 24;
const ES_INDEX_NAME = process.env.GATSBY_ES_INDEX_NAME_PRODUCTS;

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulProductListerPage";
    content: RichTextData | null;
    features: string[] | null;
    featuresLink: LinkData | null;
    breadcrumbs: BreadcrumbsData;
  };

type Props = {
  pageContext: {
    // productId: string;
    variantCode?: string;
    siteId: string;
    countryCode: string;
    categoryCode: string;
    pimClassificationCatalogueNamespace: string;
    variantCodeToPathMap: Record<string, string>;
  };
  data: {
    contentfulProductListerPage: Data;
    contentfulSite: SiteData;
    productFilters: ReadonlyArray<ProductFilter>;
  };
};

const BlueCheckIcon = <CheckIcon style={{ color: "#009fe3" }} />;

const ProductListerPage = ({ pageContext, data }: Props) => {
  const {
    title,
    subtitle,
    featuredImage,
    content,
    features,
    featuresLink,
    breadcrumbs,
    inputBanner,
    seo
  } = data.contentfulProductListerPage;

  const heroProps: HeroItem = {
    title,
    children: subtitle,
    imageSource: featuredImage?.resize.src
  };
  const { countryCode } = data.contentfulSite;
  // TODO: Ignoring gatsby data for now as fetching with ES
  const initialProducts = [];

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(initialProducts);

  const resultsElement = useRef<HTMLDivElement>(null);

  // NOTE: map colour filter values to specific colour swatch representation
  const resolveFilters = (filters) => {
    return filters.map((filter) => {
      if (filter.name === "colour") {
        return {
          ...filter,
          options: filter.options.map((option) => ({
            ...option,
            label: (
              <>
                <ColorSwatch colorCode={option.value} />
                {option.label}
              </>
            )
          }))
        };
      }

      return filter;
    });
  };

  const resolvedFilters = useMemo(() => resolveFilters(data.productFilters), [
    data.productFilters
  ]);
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
    fetchProducts(filters, pageContext.categoryCode, page - 1, PAGE_SIZE);
  };

  const onFiltersChange = async (newFilters) => {
    // NOTE: If filters change, we reset pagination to first page
    const result = await fetchProducts(
      newFilters,
      pageContext.categoryCode,
      0,
      PAGE_SIZE
    );

    if (result && result.aggregations) {
      newFilters = disableFiltersFromAggregations(
        newFilters,
        result.aggregations
      );
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

  // Resets all selected filter values to nothing
  // TODO: This has duplication but didn't want to refactor too much at once
  const clearFilters = () => {
    const newFilters = clearFilterValues(filters);

    onFiltersChange(newFilters);
  };

  const fetchProducts = async (filters, categoryCode, page, pageSize) => {
    if (isLoading) {
      devLog("Already loading...");
      return;
    }

    setIsLoading(true);

    const query = compileElasticSearchQuery(
      filters,
      categoryCode,
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

    setIsLoading(false);

    return results;
  };

  // Fetch ES on mount
  useEffect(() => {
    fetchProducts(filters, pageContext.categoryCode, 0, PAGE_SIZE);
  }, []);

  // NOTE: We wouldn't expect this to change, even if the data somehow came back incorrect,
  // maybe pointless for this value to rely on it as more will break.
  const categoryName = initialProducts[0]?.categories.find(
    ({ code }) => code === pageContext.categoryCode
  )?.name;

  const pageData: PageData = { breadcrumbs, inputBanner, seo };

  const GTMAnchorLink = withGTM<
    AnchorLinkProps & {
      action?: ClickableAction;
    }
  >(AnchorLink);

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
      <SiteContext.Consumer>
        {({ getMicroCopy }) => {
          return (
            <>
              {isLoading ? (
                <Scrim theme="light">
                  <ProgressIndicator theme="light" />
                </Scrim>
              ) : null}
              <Hero
                level={2}
                {...heroProps}
                breadcrumbs={<Breadcrumbs data={breadcrumbs} isDarkThemed />}
              />
              <Section backgroundColor="white">
                <LeadBlock>
                  <LeadBlock.Content>
                    <RichText
                      document={content}
                      underlineHeadings={["h2", "h3", "h4"]}
                    />
                  </LeadBlock.Content>
                  <LeadBlock.Card theme="pearl">
                    {features ? (
                      <LeadBlock.Card.Section>
                        <LeadBlock.Card.Heading hasUnderline>
                          {getMicroCopy("plp.keyFeatures.title")}
                        </LeadBlock.Card.Heading>
                        <LeadBlock.Card.Content>
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
                          {featuresLink && (
                            <AnchorLink
                              action={getClickableActionFromUrl(
                                featuresLink.linkedPage,
                                featuresLink.url,
                                countryCode,
                                featuresLink.asset?.file?.url
                              )}
                            >
                              {featuresLink.label}
                            </AnchorLink>
                          )}
                        </LeadBlock.Card.Content>
                      </LeadBlock.Card.Section>
                    ) : null}
                  </LeadBlock.Card>
                </LeadBlock>
              </Section>
              <Section backgroundColor="pearl">
                {categoryName && (
                  <Section.Title hasUnderline>{categoryName}</Section.Title>
                )}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} lg={3}>
                    <FiltersSidebar
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={clearFilters}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={12}
                    lg={9}
                    style={{ paddingTop: 60 }}
                    ref={resultsElement}
                  >
                    <Grid container spacing={3}>
                      {products.length === 0 && (
                        <Typography>No results found</Typography>
                      )}
                      {flatten(
                        products.map((variant) => {
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
                                  <GTMAnchorLink
                                    iconEnd
                                    gtm={{
                                      id: "selector-cards2",
                                      action: "Selector - Cards"
                                    }}
                                    action={{
                                      model: "routerLink",
                                      linkComponent: Link,
                                      to: getProductUrl(
                                        countryCode,
                                        pageContext.variantCodeToPathMap[
                                          variant.code
                                        ]
                                      )
                                    }}
                                  >
                                    {getMicroCopy("plp.product.viewDetails")}
                                  </GTMAnchorLink>
                                }
                              >
                                {variant.shortDescription}
                              </OverviewCard>
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
            </>
          );
        }}
      </SiteContext.Consumer>
      <Section backgroundColor="alabaster" isSlim>
        <Breadcrumbs data={breadcrumbs} />
      </Section>
    </Page>
  );
};

export default ProductListerPage;

export const pageQuery = graphql`
  query ProductListerPageById(
    $pageId: String!
    $siteId: String!
    $categoryCode: String!
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
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    productFilters(
      pimClassificationCatalogueNamespace: $pimClassificationCatalogueNamespace
      categoryCode: $categoryCode
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
