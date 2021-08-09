import React, { useMemo, useState } from "react";
import Tabs from "@bmi/tabs";
import { Link, graphql } from "gatsby";
import { Tab, TabProps } from "@material-ui/core";
import { Add as AddIcon } from "@material-ui/icons";
import Grid from "@bmi/grid";
import OverviewCard, { OverviewCardProps } from "@bmi/overview-card";
import AnchorLink from "@bmi/anchor-link";
import Button from "@bmi/button";
import Section from "@bmi/section";
import { uniqBy } from "lodash";
import withGTM from "../utils/google-tag-manager";
import { iconMap } from "../components/Icon";
import {
  getProductUrl,
  findMasterImageUrl,
  findProductBrandLogoCode,
  mapClassificationValues,
  groupProductsByCategory,
  findUniqueVariantClassifications
} from "../utils/product-details-transforms";
import { Product, VariantOption } from "./types/ProductBaseTypes"; // Hmmmmmm
import styles from "./styles/RelatedProducts.module.scss";
import { useSiteContext } from "./Site";

const ProductListing = ({
  countryCode,
  classificationNamespace,
  products,
  initialNumberShown = 8,
  pageSize = 8
}: {
  countryCode: string;
  classificationNamespace: string;
  products: ReadonlyArray<Product>;
  initialNumberShown?: number;
  pageSize?: number;
}) => {
  const [numberShown, setNumberShown] = useState(initialNumberShown);
  const { getMicroCopy } = useSiteContext();

  const onLoadMore = () => {
    setNumberShown((numberShown) => numberShown + pageSize);
  };

  const allVariants = useMemo(
    () =>
      uniqBy(products, (product) => product.name)
        .sort((a, b) => {
          // NOTE: Sort only by base product scoring weight
          const getWeightValue = (product) =>
            (product.classifications || []).find(
              ({ code }) => code === "scoringWeightAttributes"
            )?.features[0]?.featureValues[0]?.value || 0;

          const weightA = getWeightValue(a);
          const weightB = getWeightValue(b);

          // If product scoringWeight is equal, compare names
          if (weightB === weightA) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
          }

          return weightB - weightA;
        })
        .reduce<ReadonlyArray<{ _product: Product } & VariantOption>>(
          (variants, product) => [
            ...variants,
            ...(product.variantOptions || []).map((variantOption) => ({
              _product: product,
              ...variantOption
            }))
          ],
          []
        ),
    [products]
  );

  if (!allVariants.length) {
    return null;
  }

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <>
      <Grid container spacing={3}>
        {allVariants.slice(0, numberShown).map((variant) => {
          const { _product: product } = variant;
          const brandLogoCode = findProductBrandLogoCode(product);
          const brandLogo = iconMap[brandLogoCode];
          const productUrl = getProductUrl(countryCode, variant.path);

          const mainImage = findMasterImageUrl([
            ...(variant.images || []),
            ...(product.images || [])
          ]);

          // Find variant classifications that don't exist in the base product
          // TODO: May not be performant
          const uniqueClassifications = mapClassificationValues(
            findUniqueVariantClassifications(variant, classificationNamespace)
          );

          return (
            <Grid
              item
              key={`${product.code}-${variant.code}`}
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
                imageSource={mainImage}
                brandImageSource={brandLogo}
                action={{
                  model: "routerLink",
                  linkComponent: Link,
                  to: productUrl
                }}
                gtm={{
                  id: "cta-click1",
                  label: getMicroCopy("pdp.relatedProducts.viewDetails"),
                  action: productUrl
                }}
                footer={
                  <AnchorLink component="span" iconEnd>
                    {getMicroCopy("pdp.relatedProducts.viewDetails")}
                  </AnchorLink>
                }
              >
                {variant.externalProductCode !== null &&
                variant.externalProductCode !== "" ? (
                  <>
                    {getMicroCopy("pdp.nobb.label")}:{" "}
                    <b>{variant.externalProductCode}</b>
                  </>
                ) : (
                  ""
                )}
              </GTMOverviewCard>
            </Grid>
          );
        })}
      </Grid>
      {numberShown < allVariants.length ? (
        <div className={styles["load-more-wrapper"]}>
          <Button onClick={onLoadMore} variant="outlined" endIcon={<AddIcon />}>
            {getMicroCopy("pdp.relatedProducts.showMore")}
          </Button>
        </div>
      ) : null}
    </>
  );
};

type Props = {
  countryCode: string;
  classificationNamespace: string;
  products: ReadonlyArray<Product>;
};

// TODO: Do a context for countryCode and classificationNamespace
const RelatedProducts = ({
  countryCode,
  classificationNamespace,
  products
}: Props) => {
  const { getMicroCopy } = useSiteContext();

  if (Object.entries(products).length === 0) {
    return null;
  }

  const productGroups = groupProductsByCategory(products);

  if (!Object.keys(productGroups).length) {
    return null;
  }

  const GTMTab = withGTM<TabProps>(Tab, {
    label: "label"
  });

  return (
    <Section backgroundColor="alabaster">
      <Section.Title>{getMicroCopy("pdp.relatedProducts.title")}</Section.Title>
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
          {Object.entries(productGroups)
            .filter(([_, products]) =>
              products.some((product) => product.variantOptions)
            )
            .map(([category, products]) => {
              return (
                <Tabs.TabPanel
                  heading={category}
                  index={category}
                  key={category}
                >
                  <ProductListing
                    classificationNamespace={classificationNamespace}
                    countryCode={countryCode}
                    products={products}
                  />
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
  fragment RelatedProductsFragment on Products {
    code
    externalProductCode
    name
    images {
      allowedToDownload
      assetType
      fileSize
      name
      url
      containerId
      mime
      realFileName
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
    categories {
      categoryType
      code
      name
      parentCategoryCode
    }
    variantOptions {
      path
      code
      externalProductCode
      shortDescription
      images {
        allowedToDownload
        assetType
        fileSize
        name
        url
        containerId
        mime
        realFileName
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
`;
