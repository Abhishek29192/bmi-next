import React, { useContext } from "react";
import { Link } from "gatsby";
import AnchorLink from "@bmi/anchor-link";
import Grid from "@bmi/grid";
import OverviewCard from "@bmi/overview-card";
import Typography from "@bmi/typography";
import {
  findMasterImageUrl,
  findUniqueVariantClassifications,
  getProductUrl,
  mapClassificationValues
} from "../utils/product-details-transforms";
import { iconMap } from "../components/Icon";
import { SiteContext } from "./Site";

// TODO: This is the transformed indexed data
type ESProductResult = any;

type Props = {
  products: ReadonlyArray<ESProductResult>;
  pageContext: any; // TODO:
};

const ProductsGridView = ({ products, pageContext }: Props) => {
  const { getMicroCopy } = useContext(SiteContext);
  const { variantCodeToPathMap } = pageContext;

  if (products.length === 0) {
    // TODO: Microcopy?
    return <Typography>No results found</Typography>;
  }

  return (
    <>
      {products.map((variant) => {
        const brandLogoCode = variant.brandCode;
        const brandLogo = iconMap[brandLogoCode];
        const mainImage = findMasterImageUrl(variant.images);
        const product = variant.baseProduct;

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
                    to: getProductUrl(
                      pageContext.countryCode,
                      variantCodeToPathMap[variant.code]
                    )
                  }}
                >
                  {getMicroCopy("plp.product.viewDetails")}
                </AnchorLink>
              }
            >
              {variant.shortDescription}
            </OverviewCard>
          </Grid>
        );
      })}
    </>
  );
};

export default ProductsGridView;
