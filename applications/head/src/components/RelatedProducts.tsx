import React, { useMemo, useState } from "react";
import Tabs from "@bmi/tabs";
import _ from "lodash";
import { Link, graphql } from "gatsby";
import { Product, VariantOption } from "../templates/product-details-page"; // Hmmmmmm
import {
  getProductUrl,
  findMasterImageUrl,
  findProductBrandLogoCode,
  mapProductClassifications,
  findUniqueClassificationsOnVariant,
  mapClassificationValues,
  groupProductsByCategory
} from "../utils/product-details-transforms";
import { Add as AddIcon } from "@material-ui/icons";
import { iconMap } from "../components/Icon";
import Grid from "@bmi/grid";
import OverviewCard from "@bmi/overview-card";
import AnchorLink from "@bmi/anchor-link/src";
import Typography from "@bmi/typography";
import Button from "@bmi/button/src";
import styles from "./styles/RelatedProducts.module.scss";

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

  return (
    <div>
      <Grid container spacing={3}>
        {allVariants
          .slice(0, numberShown)
          .map(({ _product: product, ...variant }) => {
            const brandLogoCode = findProductBrandLogoCode(product);
            const brandLogo = iconMap[brandLogoCode];

            const mainImage = findMasterImageUrl([
              ...(variant.images || []),
              ...(product.images || [])
            ]);

            // Find variant classifications that don't exist in the base product.
            const classifications = mapProductClassifications(
              product,
              classificationNamespace
            );

            // Base product may not have any classifications
            // Variant may not have classifications therefore it will not appear here
            // In which case, we can either check against an empty base resulting in all variant classifications
            // or with an empty variant, resulting in no classifications
            const uniqueClassifications = findUniqueClassificationsOnVariant(
              classifications[product.code] || {},
              classifications[variant.code] || {}
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
                  subtitle={mapClassificationValues(uniqueClassifications)}
                  subtitleVariant="h6"
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
            Show more
          </Button>
        </div>
      ) : null}
    </div>
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
  if (Object.entries(products).length === 0) {
    return null;
  }

  const productGroups = groupProductsByCategory(products);

  return (
    <div className={styles["RelatedProducts"]}>
      <Typography hasUnderline variant="h2" className={styles["title"]}>
        You might also need...
      </Typography>
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
