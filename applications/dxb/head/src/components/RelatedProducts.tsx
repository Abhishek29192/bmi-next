import {
  AnchorLink,
  Button,
  Grid,
  OverviewCard,
  OverviewCardProps,
  Section,
  Tabs
} from "@bmi-digital/components";
import AddIcon from "@mui/icons-material/Add";
import Tab, { TabProps } from "@mui/material/Tab";
import { Link, graphql } from "gatsby";
import React, { useMemo, useState } from "react";
import { microCopy } from "../constants/microCopies";
import DefaultImage from "../images/DefaultImage.svg";
import { RelatedProduct } from "../types/pim";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { mapClassificationValues } from "../utils/product-details-transforms";
import { renderMedia } from "../utils/renderMedia";
import { iconMap } from "./Icon";
import { useSiteContext } from "./Site";
import styles from "./styles/RelatedProducts.module.scss";

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
          // eslint-disable-next-line security/detect-object-injection
          const brandLogo = iconMap[product.brand?.code];
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
                data-testid="GTMOverviewCard"
                media={
                  renderMedia(product.masterImage?.mainSource, altText) || (
                    <DefaultImage />
                  )
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
                  <AnchorLink component="span" iconEnd>
                    {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_VIEW_DETAILS)}
                  </AnchorLink>
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
        <div className={styles["load-more-wrapper"]}>
          <Button onClick={onLoadMore} variant="outlined" endIcon={<AddIcon />}>
            {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_SHOW_MORE)}
          </Button>
        </div>
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
    <Section backgroundColor="alabaster">
      <Section.Title>
        {getMicroCopy(microCopy.PDP_RELATED_PRODUCTS_TITLE)}
      </Section.Title>
      <div className={styles["RelatedProducts"]}>
        <Tabs
          theme="secondary"
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
