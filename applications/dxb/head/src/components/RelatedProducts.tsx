import Button from "@bmi-digital/components/button";
import Grid from "@bmi-digital/components/grid";
import AddIcon from "@bmi-digital/components/icon/Add";
import OverviewCard, {
  OverviewCardProps
} from "@bmi-digital/components/overview-card";
import Section from "@bmi-digital/components/section";
import Tabs from "@bmi-digital/components/tabs";
import { microCopy } from "@bmi/microcopies";
import Tab, { TabProps } from "@mui/material/Tab";
import { graphql, Link } from "gatsby";
import React, { useMemo, useState } from "react";
import DefaultImage from "../images/DefaultImage.svg";
import { RelatedProduct } from "../types/pim";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { mapClassificationValues } from "../utils/product-details-transforms";
import { renderMedia } from "../utils/renderMedia";
import BrandLogo from "./BrandLogo";
import GoodBetterBestIndicator from "./GoodBetterBestIndicator";
import { useSiteContext } from "./Site";
import {
  StyledLoadMoreWrapper,
  StyledReadMoreAnchor
} from "./styles/RelatedProducts.styles";

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

const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

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
          const brandLogo = <BrandLogo brandName={product.brand?.code} />;
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
              <GTMOverviewCard
                title={product.name}
                titleVariant="h5"
                subtitle={uniqueClassifications}
                subtitleVariant="h6"
                imageSize="contain"
                media={
                  renderMedia(product.masterImage?.mainSource, altText) || (
                    <DefaultImage />
                  )
                }
                tag={
                  <GoodBetterBestIndicator
                    indicatorType={product.goodBetterBest}
                  />
                }
                brandImageSource={brandLogo}
                action={{
                  model: "routerLink",
                  linkComponent: Link,
                  to: productUrl
                }}
                gtm={{
                  id: "cta-click1",
                  label: gtmLabel,
                  action: productUrl
                }}
                footer={
                  <StyledReadMoreAnchor component="span" iconEnd>
                    {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_VIEW_DETAILS)}
                  </StyledReadMoreAnchor>
                }
              >
                {product.externalProductCode !== null &&
                product.externalProductCode !== "" ? (
                  <>
                    {getMicroCopy(microCopy.PDP_NOBB_LABEL)}:{" "}
                    <b>{product.externalProductCode}</b>
                  </>
                ) : (
                  ""
                )}
              </GTMOverviewCard>
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
