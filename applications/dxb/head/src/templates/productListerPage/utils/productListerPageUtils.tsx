import { Filter } from "@bmi-digital/components/filters";
import Grid from "@bmi-digital/components/grid";
import ProductOverviewCard from "@bmi-digital/components/product-overview-card";
import { microCopy } from "@bmi/microcopies";
import { Link as GatsbyLink } from "gatsby";
import React from "react";
import type { Product as EsProduct } from "@bmi/elasticsearch-types";
import BrandLogo from "../../../components/BrandLogo";
import { getSearchParams } from "../../../utils/filters";
import { enhanceColourFilterWithSwatches } from "../../../utils/filtersUI";
import {
  getLevel,
  goodBetterBestLabels
} from "../../../utils/getGoodBetterBestLabel";
import { getPathWithCountryCode } from "../../../utils/path";
import type { Context as SiteContext } from "../../../components/Site";
import type { PageContextType } from "../components/product-lister-page";

//TODO: remove filter.name === "colour" condition when feature flag 'GATSBY_USE_LEGACY_FILTERS' is removed
// JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
export const resolveFilters = (filters: readonly Filter[]) => {
  return (filters || [])
    .filter((filter) => filter?.options.length > 0)
    .map((filter) => {
      const filterName = filter.name.trim().toLowerCase();
      if (filterName === "colour" || filterName.endsWith("colourfamily")) {
        return enhanceColourFilterWithSwatches(filter);
      }

      return filter;
    });
};

export const renderProducts = (
  products: EsProduct[],
  pageContext: PageContextType,
  countryCode: string,
  getMicroCopy: SiteContext["getMicroCopy"],
  filters: Filter[]
) =>
  products.flatMap((variant) => {
    const mainImage = variant.mainImage;
    const product = variant.baseProduct;
    const productUrl = `${getPathWithCountryCode(
      countryCode,
      pageContext.variantCodeToPathMap?.[variant.code] || variant.path
    )}${getSearchParams()}`;
    const moreOptionsAvailable =
      variant.all_variants?.length > 1 &&
      getMicroCopy(microCopy.PLP_PRODUCT_MORE_OPTIONS_AVAILABLE);

    return (
      <Grid
        key={`${product.code}-${variant.code}`}
        xs={12}
        md={6}
        lg={4}
        xl={filters.length ? 4 : 3}
      >
        <ProductOverviewCard
          title={product.name || variant.name}
          subtitle={moreOptionsAvailable || variant.subTitle}
          description={variant.shortDescription}
          tag={
            variant.goodBetterBest && {
              level: getLevel(variant.goodBetterBest),
              label: getMicroCopy(goodBetterBestLabels[variant.goodBetterBest])
            }
          }
          media={<img src={mainImage} alt={product.name || variant.name} />}
          brandLogo={
            variant.brandCode ? (
              <BrandLogo brandName={variant.brandCode} />
            ) : undefined
          }
          gtm={{
            id: "cta-click1",
            action: productUrl,
            label: getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS)
          }}
          ctaLabel={getMicroCopy(microCopy.PLP_PRODUCT_VIEW_DETAILS)}
          component={GatsbyLink}
          to={productUrl}
        />
      </Grid>
    );
  });
