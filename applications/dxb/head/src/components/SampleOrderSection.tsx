import Button from "@bmi/button";
import { Add, Remove, ShoppingCart } from "@material-ui/icons";
import Section from "@bmi/section";
import React from "react";
import {
  ACTION_TYPES,
  useBasketContext
} from "../contexts/SampleBasketContext";
import styles from "./styles/SampleOrderSection.module.scss";
import { useSiteContext } from "./Site";
import { VariantOption } from "./types/pim";

const SampleOrderSection = ({
  onlyDisplayCompleteOrder = false,
  variant,
  productName,
  maximumSamples
}: {
  variant?: VariantOption;
  onlyDisplayCompleteOrder?: Boolean;
  productName?: string;
  maximumSamples?: number;
}) => {
  const { basketState, basketDispatch } = useBasketContext();
  //actions
  const addToBasket = (variant: VariantOption) => {
    basketDispatch({
      type: ACTION_TYPES.BASKET_ADD,
      payload: { ...variant, name: productName }
    });
  };
  const removeFromBasket = (variant: VariantOption) => {
    basketDispatch({
      type: ACTION_TYPES.BASKET_REMOVE,
      payload: { ...variant, name: productName }
    });
  };
  const hasSampleInTheBasket = (): boolean => {
    if (variant) {
      return (
        basketState.products.filter((product) => product.code === variant.code)
          .length > 0
      );
    }
  };

  const basketFull = (): boolean => {
    return basketState.products.length >= maximumSamples;
  };

  const { getMicroCopy } = useSiteContext();

  const sampleMessage = () => {
    if (!basketFull() && variant) {
      return getMicroCopy("pdp.overview.canAddMoreMessage");
    } else if (!basketFull() && onlyDisplayCompleteOrder) {
      return getMicroCopy("pdp.overview.canAddOtherMessage");
    } else if (basketFull) {
      return getMicroCopy("pdp.overview.sampleLimitReachedMessage");
    }
  };

  return (
    <Section
      backgroundColor="white"
      spacing="none"
      className={styles["SampleOrderSection"]}
      hasNoPadding
    >
      <div className={styles["maximum-sample-message"]}>{sampleMessage()}</div>

      <div
        className={
          onlyDisplayCompleteOrder
            ? styles["buttons-container-complete-sample-order-only"]
            : styles["buttons-container"]
        }
      >
        {variant ? (
          !hasSampleInTheBasket() && !basketFull() ? (
            <Button endIcon={<Add />} onClick={() => addToBasket(variant)}>
              {getMicroCopy("pdp.overview.addSample")}
            </Button>
          ) : hasSampleInTheBasket() ? (
            <Button
              endIcon={<Remove />}
              onClick={() => removeFromBasket(variant)}
              variant="text"
            >
              {getMicroCopy("pdp.overview.removeSample")}
            </Button>
          ) : null
        ) : undefined}
        {basketState.products.length > 0 && (
          <Button endIcon={<ShoppingCart />} variant="outlined">
            {getMicroCopy("pdp.overview.completeSampleOrder")}
          </Button>
        )}
      </div>
    </Section>
  );
};

export default SampleOrderSection;
