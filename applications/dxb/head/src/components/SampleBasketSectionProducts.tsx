import React from "react";
import OverviewCard from "@bmi/overview-card";
import Typography from "@bmi/typography";
import { Remove } from "@material-ui/icons";
import Icon from "@bmi/icon";
import Button from "@bmi/button";
import { navigate } from "gatsby";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { getPathWithCountryCode } from "../utils/path";
import {
  ACTION_TYPES,
  Sample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import styles from "./styles/SampleBasketSectionProducts.module.scss";
import { renderImage } from "./Image";
import { useSiteContext } from "./Site";

interface Options {
  code: string;
  separator?: string;
  featureUnitRequired?: boolean;
}

const getFeatures = (sample: Sample, options: Options) => {
  const classification = sample.classifications?.filter(
    (classification) => classification.code === options.code
  )[0];

  const features = [
    ...new Set(
      classification?.features.flatMap((feature) =>
        feature.featureValues.map(({ value }) => value)
      )
    )
  ].filter((value) => value);

  const units =
    options.featureUnitRequired &&
    classification?.features[0]?.featureUnit?.symbol;

  return `${features.join(options.separator || " | ")} ${units ?? ""}`;
};

const SampleBasketSectionProducts = () => {
  const { basketState, basketDispatch } = useBasketContext();
  const { getMicroCopy, countryCode } = useSiteContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sampleCards = basketState.products.map((product) => {
    const image = product.images[0];

    const media = renderImage(
      {
        type: "Descriptive",
        altText: image.name,
        caption: { caption: image.name },
        image: {
          file: {
            fileName: image.realFileName,
            url: image.url
          }
        },
        focalPoint: { x: 0, y: 0 }
      },
      {
        className: styles["product-image"]
      }
    );

    const removeFromBasket = (payload: Sample) => {
      basketDispatch({
        type: ACTION_TYPES.BASKET_REMOVE,
        payload
      });
    };

    const handleRemove = (event: Event) => {
      event.stopPropagation();
      removeFromBasket(product);
    };

    return (
      <OverviewCard
        className={styles["product-wrapper"]}
        key={product.path}
        media={media}
        hasChildrenWithoutMargin
        onClick={() =>
          navigate(getPathWithCountryCode(countryCode, product.path))
        }
        footer={
          !isMobile && (
            <Button
              className={styles["product-button"]}
              endIcon={<Remove />}
              onClick={handleRemove}
              variant="outlined"
            >
              {getMicroCopy("pdp.overview.removeSample")}
            </Button>
          )
        }
      >
        <div className={styles["product"]}>
          <div className={styles["product-description"]}>
            <Typography className={styles["product-title"]}>
              {product.name}
            </Typography>
            <Typography className={styles["product-color"]}>
              {getFeatures(product, { code: "appearanceAttributes" })}
            </Typography>
            <Typography className={styles["product-size"]}>
              {getFeatures(product, {
                code: "measurements",
                separator: "x",
                featureUnitRequired: true
              })}
            </Typography>
          </div>
          {isMobile && (
            <Button
              className={styles["product-button"]}
              onClick={handleRemove}
              variant="outlined"
              isIconButton
            >
              <Icon source={Remove} />
            </Button>
          )}
        </div>
      </OverviewCard>
    );
  });

  return (
    <div className={styles["SampleBasketSectionProducts"]}>{sampleCards}</div>
  );
};

export default SampleBasketSectionProducts;
