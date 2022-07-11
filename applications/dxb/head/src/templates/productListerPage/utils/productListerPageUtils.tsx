import {
  AnchorLink,
  Filter,
  Grid,
  OverviewCard,
  OverviewCardProps
} from "@bmi/components";
import type { Product as EsProduct } from "@bmi/elasticsearch-types";
import { Link as GatsbyLink } from "gatsby";
import React from "react";
import { iconMap } from "../../../components/Icon";
import type { Context as SiteContext } from "../../../components/Site";
import { getSearchParams } from "../../../utils/filters";
import { enhanceColourFilterWithSwatches } from "../../../utils/filtersUI";
import withGTM from "../../../utils/google-tag-manager";
import { getPathWithCountryCode } from "../../../utils/path";
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
) => {
  const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);
  return products.flatMap((variant) => {
    const brandLogoCode = variant.brandCode;
    // eslint-disable-next-line security/detect-object-injection
    const brandLogo = iconMap[brandLogoCode];
    const mainImage = variant.mainImage;
    const product = variant.baseProduct;
    const productUrl = `${getPathWithCountryCode(
      countryCode,
      pageContext.variantCodeToPathMap?.[variant.code] || variant.path
    )}${getSearchParams()}`;
    const subTitle = variant.subTitle || "";
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
          subtitle={subTitle}
          subtitleVariant="h6"
          media={<img src={mainImage} alt={`${subTitle} ${product.name}`} />}
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
