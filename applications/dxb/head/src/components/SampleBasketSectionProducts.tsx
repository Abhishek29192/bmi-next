import React from "react";
import { Button, Icon, OverviewCard, Typography } from "@bmi/components";
import { Remove } from "@material-ui/icons";
import { navigate } from "gatsby";
import { useMediaQuery, useTheme } from "@material-ui/core";
import { isDefined } from "@bmi/utils";
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
              {[sample.colour, sample.textureFamily]
                .filter(isDefined)
                .join(" | ")}
            </Typography>
            <Typography className={styles["product-size"]}>
              {sample.measurements}
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
