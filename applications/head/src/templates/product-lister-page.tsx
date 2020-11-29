import React, { useEffect, useState } from "react";
import { Link, graphql } from "gatsby";
import _ from "lodash";
import Breadcrumbs, { findPath } from "../components/Breadcrumbs";
import Page, { Data as PageData } from "../components/Page";
import Hero, { HeroItem } from "@bmi/hero";
import { Data as SiteData } from "../components/Site";
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
import ColorSwatch from "../components/ColorSwatch";
import Typography from "@bmi/typography";
import {
  getProductUrl,
  findMasterImageUrl,
  findProductBrandLogoCode,
  mapClassificationValues,
  findUniqueVariantClassifications,
  getGroupCategory,
  getLeafCategory,
  getFullCategoriesPaths,
  Category,
  findAllCategories,
  ProductCategoryTree,
  mapProductClassifications
} from "../utils/product-details-transforms";
import Button from "@bmi/button";
import PerfectScrollbar from "@bmi/perfect-scrollbar";

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

const getFilters = (productCategories: ProductCategoryTree) => {
  return Object.entries(productCategories).reduce(
    (filters, [categoryKey, category]) => {
      return [
        ...filters,
        {
          label: category.name,
          name: categoryKey,
          value: [],
          options: category.values.map((category) => ({
            label: category.name,
            value: category.code
          }))
        }
      ];
    },
    []
  );
};

// Gets the values of colourfamily classification for the Filters pane
const getColorFilter = (
  classificationNamespace: string,
  products: readonly Product[]
) => {
  const colorFilters = products
    .reduce((allColors, product) => {
      const productClassifications = mapProductClassifications(
        product,
        classificationNamespace
      );

      return [
        ...allColors,
        ...Object.values(productClassifications).map((classifications: any) => {
          return classifications.colourfamily;
        })
      ];
    }, [])
    .filter(Boolean);

  // Assuming all colours have the same label
  const label = colorFilters[0]?.name;
  const values = _.uniqBy(_.map(colorFilters, "value"), "code");

  return {
    label,
    name: "colour",
    value: [],
    options: values.map(({ code, value }) => ({
      label: (
        <>
          <ColorSwatch colorCode={code} />
          {value}
        </>
      ),
      value: code
    }))
  };
};

