import AnchorLink from "@bmi/anchor-link";
import Grid from "@bmi/grid";
import OverviewCard, { OverviewCardProps } from "@bmi/overview-card";
import Typography from "@bmi/typography";
import { Link } from "gatsby";
import React from "react";
import { iconMap } from "../components/Icon";
import withGTM from "../utils/google-tag-manager";
import {
  findMasterImageUrl,
  findUniqueVariantClassifications,
  getProductUrl,
  mapClassificationValues
} from "../utils/product-details-transforms";
import { useSiteContext } from "./Site";

// TODO: This is the transformed indexed data
type ESProductResult = any;

type Props = {
  products: ReadonlyArray<ESProductResult>;
  pageContext: any; // TODO:
};

const ProductsGridView = ({ products, pageContext }: Props) => {
  const { getMicroCopy } = useSiteContext();
  const { variantCodeToPathMap } = pageContext;

  if (products.length === 0) {
    return (
      <Typography>{getMicroCopy("plp.product.noResultsFound")}</Typography>
    );
  }

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <>
      {products.map((variant) => {
        const brandLogoCode = variant.brandCode;
        // eslint-disable-next-line security/detect-object-injection
        const brandLogo = iconMap[brandLogoCode];
        const mainImage = findMasterImageUrl(variant.images);
        const product = variant.baseProduct;
        const productUrl = getProductUrl(
          pageContext.countryCode,
          variantCodeToPathMap[variant.code]
        );

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
            <GTMOverviewCard
              title={product.name}
              titleVariant="h5"
              subtitle={uniqueClassifications}
              subtitleVariant="h6"
              media={
                <img
                  src={mainImage}
                  alt={`${uniqueClassifications} ${product.name}`}
                />
              }
              imageSize="contain"
              brandImageSource={brandLogo}
              action={{
                model: "routerLink",
                linkComponent: Link,
                to: productUrl
              }}
              gtm={{
                id: "cta-click1",
                label: getMicroCopy("plp.product.viewDetails"),
                action: productUrl
              }}
              footer={
                <AnchorLink component="span" iconEnd>
                  {getMicroCopy("plp.product.viewDetails")}
                </AnchorLink>
              }
            >
              {variant.shortDescription}
            </GTMOverviewCard>
          </Grid>
        );
      })}
    </>
  );
};

export default ProductsGridView;
