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
import { Product } from "./product-details-page";
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
  ProductCategoryTree
} from "../utils/product-details-transforms";

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
    (filters, [category, values]) => {
      return [
        ...filters,
        {
          // TODO: Get actual label
          label: category,
          name: category,
          value: [],
          options: values.map((category) => ({
            label: category.name,
            value: category.code
          }))
        }
      ];
    },
    []
  );
};

const queryES = async (query = {}) => {
  // TODO: Point of using the proxy would be to not expose the index I guess
  const indexName = "nodetest_products";
  const url = `http://localhost:3000/${indexName}/_search`;

  if (window.fetch) {
    try {
      const response = await fetch(url, {
        method: "POST",
        mode: "cors",
        headers: {
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

const compileElasticSearchQuery = (state, categoryCode, pageSize): object => {
  const categoryFilters = [];

  state.forEach((filter) => {
    // If no values chosen, ignore it
    if (!filter.value.length) {
      return;
    }

    console.log("Filter:", filter.name);

    // TODO: For not identifying the filters we know are for categories
    const PRODUCT_FILTERS_CODES = [
      "TILES_STEELROOF_NO",
      "PRODUCTS",
      "PRODUCTS_NO",
      "ROOF",
      "ROOF_NO",
      "PITCHEDROOF_COMPONENTS",
      "SAFETY",
      "FIXINGS",
      "FIXING_PITCHEDROOF_NO",
      "SNOW",
      "SNOW_&_SECURITY_PITCHEDROOF_NO",
      "VENTILATIONS_PITCHEDROOF"
    ];

    // TODO: Have code instead of name?
    if (PRODUCT_FILTERS_CODES.includes(filter.name)) {
      // TODO: This category is an insurance to make sure it's a child cat of specific cat
      // This is because the data in ES is flat and overlapping categories could mean the query is innacurate
      const matchParentCategory = {
        match: {
          "categories.parentCategoryCode.keyword": filter.name
        }
      };

      const matchChildrenCategories =
        filter.value.length === 1
          ? {
              match: {
                "categories.code.keyword": filter.value[0]
              }
            }
          : {
              bool: {
                should: filter.value.map((value) => ({
                  match: {
                    "categories.code.keyword": value
                  }
                }))
              }
            };

      categoryFilters.push({
        bool: {
          // NOTE: This was not working as intended. I believe it was doing an OR instead???
          // I meant for it to match parent and child cats in the same object, but it didn't do that I think...
          must: [/*matchParentCategory,*/ matchChildrenCategories]
        }
      });
    }
  });

  // NOTE: ES Doesn't like an empty query object
  return {
    size: pageSize,
    // TODO: Join in a bool if multiple categories with multiple values
    // TODO: Still not sure how to handle this exactly
    query: {
      bool: {
        must: [
          {
            match: {
              "categories.code.keyword": categoryCode
            }
          },
          ...categoryFilters
        ]
      }
    }
  };
};

const IntegratedFilters = ({
  categoryCode,
  productCategories,
  onStartFetching,
  onFinishFetching
}: {
  categoryCode: string;
  productCategories: ProductCategoryTree;
  onStartFetching?: () => void;
  onFinishFetching?: (hits: readonly Product[], totalHits: number) => void;
}) => {
  const filters = getFilters(productCategories);

  const [state, setState] = React.useState(filters);

  const handleCheckboxChange = async (filterName, filterValue, checked) => {
    const addToArray = (array, value) => [...array, value];
    const removeFromArray = (array, value) => array.filter((v) => v !== value);
    const getNewValue = (filter, checked, value) => {
      return checked
        ? addToArray(filter.value || [], filterValue)
        : removeFromArray(filter.value || [], filterValue);
    };

    const newState = state.map((filter) => {
      return {
        ...filter,
        value:
          filter.name === filterName
            ? getNewValue(filter, checked, filterValue)
            : filter.value
      };
    });

    setState(newState);

    onStartFetching && onStartFetching();

    const query = compileElasticSearchQuery(newState, categoryCode, PAGE_SIZE);
    console.log({ query: JSON.stringify(query) });

    // TODO: If no query returned, empty query, show default results?
    const results = await queryES(query);

    const { hits } = results;

    // TODO: Don't quite understand details around the hits.total value
    console.log({ totalHits: hits.total.value, hits: hits.hits });
    onFinishFetching &&
      onFinishFetching(
        hits.hits.map((hit) => hit._source),
        hits.total.value
      );
  };

  return <Filters filters={state} onChange={handleCheckboxChange} />;
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
  const { nodes: initialProducts } = data.allProducts;

  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [totalProducts, setTotalProducts] = useState(products.length);

  // NOTE: We wouldn't expect this to change, even if the data somehow came back incorrect, maybe pointless for this value to rely on it as more will break.
  // const categoryName = "AeroDek Robust Plus";
  const categoryName = products[0]?.categories.find(
    ({ code }) => code === pageContext.categoryCode
  )?.name;

  // TODO: What if data.allProducts prop changes. I think practically it would not, but can we ensure that in code?
  // Refactor to a wrapper component that takes initialProps and they're then in state or ref? (ProductListing?)

  const allCategories = findAllCategories(products);
  console.log({ products, allCategories });

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
      {categoryName && (
        <Section backgroundColor="pearl">
          <Section.Title hasUnderline>{categoryName}</Section.Title>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={3}>
              <div style={{ position: "sticky", top: "180px" }}>
                <Filters filters={filters} onChange={handleFiltersChange} />
              </div>
            </Grid>
            <Grid item xs={12} md={12} lg={9}>
              <Grid container spacing={3}>
                {_.flatten(
                  products
                    .filter(({ variantOptions }) => variantOptions)
                    .map((product, index) => {
                      const brandLogoCode = findProductBrandLogoCode(product);
                      const brandLogo = iconMap[brandLogoCode];

                      return product.variantOptions.map((variant) => {
                        const mainImage = findMasterImageUrl([
                          ...(variant.images || []),
                          ...(product.images || [])
                        ]);

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
                      });
                    })
                )}
              </Grid>
            </Grid>
          </Grid>
        </Section>
      )}
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