const queryES = async (query = {}) => {
  const indexName = "nodetest_v3_products";
  const url = `${process.env.ES_ENDPOINT}/${indexName}/_search`;

  if (window.fetch) {
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          authorization: `Basic ${btoa(
            `${process.env.ES_USERNAME}:${process.env.ES_PASSWORD}`
          )}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(query)
      });

      const content = await response.json();

      if (!response.ok) {
        console.log(`ERROR: ${response.status}, ${response.statusText}`);
      }

      console.log({ content });
      return content;
    } catch (error) {
      console.log("Error fetching ES", error);
    }
  } else {
    console.log("NO fetch");
  }
};

const compileElasticSearchQuery = (
  filters,
  categoryCode,
  page,
  pageSize
): object => {
  const categoryFilters = [];

  const searchTerms = {
    colour: "classifications.features.featureValues.code.keyword",
    category: "categories.code.keyword",
    allCategories: "allCategories.code.keyword"
  };

  console.log({ filters });

  filters.forEach((filter) => {
    // If no values chosen, ignore it
    if (!filter.value.length) {
      return;
    }

    console.log("Filter:", filter.name);

    if (filter.name === "colour") {
      // TODO: Not sure if this is solid enough since other classifications other than "colourfamily"
      // have featureValues.code
      const colourTermQuery = (value) => ({
        term: {
          [searchTerms.colour]: value
        }
      });
      const coloursQuery =
        filter.value.length === 1
          ? colourTermQuery(filter.value[0])
          : {
              bool: {
                should: filter.value.map(colourTermQuery)
              }
            };

      categoryFilters.push(coloursQuery);
    } else {
      const categoriesQuery =
        filter.value.length === 1
          ? {
              term: {
                [searchTerms.category]: filter.value[0]
              }
            }
          : {
              bool: {
                should: filter.value.map((value) => ({
                  term: {
                    [searchTerms.category]: value
                  }
                }))
              }
            };

      categoryFilters.push(categoriesQuery);
    }
  });

  // NOTE: ES Doesn't like an empty query object
  return {
    size: pageSize,
    from: page * pageSize,
    sort: [{ "scoringWeight.keyword": "desc" }, { "name.keyword": "asc" }],
    aggs: {
      categories: {
        terms: {
          // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
          // Could request these separately, and figure out a way of retrying and getting more buckets if needed
          size: "100",
          field: "categories.code.keyword"
        }
      },
      colors: {
        terms: {
          size: "100",
          field: "classifications.features.featureValues.code.keyword"
        }
      }
    },
    // TODO: Join in a bool if multiple categories with multiple values
    // TODO: Still not sure how to handle this exactly
    query: {
      bool: {
        must: [
          {
            term: {
              [searchTerms.allCategories]: categoryCode
            }
          },
          ...categoryFilters
        ]
      }
    }
  };
};

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
  // Initially set to value from server render, later set from ES
  const [totalProducts, setTotalProducts] = useState(products.length);
  const allCategories = findAllCategories(data.allProducts.nodes);
  const colorFilter = getColorFilter(
    pageContext.pimClassificationCatalogueNamespace,
    data.allProducts.nodes
  );
  const [filters, setFilters] = useState([
    ...getFilters(allCategories),
    colorFilter
  ]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
  );

  const handleFiltersChange = async (filterName, filterValue, checked) => {
    const addToArray = (array, value) => [...array, value];
    const removeFromArray = (array, value) => array.filter((v) => v !== value);
    const getNewValue = (filter, checked, value) => {
      return checked
        ? addToArray(filter.value || [], filterValue)
        : removeFromArray(filter.value || [], filterValue);
    };

    const newFilters = filters.map((filter) => {
      return {
        ...filter,
        value:
          filter.name === filterName
            ? getNewValue(filter, checked, filterValue)
            : filter.value
      };
    });

    setFilters(newFilters);
  };

  // Resets all selected filter values to nothing
  const clearFilters = () => {
    setFilters((filters) => {
      return filters.map((filter) => ({
        ...filter,
        value: []
      }));
    });
  };

  const fetchProducts = async (filters, categoryCode, page, pageSize) => {
    if (isLoading) {
      console.log("Already loading...");
      return;
    }

    console.log("STARTED FETCHING...");
    setIsLoading(true);

    const query = compileElasticSearchQuery(
      filters,
      categoryCode,
      page,
      pageSize
    );
    console.log({ query: query });

    // TODO: If no query returned, empty query, show default results?
    // TODO: Handle if no response
    const results = await queryES(query);

    if (results && results.hits) {
      const { hits } = results;
      const newPageCount = Math.ceil(hits.total.value / PAGE_SIZE);

      setTotalProducts(hits.total.value);
      setPageCount(newPageCount);
      setProducts(hits.hits.map((hit) => hit._source));

      // TODO: Don't quite understand details around the hits.total value
      console.log({ totalHits: hits.total.value, hits: hits.hits });
    }

    setIsLoading(false);
    console.log("FINISHED FETCHING!");
  };

  useEffect(() => {
    fetchProducts(filters, pageContext.categoryCode, page, PAGE_SIZE);
  }, [page]);

  // NOTE: If filters change, we reset pagination to first page
  useEffect(() => {
    fetchProducts(filters, pageContext.categoryCode, 0, PAGE_SIZE);
  }, [filters]);

  // NOTE: We wouldn't expect this to change, even if the data somehow came back incorrect, maybe pointless for this value to rely on it as more will break.
  // const categoryName = "AeroDek Robust Plus";
  const categoryName = initialProducts[0]?.categories.find(
    ({ code }) => code === pageContext.categoryCode
  )?.name;

  // TODO: What if data.allProducts prop changes. I think practically it would not, but can we ensure that in code?
  // Refactor to a wrapper component that takes initialProps and they're then in state or ref? (ProductListing?)

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
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
                  Key features
                </LeadBlock.Card.Heading>
                <LeadBlock.Card.Content>
                  <IconList>
                    {features.map((feature, index) => (
                      <IconList.Item
                        key={index}
                        icon={BlueCheckIcon}
                        title={feature}
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
                <Typography variant="h5">Filters</Typography>
                <Button variant="text" onClick={clearFilters}>
                  Clear All
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
                              to: getProductUrl(countryCode, variant.code)
                            }}
                          >
                            View details
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
                setPage(page - 1);
              }}
              count={pageCount}
            />
          </Grid>
        </Grid>
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
