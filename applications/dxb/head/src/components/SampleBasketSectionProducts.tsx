import React, { useContext } from "react";
import OverviewCard from "@bmi/overview-card";
import Typography from "@bmi/typography";
import { Remove } from "@material-ui/icons";
import Icon from "@bmi/icon";
import Button from "@bmi/button";
import { navigate } from "gatsby";
import { useMediaQuery, useTheme } from "@material-ui/core";
import BasketContext, {
  ACTION_TYPES,
  ISample
} from "../contexts/SampleBasketContext";
import styles from "./styles/SampleBasketSectionProducts.module.scss";
import { renderImage } from "./Image";
import { useSiteContext } from "./Site";

interface IOptions {
  code: string;
  separator?: string;
  featureUnitRequired?: boolean;
}

const getFeatures = (product: ISample, options: IOptions) => {
  const classification = product.classifications?.filter(
    (classification) => classification.code === options.code
  )[0];

  const features = [
    ...new Set(
      classification?.features
        .map((feature) => feature.featureValues.map(({ value }) => value))
        .flat()
    )
  ];

  const units = options.featureUnitRequired
    ? classification?.features[0]?.featureUnit?.symbol
    : "";

  return `${features.join(options.separator || " | ")} ${units ?? ""}`;
};

const SampleBasketSectionProducts = () => {
  const { basketState, basketDispatch } = useContext(BasketContext);
  const { getMicroCopy, countryCode } = useSiteContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const list = basketState.products.map((product) => {
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

    const removeFromBasket = (payload: ISample) => {
      basketDispatch({
        type: ACTION_TYPES.BASKET_REMOVE,
        payload
      });
    };

    const handleRemove = (e: Event) => {
      e.stopPropagation();
      removeFromBasket(product);
    };

    return (
      <OverviewCard
        className={styles["product-wrapper"]}
        key={product.path}
        media={media}
        hasChildrenWithoutMargin
        onClick={() => navigate(`/${countryCode}/${product.path}`)}
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

  return <div className={styles["SampleBasketSectionProducts"]}>{list}</div>;
};

export default SampleBasketSectionProducts;
