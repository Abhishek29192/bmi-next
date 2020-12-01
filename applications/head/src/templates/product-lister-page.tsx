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
  mapClassificationValues,
  findUniqueVariantClassifications,
  findAllCategories,
  ProductCategoryTree,
  mapProductClassifications
} from "../utils/product-details-transforms";
import Button from "@bmi/button";
import PerfectScrollbar from "@bmi/perfect-scrollbar";

const devLog = (...args) => {
  /* istanbul ignore next */
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

const sortAlphabeticallyBy = (propName) => (a, b) => {
  if (a[propName] < b[propName]) {
    return -1;
  }
  if (a[propName] > b[propName]) {
    return 1;
  }
  return 0;
};

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

const getProductFamilyFilter = (products: readonly Product[]) => {
  const allFamilyCategories = _.uniqBy(
    products.reduce((allCategories, product) => {
      const productFamilyCategories = (product.categories || []).filter(
        ({ categoryType }) => categoryType === "ProductFamily"
      );

      return [...allCategories, ...productFamilyCategories];
    }, []),
    "code"
  );

  return {
    label: "Product Family",
    name: "Produktfamilie",
    value: [],
    options: allFamilyCategories
      .sort(sortAlphabeticallyBy("name"))
      .map((category) => ({
        label: category.name,
        value: category.code
      }))
  };
};

const getCategoryFilters = (productCategories: ProductCategoryTree) => {
  return Object.entries(productCategories)
    .sort((a, b) => {
      if (a[1]["name"] < b[1]["name"]) {
        return -1;
      }
      if (a[1]["name"] > b[1]["name"]) {
        return 1;
      }
      return 0;
    })
    .reduce((filters, [categoryKey, category]) => {
      return [
        ...filters,
        {
          label: category.name,
          name: categoryKey,
          value: [],
          options: category.values
            .sort(sortAlphabeticallyBy("name"))
            .map((category) => ({
              label: category.name,
              value: category.code
            }))
        }
      ];
    }, []);
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
    options: values
      .sort(sortAlphabeticallyBy("value"))
      .map(({ code, value }) => ({
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

// Gets the values of materialfamily classification for the Filters pane
const getTextureFilter = (
  classificationNamespace: string,
  products: readonly Product[]
) => {
  const textures = products
    .reduce((allTextures, product) => {
      const productClassifications = mapProductClassifications(
        product,
        classificationNamespace
      );

      return [
        ...allTextures,
        ...Object.values(productClassifications).map((classifications: any) => {
          return classifications.texturefamily;
        })
      ];
    }, [])
    .filter(Boolean);

  // Assuming all texturefamily classifications have the same label
  const label = textures[0]?.name;
  const values = _.uniqBy(_.map(textures, "value"), "code");

  return {
    label,
    name: "texturefamily",
    value: [],
    options: values
      .sort(sortAlphabeticallyBy("value"))
      .map(({ code, value }) => ({
        label: value,
        value: code
      }))
  };
};

const queryES = async (query = {}) => {
  const indexName = "nodetest_v3_products";
  const url = `${process.env.GATSBY_ES_ENDPOINT}/${indexName}/_search`;

  if (window.fetch) {
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
          authorization: `Basic ${btoa(
            `${process.env.GATSBY_ES_USERNAME}:${process.env.GATSBY_ES_PASSWORD}`
          )}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(query)
      });

      const content = await response.json();

      if (!response.ok) {
        devLog(`ERROR: ${response.status}, ${response.statusText}`);
      }
      return content;
    } catch (error) {
      devLog("Error fetching ES", error);
    }
  } else {
    devLog("NO fetch");
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
    colour: "colourfamilyCode.keyword",
    texturefamily: "texturefamilyCode.keyword",
    category: "categories.code.keyword",
    // TODO: MAY NEED TO SPLIT THIS INTO A SEPARATE THING, but seems to work
    productFamily: "otherCategories.code.keyword",
    otherCategories: "otherCategories.code.keyword"
  };

  filters.forEach((filter) => {
    // If no values chosen, ignore it
    if (!filter.value.length) {
      return;
    }

    if (filter.name === "colour") {
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
    } else if (filter.name === "texturefamily") {
      const textureTermQuery = (value) => ({
        term: {
          [searchTerms.texturefamily]: value
        }
      });
      const texturesQuery =
        filter.value.length === 1
          ? textureTermQuery(filter.value[0])
          : {
              bool: {
                should: filter.value.map(textureTermQuery)
              }
            };

      categoryFilters.push(texturesQuery);
      // TODO: This is at this point generic
    } else if (filter.name === "productFamily") {
      const queryTerm = (value) => ({
        term: {
          [searchTerms.productFamily]: value
        }
      });
      const query =
        filter.value.length === 1
          ? queryTerm(filter.value[0])
          : {
              bool: {
                should: filter.value.map(queryTerm)
              }
            };

      categoryFilters.push(query);
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
      otherCategories: {
        terms: {
          // NOTE: returns top 10 buckets by default. 100 is hopefully way more than is needed
          // Could request these separately, and figure out a way of retrying and getting more buckets if needed
          size: "100",
          field: "otherCategories.code.keyword"
        }
      },
      texturefamily: {
        terms: {
          size: "100",
          field: "texturefamilyCode.keyword"
        }
      },
      colourfamily: {
        terms: {
          size: "100",
          field: "colourfamilyCode.keyword"
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
              [searchTerms.otherCategories]: categoryCode
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
  const textureFilter = getTextureFilter(
    pageContext.pimClassificationCatalogueNamespace,
    data.allProducts.nodes
  );
  const productFamilyFilter = getProductFamilyFilter(data.allProducts.nodes);
  const [filters, setFilters] = useState([
    productFamilyFilter,
    colorFilter,
    textureFilter,
    ...getCategoryFilters(allCategories)
  ]);
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(
    Math.ceil(products.length / PAGE_SIZE)
  );

  const disableFiltersFromAggregations = (filters, aggregations) => {
    const aggregationNames = {
      // TODO: Rename filter.name to colourfamily
      colour: "colourfamily",
      texturefamily: "texturefamily",
      productFamily: "otherCategories"
    };

    return filters.map((filter) => {
      return {
        ...filter,
        options: filter.options.map((option) => {
          // NOTE: all other filters are assumed to be categories
          const aggregationName = aggregationNames[filter.name] || "categories";
          const buckets = aggregations[aggregationName]?.buckets;

          const aggregate = (buckets || []).find(
            ({ key }) => key === option.value
          );

          return {
            ...option,
            isDisabled: !(aggregate && aggregate.doc_count > 0)
          };
        })
      };
    });
  };

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
    const results = await queryES(query);

    if (results && results.hits) {
      const { hits } = results;
      const newPageCount = Math.ceil(hits.total.value / PAGE_SIZE);

      setTotalProducts(hits.total.value);
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
                handlePageChange(page - 1);
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
