import ProductSampleCard from "@bmi-digital/components/product-sample-card";
import { microCopy } from "@bmi/microcopies";
import { isDefined } from "@bmi/utils";
import NextLink from "next/link";
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
  classes,
  StyledSampleBasketSection
} from "./styles/SampleBasketSectionProducts.styles";
import createGenericImageProps from "./image/generic-image/createGenericImageProps";

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
      ? createGenericImageProps({
          size: "contain",
          altText: name,
          src: image,
          className: classes["product-image"],
          width: 110,
          height: 80
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
        href={getPathWithCountryCode(countryCode, path)}
        component={NextLink}
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
