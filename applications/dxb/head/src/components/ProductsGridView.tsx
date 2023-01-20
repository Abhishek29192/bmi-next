import {
  AnchorLink,
  Grid,
  OverviewCard,
  OverviewCardProps,
  Typography
} from "@bmi-digital/components";
import { Product as ESProduct } from "@bmi/elasticsearch-types";
import { Link } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import DefaultImage from "../images/DefaultImage.svg";
import { useSearchParams } from "../utils/filters";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { iconMap } from "./Icon";
import { useSiteContext } from "./Site";

export type Props = {
  products: ReadonlyArray<ESProduct>;
  pageContext: {
    countryCode: string;
    variantCodeToPathMap?: Record<string, string>;
  }; // TODO: properly type
  isLoading?: boolean;
};

const ProductsGridView = ({
  products,
  pageContext,
  isLoading = false
}: Props) => {
  const { getMicroCopy } = useSiteContext();
  const { variantCodeToPathMap } = pageContext;
  const searchParams = useSearchParams();

  if (isLoading) {
    return null;
  }

  if (products.length === 0) {
    return (
      <Typography>
        {getMicroCopy(microCopy.PLP_PRODUCT_NO_RESULTS_FOUND)}
      </Typography>
    );
  }

  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);

  return (
    <>
      {products.flatMap((variant) => {
        const brandLogoCode = variant.brandCode;
        // eslint-disable-next-line security/detect-object-injection
        const brandLogo = iconMap[brandLogoCode];
        const mainImage = variant.mainImage;
        const product = variant.baseProduct;
        const productUrl = `${getPathWithCountryCode(
          pageContext.countryCode,
          variantCodeToPathMap?.[variant.code] || variant.path
        )}${searchParams}`;

        const uniqueClassifications = variant.subTitle || "";
        const moreOptionsAvailable =
          variant.all_variants?.length > 1 &&
          getMicroCopy("plp.product.moreOptionsAvailable");
        return (
          <Grid key={`${product.code}-${variant.code}`} xs={12} md={6} lg={4}>
            <GTMOverviewCard
              title={product.name}
              titleVariant="h5"
              subtitle={uniqueClassifications}
              subtitleVariant="h6"
              media={
                mainImage ? (
                  <img
                    src={mainImage}
                    alt={`${uniqueClassifications} ${product.name}`}
                  />
                ) : (
                  <DefaultImage />
                )
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
                label: getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS),
                action: productUrl
              }}
              footer={
                <AnchorLink component="span" iconEnd>
                  {getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS)}
                </AnchorLink>
              }
              moreOptionsAvailable={moreOptionsAvailable}
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
