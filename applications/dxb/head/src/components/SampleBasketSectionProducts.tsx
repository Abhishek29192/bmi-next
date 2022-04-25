import React from "react";
import { OverviewCard } from "@bmi/components";
import { Typography } from "@bmi/components";
import { Icon } from "@bmi/components";
import { Button } from "@bmi/components";
import { Remove } from "@material-ui/icons";
import { navigate } from "gatsby";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { getPathWithCountryCode } from "../utils/path";
import { microCopy } from "../constants/microCopies";
import {
  ACTION_TYPES,
  Sample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import styles from "./styles/SampleBasketSectionProducts.module.scss";
import { renderImage } from "./Image";
import { useSiteContext } from "./Site";
import { Classification } from "./types/pim";

interface Options {
  code: string;
  separator?: string;
  featureUnitRequired?: boolean;
}

export const getFeatures = (
  classifications: Classification[],
  options: Options
) => {
  const classification = classifications.find(
    (classification) =>
      classification.code.toLowerCase() === options.code.toLowerCase()
  );

  if (!classification) {
    return null;
  }

  const features = [
    ...new Set(
      classification?.features.flatMap((feature) =>
        feature.featureValues.map(({ value }) => value)
      )
    )
  ].filter((value) => value);

  const units =
    (options.featureUnitRequired &&
      classification?.features[0]?.featureUnit?.symbol) ||
    "";

  return `${features.join(options.separator || " | ")} ${units}`.trim();
};

const SampleBasketSectionProducts = () => {
  const { basketState, basketDispatch } = useBasketContext();
  const { getMicroCopy, countryCode } = useSiteContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sampleCards = basketState.products.map((sample) => {
    const media = renderImage(
      {
        __typename: "ContentfulImage",
        type: "Descriptive",
        altText: sample.name,
        caption: { caption: sample.name },
        image: {
          file: {
            fileName: sample.name,
            url: sample.image
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
      removeFromBasket(sample);
    };

    return (
      <OverviewCard
        className={styles["product-wrapper"]}
        key={sample.path}
        media={media}
        hasChildrenWithoutMargin
        onClick={() =>
          navigate(getPathWithCountryCode(countryCode, sample.path))
        }
        footer={
          !isMobile && (
            <Button
              className={styles["product-button"]}
              endIcon={<Remove />}
              onClick={handleRemove}
              variant="outlined"
            >
              {getMicroCopy(microCopy.PDP_OVERVIEW_REMOVE_SAMPLE)}
            </Button>
          )
        }
      >
        <div className={styles["product"]}>
          <div className={styles["product-description"]}>
            <Typography className={styles["product-title"]}>
              {sample.name}
            </Typography>
            <Typography className={styles["product-color"]}>
              {getFeatures(sample.classifications, {
                code: "appearanceAttributes"
              })}
            </Typography>
            <Typography className={styles["product-size"]}>
              {getFeatures(sample.classifications, {
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
