import React from "react";
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
import { Document } from "@contentful/rich-text-types";
import RichText from "../components/RichText";
import Button from "@bmi/button";
import Filters from "@bmi/filters";
import Typography from "@bmi/typography";
import OverviewCard from "@bmi/overview-card";
import { iconMap } from "../components/Icon";
import Grid from "@bmi/grid";

export type PageInfoData = {
  __typename: "ContentfulProductListerPage";
  title: string;
  subtitle: string | null;
  brandLogo: string | null;
  slug: string;
  featuredImage: {
    title: string;
    file: {
      fileName: string;
      url: string;
    };
  } | null;
};

type Data = PageInfoData &
  PageData & {
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
  };
  data: {
    contentfulProductListerPage: Data;
    contentfulSite: SiteData;
    allProducts: any;
  };
};

const BlueCheckIcon = <CheckIcon style={{ color: "#009fe3" }} />;

// TODO: Move this in the product-details-transform
const findMasterImageUrl = (images): string => {
  return _.result<string>(
    _.find(images, {
      assetType: "MASTER_IMAGE",
      format: "Product-Listing-Card-Large-Desktop"
    }),
    "url"
  );
};
const getSlug = (countryCode, string) =>
  `/${countryCode}/products/${string.toLowerCase().replace(/[-_\s]+/gi, "-")}`;

const IntegratedFilters = (props) => {
  const filters = [
    {
      label: "Product Type",
      name: "product",
      value: ["tiles"],
      options: [
        {
          label: "Tiles",
          value: "tiles"
        },
        {
          label: "Covers",
          value: "covers"
        }
      ]
    },
    {
      label: "Colour",
      name: "color",
      options: [
        {
          label: "Black",
          value: "black"
        },
        {
          label: "Grey",
          value: "grey",
          isDisabled: true
        }
      ]
    }
  ];

  const [state, setState] = React.useState(filters);

  const handleCheckboxChange = (filterName, filterValue, checked) => {
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
    ).length,
    3
  ) || 1) as 1 | 2 | 3;
  const { nodes: products } = data.allProducts;
  const categoryName = products[0]?.categories.find(
    ({ code }) => code === pageContext.categoryCode
  )?.name;

  // console.log("categoryName", products[0]?.categories);

  return (
    <Page title={title} pageData={pageData} siteData={data.contentfulSite}>
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
                <IntegratedFilters />
              </div>
            </Grid>
            <Grid item xs={12} md={12} lg={9}>
              <Grid container spacing={3}>
                {_.flatten(
                  products
                    .filter(({ variantOptions }) => variantOptions)
                    .map((product, index) => {
                      const brandLogoCode = _.result<string>(
                        _.find(product.categories, {
                          parentCategoryCode: "BMI_Brands"
                        }),
                        "code"
                      );
                      const brandLogo = iconMap[brandLogoCode];

                      return product.variantOptions.map((variant) => {
                        const mainImage = findMasterImageUrl([
                          ...(variant.images || []),
                          ...(product.images || [])
                        ]);

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
                              imageSource={mainImage}
                              brandImageSource={brandLogo}
                              footer={
                                <AnchorLink
                                  iconEnd
                                  action={{
                                    model: "routerLink",
                                    linkComponent: Link,
                                    to: getSlug(countryCode, variant.code)
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
      ...ProductListerPageInfoFragment
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
        variantOptions {
          code
          shortDescription
          images {
            assetType
            containerId
            url
            format
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
