/* eslint-disable security/detect-object-injection */
import {
  Filter,
  Grid,
  OverviewCard,
  OverviewCardProps
} from "@bmi-digital/components";
import { Link as GatsbyLink } from "gatsby";
import React from "react";
import type {
  ClassificationField,
  Product as EsProduct
} from "@bmi/elasticsearch-types";
import BrandLogo from "../../../components/BrandLogo";
import DefaultImage from "../../../images/DefaultImage.svg";
import { getSearchParams } from "../../../utils/filters";
import { enhanceColourFilterWithSwatches } from "../../../utils/filtersUI";
import withGTM from "../../../utils/google-tag-manager";
import { getPathWithCountryCode } from "../../../utils/path";
import { FooterAnchorLink } from "../styles";
import GoodBetterBestIndicator from "../../../components/GoodBetterBestIndicator";
import groupBy from "../../../utils/groupBy";
import type { PageContextType } from "../components/product-lister-page";
import type { Context as SiteContext } from "../../../components/Site";

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
  const width: ClassificationField = product["MEASUREMENTS$WIDTH"];
  const length: ClassificationField = product["MEASUREMENTS$LENGTH"];
  const height: ClassificationField = product["MEASUREMENTS$HEIGHT"];
  const thickness: ClassificationField = product["MEASUREMENTS$THICKNESS"];
  const measurementValues = [length, width, height, thickness].filter(Boolean);
  if (measurementValues.length === 0) {
    return "";
  }

  const splitValue = (str: string): string[] => str.split(" ");
  const sameUnit = measurementValues.every((value, i, arr) => {
    return splitValue(value[0].name)[1] === splitValue(arr[0][0].name)[1];
  });
  const unit = sameUnit ? splitValue(measurementValues[0][0].name)[1] : "";

  return (
    measurementValues
      .map(
        (unitValue) =>
          splitValue(unitValue[0].name)[0] +
          (!sameUnit ? splitValue(unitValue[0].name)[1] : "")
      )
      // Add extra space if units don't match
      .join(sameUnit ? "x" : " x ") + unit
  );
};
export const findSurface = (
  product: EsProduct
): { value: string; mc?: string } => {
  const surface = product.classifications.find(
    (cl) => cl.code === "appearanceAttributes"
  );
  const textureFamily =
    surface &&
    surface.features?.find((el) => el.code.includes("textureFamily"));
  const surfaceValue =
    (textureFamily &&
      textureFamily.featureValues.map((feat) => feat.value).join(" | ")) ||
    "";
  return { value: surfaceValue, mc: textureFamily && textureFamily.name };
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
      getMicroCopy("plp.product.moreOptionsAvailable");

    let sizeLabel: string[] = [];
    let surface: string[] = [];
    let surfaceMc: string | undefined = "";

    if (variant.all_variants) {
      const variantsGroupByColor: { [p: string]: EsProduct[] } = groupBy(
        variant.all_variants,
        (v: EsProduct) =>
          v._source &&
          v._source.APPEARANCEATTRIBUTES$COLOUR &&
          v._source.APPEARANCEATTRIBUTES$COLOUR[0].code
      );
      const filteredVariants = variant.APPEARANCEATTRIBUTES$COLOUR
        ? variantsGroupByColor[variant.APPEARANCEATTRIBUTES$COLOUR[0].code]
        : variant.all_variants;

      filteredVariants.forEach((v: EsProduct) => {
        if (v._source) {
          sizeLabel = [...sizeLabel, createSizeLabel(v._source)];
          surface = [...surface, findSurface(v._source).value];
          surfaceMc = findSurface(v._source).mc;
        }
      });
    }

    sizeLabel = sizeLabel.filter(Boolean);
    const uniqueSizeLabels = [...new Set(sizeLabel)].join(" | ");
    return (
      <Grid
        key={`${product?.code}-${variant.code}`}
        xs={12}
        md={6}
        lg={4}
        xl={filters.length ? 4 : 3}
      >
        <GTMOverviewCard
          title={product?.name}
          titleVariant="h5"
          tag={
            <GoodBetterBestIndicator indicatorType={variant.goodBetterBest} />
          }
          media={
            mainImage ? (
              <img src={mainImage} alt={product?.name} />
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
            microCopy: uniqueSizeLabels
              ? getMicroCopy("pdp.overview.size")
              : "",

            value: uniqueSizeLabels
          }}
          surface={{
            microCopy: surfaceMc,
            value: [...new Set(surface)].join(" | ")
          }}
        >
          {variant.shortDescription}
        </GTMOverviewCard>
      </Grid>
    );
  });
