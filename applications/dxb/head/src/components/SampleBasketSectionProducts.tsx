import Button from "@bmi-digital/components/button";
import Icon from "@bmi-digital/components/icon";
import Remove from "@bmi-digital/components/icon/Remove";
import OverviewCard from "@bmi-digital/components/overview-card";
import Typography from "@bmi-digital/components/typography";
import { microCopy } from "@bmi/microcopies";
import { isDefined } from "@bmi/utils";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { navigate } from "gatsby";
import React from "react";
import {
  ACTION_TYPES,
  Sample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { getPathWithCountryCode } from "../utils/path";
import GoodBetterBestIndicator from "./GoodBetterBestIndicator";
import Image from "./Image";
import { useSiteContext } from "./Site";
import {
  StyledSampleBasketSection,
  classes
} from "./styles/SampleBasketSectionProducts.styles";

const SampleBasketSectionProducts = () => {
  const { basketState, basketDispatch } = useBasketContext();
  const { getMicroCopy, countryCode } = useSiteContext();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));

  const sampleCards = basketState.products.map((sample) => {
    const media = (
      <Image
        type="Descriptive"
        altText={sample.name}
        image={{
          file: {
            fileName: sample.name,
            url: sample.image
          }
        }}
        focalPoint={{ x: 0, y: 0 }}
        className={classes["product-image"]}
      />
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
        className={classes["product-wrapper"]}
        key={sample.path}
        media={media}
        hasChildrenWithoutMargin
        onClick={() =>
          navigate(getPathWithCountryCode(countryCode, sample.path))
        }
        tag={<GoodBetterBestIndicator indicatorType={sample.goodBetterBest} />}
        footer={
          !isMobile && (
            <Button
              className={classes["product-button"]}
              endIcon={<Remove />}
              onClick={handleRemove}
              variant="outlined"
            >
              {getMicroCopy(microCopy.PDP_OVERVIEW_REMOVE_SAMPLE)}
            </Button>
          )
        }
        data-testid={"shopping-cart-product"}
      >
        <div className={classes["product"]}>
          <div className={classes["product-description"]}>
            <Typography className={classes["product-title"]}>
              {sample.name}
            </Typography>
            <Typography className={classes["product-color"]}>
              {[sample.colour, sample.textureFamily]
                .filter(isDefined)
                .join(" | ")}
            </Typography>
            <Typography className={classes["product-size"]}>
              {sample.measurements}
            </Typography>
          </div>
          {isMobile && (
            <Button
              className={classes["product-button"]}
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

  return <StyledSampleBasketSection>{sampleCards}</StyledSampleBasketSection>;
};

export default SampleBasketSectionProducts;
