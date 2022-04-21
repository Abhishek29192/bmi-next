import {
  AnchorLink,
  Grid,
  OverviewCard,
  OverviewCardProps,
  Typography
} from "@bmi/components";
import { Link } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import { useSearchParams } from "../utils/filters";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { iconMap } from "./Icon";
import { useSiteContext } from "./Site";

// TODO: This is the transformed indexed data
type ESProductResult = any;

type Props = {
  products: ReadonlyArray<ESProductResult>;
  pageContext: any; // TODO:
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
      {products.map((variant) => {
        const brandLogoCode = variant.brandCode;
        // eslint-disable-next-line security/detect-object-injection
        const brandLogo = iconMap[brandLogoCode];
        const mainImage = variant.images;
        const product = variant.baseProduct;
        const productUrl = `${getPathWithCountryCode(
          pageContext.countryCode,
          variantCodeToPathMap[variant.code]
        )}${searchParams}`;

        const uniqueClassifications = product.subTitle || "";

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
                label: getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS),
                action: productUrl
              }}
              footer={
                <AnchorLink component="span" iconEnd>
                  {getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS)}
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
