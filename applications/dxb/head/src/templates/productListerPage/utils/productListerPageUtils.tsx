import { Link as GatsbyLink } from "gatsby";
import { Filter } from "@bmi/components";
import { Grid } from "@bmi/components";
import { AnchorLink } from "@bmi/components";
import React from "react";
import { OverviewCard, OverviewCardProps } from "@bmi/components";
import { enhanceColourFilterWithSwatches } from "../../../utils/filtersUI";
import { iconMap } from "../../../components/Icon";
import {
  findMasterImageUrl,
  findUniqueVariantClassifications,
  getProductUrl,
  mapClassificationValues
} from "../../../utils/product-details-transforms";
import { Product } from "../../../components/types/pim";
import withGTM from "../../../utils/google-tag-manager";

//TODO: remove filter.name === "colour" condition when feature flag 'GATSBY_USE_LEGACY_FILTERS' is removed
// JIRA : https://bmigroup.atlassian.net/browse/DXB-2789
export const resolveFilters = (filters: readonly Filter[]) => {
  return (filters || [])
    .filter((filter) => filter.options.length > 0)
    .map((filter) => {
      const filterName = filter.name.trim().toLowerCase();
      if (filterName === "colour" || filterName.endsWith("colourfamily")) {
        return enhanceColourFilterWithSwatches(filter);
      }

      return filter;
    });
};

export const renderProducts = (
  products,
  pageContext,
  countryCode,
  getMicroCopy,
  filters
) => {
  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);
  return products.flatMap((variant) => {
    const brandLogoCode = variant.brandCode;
    // eslint-disable-next-line security/detect-object-injection
    const brandLogo = iconMap[brandLogoCode];
    const mainImage = findMasterImageUrl(variant.images);
    const product: Product = variant.baseProduct;
    const productUrl = getProductUrl(
      countryCode,
      pageContext.variantCodeToPathMap[variant.code]
    );
    const uniqueClassifications = mapClassificationValues(
      findUniqueVariantClassifications(
        { ...variant, _product: product },
        pageContext.pimClassificationCatalogueNamespace
      )
    );
    const moreOptionsAvailable =
      variant.all_variants?.length > 1 &&
      getMicroCopy("plp.product.moreOptionsAvailable");
    return (
      <Grid
        item
        key={`${product.code}-${variant.code}`}
        xs={12}
        md={6}
        lg={4}
        xl={filters.length ? 4 : 3}
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
            linkComponent: GatsbyLink,
            to: productUrl
          }}
          gtm={{
            id: "cta-click1",
            action: productUrl,
            label: getMicroCopy("plp.product.viewDetails")
          }}
          footer={
            <AnchorLink iconEnd>
              {getMicroCopy("plp.product.viewDetails")}
            </AnchorLink>
          }
          moreOptionsAvailable={moreOptionsAvailable}
        >
          {variant.shortDescription}
        </GTMOverviewCard>
      </Grid>
    );
  });
};
