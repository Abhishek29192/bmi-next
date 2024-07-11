import React from "react";
import Button from "@bmi-digital/components/button";
import Grid from "@bmi-digital/components/grid";
import AddIcon from "@bmi-digital/components/icon/Add";
import RelatedProductCard from "@bmi-digital/components/related-product-card";
import Section from "@bmi-digital/components/section";
import Tabs from "@bmi-digital/components/tabs";
import { microCopy } from "@bmi/microcopies";
import Tab, { TabProps } from "@mui/material/Tab";
import { graphql } from "gatsby";
import NextLink from "next/link";
import { useMemo, useState } from "react";
import { RelatedProduct } from "../types/pim";
import {
  getLevel,
  goodBetterBestLabels
} from "../utils/getGoodBetterBestLabel";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { mapClassificationValues } from "../utils/product-details-transforms";
import BrandLogo from "./BrandLogo";
import { useSiteContext } from "./Site";
import { StyledLoadMoreWrapper } from "./styles/RelatedProducts.styles";

/**
 * Groups resolved product category paths by the 2nd last category in the path
 */
const groupProductsByGroup = (
  products: readonly RelatedProduct[]
): Record<string, RelatedProduct[]> =>
  products.reduce((tabs, product) => {
    product.groups.forEach((tabCategory) => {
      // eslint-disable-next-line security/detect-object-injection
      tabs[tabCategory.label] = [...(tabs[tabCategory.label] || []), product];
    });
    return tabs;
  }, {});

const ProductListing = ({
  countryCode,
  products,
  initialNumberShown = 8,
  pageSize = 8
}: {
  countryCode: string;
  products: readonly RelatedProduct[];
  initialNumberShown?: number;
  pageSize?: number;
}) => {
  const [numberShown, setNumberShown] = useState(initialNumberShown);
  const { getMicroCopy } = useSiteContext();

  const onLoadMore = () => {
    setNumberShown((numberShown) => numberShown + pageSize);
  };

  if (!products.length) {
    // TODO: I don't think this can ever be hit
    return null;
  }

  return (
    <>
      <Grid container spacing={3}>
        {products.slice(0, numberShown).map((product) => {
          const brandLogo = product.brand?.code ? (
            <BrandLogo brandName={product.brand.code} />
          ) : undefined;
          const productUrl = getPathWithCountryCode(countryCode, product.path);

          const uniqueClassifications = mapClassificationValues(product);
          const altText = `${uniqueClassifications} ${product.name}`;

          const gtmLabel = `${product.name}${
            uniqueClassifications ? ` - ${uniqueClassifications}` : ""
          } - ${getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_VIEW_DETAILS)}`;

          return (
            <Grid
              key={`${product.baseCode}-${product.code}`}
              xs={12}
              md={6}
              lg={3}
            >
              <RelatedProductCard
                title={product.name}
                subtitle={uniqueClassifications}
                label={getMicroCopy(microCopy.PDP_NOBB_LABEL)}
                value={product.externalProductCode ?? undefined}
                media={
                  product.masterImage?.mainSource
                    ? {
                        src: product.masterImage.mainSource,
                        alt: altText
                      }
                    : undefined
                }
                tag={
                  product.goodBetterBest && {
                    level: getLevel(product.goodBetterBest),
                    label: getMicroCopy(
                      goodBetterBestLabels[product.goodBetterBest]
                    )
                  }
                }
                brandLogo={brandLogo}
                component={NextLink}
                href={productUrl}
                gtm={{
                  id: "cta-click1",
                  label: gtmLabel,
                  action: productUrl
                }}
                ctaLabel={getMicroCopy(
                  microCopy.PDP_RELATED_PRODUCTS_VIEW_DETAILS
                )}
              />
            </Grid>
          );
        })}
      </Grid>
      {numberShown < products.length ? (
        <StyledLoadMoreWrapper>
          <Button onClick={onLoadMore} variant="outlined" endIcon={<AddIcon />}>
            {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_SHOW_MORE)}
          </Button>
        </StyledLoadMoreWrapper>
      ) : null}
    </>
  );
};

type Props = {
  countryCode: string;
  products: readonly RelatedProduct[];
};

const GTMTab = withGTM<TabProps>(Tab, {
  label: "label"
});

// TODO: Do a context for countryCode and classificationNamespace
const RelatedProducts = ({ countryCode, products }: Props) => {
  const { getMicroCopy } = useSiteContext();

  const productGroups = useMemo(
    () => groupProductsByGroup(products),
    [products]
  );

  if (!Object.keys(productGroups).length) {
    return null;
  }

  return (
    <Section
      backgroundColor="alabaster"
      data-testid={`related-products-section`}
    >
      <Section.Title>
        {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_TITLE)}
      </Section.Title>
      <div>
        <Tabs
          color="secondary"
          initialValue={Object.keys(productGroups)[0]}
          tabComponent={(props: TabProps) => (
            <GTMTab
              gtm={{
                id: "related-products-filter1",
                action: "Filter – Related Products"
              }}
              {...props}
            />
          )}
        >
          {Object.entries(productGroups).map(([category, products]) => {
            return (
              <Tabs.TabPanel heading={category} index={category} key={category}>
                <ProductListing countryCode={countryCode} products={products} />
              </Tabs.TabPanel>
            );
          })}
        </Tabs>
      </div>
    </Section>
  );
};

export default RelatedProducts;

export const query = graphql`
  fragment RelatedProductFragment on Product {
    baseCode
    baseScoringWeight
    brand {
      ...PIMBrandFragment
    }
    code
    colour
    colourFamily
    externalProductCode
    goodBetterBest
    masterImage {
      ...PIMImageFragment
    }
    measurements {
      ...MeasurementsFragment
    }
    name
    path
    groups {
      label
      code
    }
  }
`;
