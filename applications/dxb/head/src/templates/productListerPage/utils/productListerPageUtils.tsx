import {
  Filter,
  Grid,
  OverviewCard,
  OverviewCardProps
} from "@bmi-digital/components";
import { Link as GatsbyLink } from "gatsby";
import React from "react";
import type { Product as EsProduct } from "@bmi/elasticsearch-types";
import BrandLogo from "../../../components/BrandLogo";
import DefaultImage from "../../../images/DefaultImage.svg";
import { getSearchParams } from "../../../utils/filters";
import { enhanceColourFilterWithSwatches } from "../../../utils/filtersUI";
import withGTM from "../../../utils/google-tag-manager";
import { getPathWithCountryCode } from "../../../utils/path";
import { FooterAnchorLink } from "../styles";
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

const GTMOverviewCard = withGTM<OverviewCardProps>(OverviewCard);
export const createSizeLabel = (product: EsProduct): string => {
  if (!product["MEASUREMENTS$LENGTH"]) return;
  const l = product["MEASUREMENTS$LENGTH"];
  const w = product["MEASUREMENTS$WIDTH"];
  let res: string[] = [];
  l.forEach((el, i) => {
    const isSameUnit = el.name.split(" ")[1] === w[`${i}`].name.split(" ")[1];
    if (isSameUnit) {
      res = [...res, `${el.value}x${w[`${i}`].code}`];
    } else {
      res = [...res, `${el.code} x ${w[`${i}`].code}`];
    }
  });
  return res.join(" | ");
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
    const subTitle = variant.subTitle || "";
    const moreOptionsAvailable =
      variant.all_variants?.length > 1 &&
      getMicroCopy("plp.product.moreOptionsAvailable");
    const surface = variant.classifications.find(
      (cl) => cl.code === "appearanceAttributes"
    );
    const textureFamily =
      surface &&
      surface.features.find((el) => el.code.includes("textureFamily"));
    const surfaceValue =
      (textureFamily &&
        textureFamily.featureValues.map((feat) => feat.value).join(" | ")) ||
      "";
    const sizeLabel = createSizeLabel(variant);

    return (
      <Grid
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
          media={
            mainImage ? (
              <img src={mainImage} alt={`${subTitle} ${product.name}`} />
            ) : (
              <DefaultImage />
            )
          }
          imageSize="contain"
          brandImageSource={<BrandLogo brandName={variant.brandCode} />}
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
            <FooterAnchorLink
              action={{
                model: "routerLink",
                linkComponent: GatsbyLink,
                to: productUrl
              }}
              iconEnd
            >
              {getMicroCopy("plp.product.viewDetails")}
            </FooterAnchorLink>
          }
          moreOptionsAvailable={moreOptionsAvailable}
          size={{
            microCopy: !!sizeLabel && getMicroCopy("pdp.overview.size"),
            value: sizeLabel
          }}
          surface={{
            microCopy: (surfaceValue && surface.name) || "",
            value: surfaceValue
          }}
        >
          {variant.shortDescription}
        </GTMOverviewCard>
      </Grid>
    );
  });
