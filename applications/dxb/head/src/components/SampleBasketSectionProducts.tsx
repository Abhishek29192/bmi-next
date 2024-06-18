import ProductSampleCard from "@bmi-digital/components/product-sample-card";
import { microCopy } from "@bmi/microcopies";
import { isDefined } from "@bmi/utils";
import { Link } from "gatsby";
import React from "react";
import { replaceSpaces } from "@bmi-digital/components/utils";
import {
  ACTION_TYPES,
  Sample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import {
  getLevel,
  goodBetterBestLabels
} from "../utils/getGoodBetterBestLabel";
import { getPathWithCountryCode } from "../utils/path";
import { useSiteContext } from "./Site";
import {
  StyledSampleBasketSection,
  classes
} from "./styles/SampleBasketSectionProducts.styles";
import createImageProps from "./image/createImageProps";

const SampleBasketSectionProducts = () => {
  const { basketState, basketDispatch } = useBasketContext();
  const { getMicroCopy, countryCode } = useSiteContext();

  const sampleCards = basketState.products.map((sample) => {
    const {
      name,
      image,
      path,
      colour,
      textureFamily,
      measurements,
      goodBetterBest
    } = sample;
    const media = image
      ? createImageProps({
          type: "Descriptive",
          altText: name,
          image: {
            file: {
              fileName: name,
              url: image
            }
          },
          focalPoint: { x: 0, y: 0 },
          className: classes["product-image"]
        })
      : undefined;

    const removeFromBasket = (payload: Sample) => {
      basketDispatch({
        type: ACTION_TYPES.BASKET_REMOVE,
        payload
      });
    };

    const handleRemove = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation();
      removeFromBasket(sample);
    };

    return (
      <ProductSampleCard
        className={classes["product-wrapper"]}
        key={path}
        title={name}
        subtitle={[colour, textureFamily].filter(isDefined).join(" | ")}
        description={measurements}
        media={media}
        to={getPathWithCountryCode(countryCode, path)}
        component={Link}
        ctaLabel={getMicroCopy(microCopy.PDP_OVERVIEW_REMOVE_SAMPLE)}
        removeSample={handleRemove}
        tag={
          goodBetterBest && {
            level: getLevel(goodBetterBest),
            // eslint-disable-next-line security/detect-object-injection
            label: getMicroCopy(goodBetterBestLabels[goodBetterBest])
          }
        }
        data-testid={`shopping-cart-product-${replaceSpaces(name)}`}
      />
    );
  });

  return <StyledSampleBasketSection>{sampleCards}</StyledSampleBasketSection>;
};

export default SampleBasketSectionProducts;
