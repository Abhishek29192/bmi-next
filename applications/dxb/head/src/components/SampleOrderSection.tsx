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
  isSampleOrderAllowed,
  variant,
  productName,
  maximumSamples
}: {
  isSampleOrderAllowed: Boolean;
  variant?: VariantOption;
  maximumSamples?: number;
  productName?: string;
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
  const hasSampleInTheBasket = variant
    ? basketState.products.filter((product) => product.code === variant.code)
        .length > 0
    : undefined;

  const isBasketFull = basketState.products.length >= maximumSamples;
  const basketHasProducts = basketState.products.length > 0;

  const { getMicroCopy } = useSiteContext();

  const sampleMessage = () => {
    if (isBasketFull) {
      return getMicroCopy("pdp.overview.sampleLimitReachedMessage");
    }
    if (isSampleOrderAllowed) {
      return getMicroCopy("pdp.overview.canAddMoreMessage");
    }
    return getMicroCopy("pdp.overview.canAddOtherMessage");
  };

  return (
    (isSampleOrderAllowed || basketHasProducts) && (
      <Section
        backgroundColor="white"
        spacing="none"
        className={styles["SampleOrderSection"]}
        hasNoPadding
      >
        {basketHasProducts && (
          <div className={styles["sample-message"]}>{sampleMessage()}</div>
        )}

        <div className={styles["buttons-container"]}>
          {isSampleOrderAllowed ? (
            hasSampleInTheBasket ? (
              <Button
                className={styles["remove-from-basket"]}
                endIcon={<Remove />}
                onClick={() => removeFromBasket(variant)}
                variant="text"
              >
                {getMicroCopy("pdp.overview.removeSample")}
              </Button>
            ) : !isBasketFull ? (
              <Button
                className={styles["add-to-basket"]}
                endIcon={<Add />}
                onClick={() => addToBasket(variant)}
              >
                {getMicroCopy("pdp.overview.addSample")}
              </Button>
            ) : undefined
          ) : undefined}
          {basketHasProducts && (
            <Button
              className={styles["complete-order"]}
              endIcon={<ShoppingCart />}
              variant="outlined"
            >
              {getMicroCopy("pdp.overview.completeSampleOrder")}
            </Button>
          )}
        </div>
      </Section>
    )
  );
};

export default SampleOrderSection;
