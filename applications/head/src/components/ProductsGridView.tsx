import AnchorLink, { Props as AnchorLinkProps } from "@bmi/anchor-link";
import Grid from "@bmi/grid";
import OverviewCard from "@bmi/overview-card";
import Typography from "@bmi/typography";
import { Link } from "gatsby";
import React, { useContext } from "react";
import { iconMap } from "../components/Icon";
import withGTM from "../utils/google-tag-manager";
import {
  findMasterImageUrl,
  findUniqueVariantClassifications,
  getProductUrl,
  mapClassificationValues
} from "../utils/product-details-transforms";
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
    return (
      <Typography>{getMicroCopy("plp.product.noResultsFound")}</Typography>
    );
  }

  const GTMAnchorLink = withGTM<AnchorLinkProps>(AnchorLink);

  return (
    <>
      {products.map((variant) => {
        const brandLogoCode = variant.brandCode;
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
            <OverviewCard
              title={product.name}
              titleVariant="h5"
              subtitle={uniqueClassifications}
              subtitleVariant="h6"
              imageSource={mainImage}
              imageSize="contain"
              brandImageSource={brandLogo}
              footer={
                <GTMAnchorLink
                  iconEnd
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
                >
                  {getMicroCopy("plp.product.viewDetails")}
                </GTMAnchorLink>
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
