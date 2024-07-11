import React from "react";
import Grid from "@bmi-digital/components/grid";
import ProductOverviewCard from "@bmi-digital/components/product-overview-card";
import Typography from "@bmi-digital/components/typography";
import { Product as ESProduct } from "@bmi/elasticsearch-types";
import { microCopy } from "@bmi/microcopies";
import NextLink from "next/link";
import { useSearchParams } from "../utils/filters";
import {
  getLevel,
  goodBetterBestLabels
} from "../utils/getGoodBetterBestLabel";
import { getPathWithCountryCode } from "../utils/path";
import BrandLogo from "./BrandLogo";
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

  return (
    <>
      {products.flatMap((variant) => {
        const brandLogo = variant.brandCode ? (
          <BrandLogo brandName={variant.brandCode} />
        ) : undefined;
        const mainImage = variant.mainImage;
        const product = variant.baseProduct;
        const productUrl = `${getPathWithCountryCode(
          pageContext.countryCode,
          variantCodeToPathMap?.[variant.code] || variant.path
        )}${searchParams}`;

        const uniqueClassifications = variant.subTitle;
        const moreOptionsAvailable =
          variant.all_variants?.length > 1 &&
          getMicroCopy(microCopy.PLP_PRODUCT_MORE_OPTIONS_AVAILABLE);
        return (
          <Grid key={`${product.code}-${variant.code}`} xs={12} md={6} lg={4}>
            <ProductOverviewCard
              title={product.name || variant.name}
              subtitle={moreOptionsAvailable || uniqueClassifications}
              description={variant.shortDescription}
              tag={
                variant.goodBetterBest && {
                  level: getLevel(variant.goodBetterBest),
                  label: getMicroCopy(
                    goodBetterBestLabels[variant.goodBetterBest]
                  )
                }
              }
              media={
                mainImage
                  ? {
                      src: mainImage,
                      alt: `${uniqueClassifications} ${
                        product.name || variant.name
                      }`
                    }
                  : undefined
              }
              brandLogo={brandLogo}
              component={NextLink}
              href={productUrl}
              gtm={{
                id: "cta-click1",
                label: getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS),
                action: productUrl
              }}
              ctaLabel={getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS)}
            />
          </Grid>
        );
      })}
    </>
  );
};

export default ProductsGridView;
