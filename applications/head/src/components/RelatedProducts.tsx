import React, { useContext, useMemo, useState } from "react";
import Tabs from "@bmi/tabs";
import _ from "lodash";
import { Link, graphql } from "gatsby";
import { Product, VariantOption } from "../templates/product-details-page"; // Hmmmmmm
import {
  getProductUrl,
  findMasterImageUrl,
  findProductBrandLogoCode,
  mapClassificationValues,
  groupProductsByCategory,
  findUniqueVariantClassifications
} from "../utils/product-details-transforms";
import { Add as AddIcon } from "@material-ui/icons";
import { iconMap } from "../components/Icon";
import Grid from "@bmi/grid";
import OverviewCard from "@bmi/overview-card";
import AnchorLink from "@bmi/anchor-link";
import Typography from "@bmi/typography";
import Button from "@bmi/button";
import Section from "@bmi/section";
import styles from "./styles/RelatedProducts.module.scss";
import { SiteContext } from "./Site";

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
  const { getMicroCopy } = useContext(SiteContext);

  const onLoadMore = () => {
    setNumberShown((numberShown) => numberShown + pageSize);
  };

  const allVariants = useMemo(
    () =>
      products.reduce<ReadonlyArray<{ _product: Product } & VariantOption>>(
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

  return (
    <Section backgroundColor="alabaster">
      <Grid container spacing={3}>
        {allVariants.slice(0, numberShown).map((variant) => {
          const { _product: product } = variant;
          const brandLogoCode = findProductBrandLogoCode(product);
          const brandLogo = iconMap[brandLogoCode];

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
              <OverviewCard
                title={product.name}
                titleVariant="h5"
                subtitle={uniqueClassifications}
                subtitleVariant="h6"
                imageSize="contain"
                imageSource={mainImage}
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
                NOBB number: <b>{variant.code}</b>
              </OverviewCard>
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
    </Section>
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
  const { getMicroCopy } = useContext(SiteContext);

  if (Object.entries(products).length === 0) {
    return null;
  }

  const productGroups = groupProductsByCategory(products);

  if (!Object.keys(productGroups).length) {
    return null;
  }

  return (
    <Section backgroundColor="alabaster">
      <Section.Title>{getMicroCopy("pdp.relatedProducts.title")}</Section.Title>
      <div className={styles["RelatedProducts"]}>
        <Tabs theme="secondary" initialValue={Object.keys(productGroups)[0]}>
          {Object.entries(productGroups).map(([category, products]) => {
            return (
              <Tabs.TabPanel heading={category} index={category} key={category}>
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
      code
      shortDescription
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
