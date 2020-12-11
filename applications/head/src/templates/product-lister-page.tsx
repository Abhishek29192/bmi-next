import React, { useEffect, useMemo, useState } from "react";
import { Link, graphql } from "gatsby";
import _ from "lodash";
import Breadcrumbs, { findPath } from "../components/Breadcrumbs";
import Page, { Data as PageData } from "../components/Page";
import Hero, { HeroItem } from "@bmi/hero";
import { Data as SiteData, SiteContext } from "../components/Site";
import LeadBlock from "@bmi/lead-block";
import Section from "@bmi/section";
import CheckIcon from "@material-ui/icons/Check";
import IconList from "@bmi/icon-list";
import AnchorLink from "@bmi/anchor-link";
import { LinkData, getClickableActionFromUrl } from "../components/Link";
import { Data as PageInfoData } from "../components/PageInfo";
import { Document } from "@contentful/rich-text-types";
import RichText from "../components/RichText";
import Filters from "@bmi/filters";
import OverviewCard from "@bmi/overview-card";
import { iconMap } from "../components/Icon";
import ProgressIndicator from "../components/ProgressIndicator";
import Scrim from "../components/Scrim";
import Grid from "@bmi/grid";
import Pagination from "@bmi/pagination";
import { Product } from "./product-details-page";
import Typography from "@bmi/typography";
import {
  getProductUrl,
  findMasterImageUrl,
  mapClassificationValues,
  findUniqueVariantClassifications
} from "../utils/product-details-transforms";
import { getFilters } from "../utils/filters";
import Button from "@bmi/button";
import PerfectScrollbar from "@bmi/perfect-scrollbar";
import {
  queryElasticSearch,
  compileElasticSearchQuery,
  disableFiltersFromAggregations
} from "../utils/elasticSearch";
import { devLog } from "../utils/devLog";

const PAGE_SIZE = 24;

type Data = PageInfoData &
  PageData & {
    __typename: "ContentfulProductListerPage";
    content: {
      json: Document;
    };
    features: string[] | null;
    featuresLink: LinkData | null;
  };

type Props = {
  pageContext: {
    // productId: string;
    variantCode?: string;
    siteId: string;
    countryCode: string;
    categoryCode: string;
    pimClassificationCatalogueNamespace: string;
  };
  data: {
    contentfulProductListerPage: Data;
    contentfulSite: SiteData;
    allProducts: {
      nodes: ReadonlyArray<Product>;
    };
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
    ...pageData
  } = data.contentfulProductListerPage;
  const heroProps: HeroItem = {
    title,
    children: subtitle,
    imageSource: featuredImage?.file.url
  };
  const { countryCode } = data.contentfulSite;
  const heroLevel = (Math.min(
    findPath(
      data.contentfulProductListerPage.slug,
      data.contentfulSite.menuNavigation
    ).length + 1,
    3
  ) || 1) as 1 | 2 | 3;
  // TODO: Ignoring gatsby data for now as fetching with ES
  // const { nodes: initialProducts } = data.allProducts;
  const initialProducts = [];

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(initialProducts);

  const pageCategory = useMemo(() => {
    for (let i = 0; i < data.allProducts.nodes.length; i++) {
      const { categories } = data.allProducts.nodes[i];

      const category = (categories || []).find(
        ({ code }) => code === pageContext.categoryCode
      );

      if (category) {
        return category;
      }
    }
  }, [data.allProducts.nodes]);
  const [filters, setFilters] = useState(
    pageCategory
      ? getFilters(
          pageCategory,
          pageContext.pimClassificationCatalogueNamespace,
          data.allProducts.nodes
        )
      : []
  );
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
  );

  const handlePageChange = (page) => {
    fetchProducts(filters, pageContext.categoryCode, page, PAGE_SIZE);
  };

  const handleFiltersChange = async (filterName, filterValue, checked) => {
    const addToArray = (array, value) => [...array, value];
    const removeFromArray = (array, value) => array.filter((v) => v !== value);
    const getNewValue = (filter, checked, value) => {
      return checked
        ? addToArray(filter.value || [], filterValue)
        : removeFromArray(filter.value || [], filterValue);
    };

    let newFilters = filters.map((filter) => {
      return {
        ...filter,
        value:
          filter.name === filterName
            ? getNewValue(filter, checked, filterValue)
            : filter.value
      };
    });

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

  // Resets all selected filter values to nothing
  // TODO: This has duplication but didn't want to refactor too much at once
  const clearFilters = async () => {
    let newFilters = filters.map((filter) => ({
      ...filter,
      value: []
    }));

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
    const results = await queryElasticSearch(query);

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
                level={heroLevel}
                {...heroProps}
                breadcrumbs={
                  <Breadcrumbs
                    title={title}
                    slug={data.contentfulProductListerPage.slug}
                    menuNavigation={data.contentfulSite.menuNavigation}
                    isDarkThemed={heroLevel !== 3}
                  />
                }
              />
              <Section backgroundColor="white">
                <LeadBlock>
                  <LeadBlock.Content>
                    <RichText document={content.json} />
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
                                countryCode
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
                      <Filters
                        filters={filters}
                        onChange={handleFiltersChange}
                      />
                    </PerfectScrollbar>
                  </Grid>
                  <Grid item xs={12} md={12} lg={9} style={{ paddingTop: 60 }}>
                    <Grid container spacing={3}>
                      {products.length === 0 && (
                        <Typography>No results found</Typography>
                      )}
                      {_.flatten(
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
                                  <AnchorLink
                                    iconEnd
                                    action={{
                                      model: "routerLink",
                                      linkComponent: Link,
                                      to: getProductUrl(
                                        countryCode,
                                        variant.code
                                      )
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
                        })
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                {/* TODO: Not sure if the spacing aligns correctly, also, offset? */}
                <Grid container style={{ marginTop: 48, marginBottom: 48 }}>
                  <Grid item xs={12} md={6} lg={9}></Grid>
                  <Grid item xs={12} md={6} lg={3}>
                    <Pagination
                      page={page + 1}
                      onChange={(_, page) => {
                        handlePageChange(page - 1);
                      }}
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
        <Breadcrumbs
          title={title}
          slug={data.contentfulProductListerPage.slug}
          menuNavigation={data.contentfulSite.menuNavigation}
        />
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
  ) {
    contentfulProductListerPage(id: { eq: $pageId }) {
      ...PageInfoFragment
      content {
        json
      }
      features
      featuresLink {
        ...LinkFragment
      }
    }
    contentfulSite(id: { eq: $siteId }) {
      ...SiteFragment
    }
    allProducts(
      filter: { categories: { elemMatch: { code: { eq: $categoryCode } } } }
    ) {
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

export const promoQuery = graphql`
  fragment ProductListerPageInfoFragment on ContentfulProductListerPage {
    title
    subtitle
    brandLogo
    slug
    featuredImage {
      file {
        fileName
        url
      }
    }
  }
`;
