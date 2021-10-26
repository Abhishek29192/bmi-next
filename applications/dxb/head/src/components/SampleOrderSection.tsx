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
    if (!basketFull() && isSampleOrderAllowed) {
      return getMicroCopy("pdp.overview.canAddMoreMessage");
    } else if (!basketFull()) {
      return getMicroCopy("pdp.overview.canAddOtherMessage");
    } else if (basketFull) {
      return getMicroCopy("pdp.overview.sampleLimitReachedMessage");
    }
  };

  return (
    (isSampleOrderAllowed || basketState.products.length > 0) && (
      <Section
        backgroundColor="white"
        spacing="none"
        className={styles["SampleOrderSection"]}
        hasNoPadding
      >
        {basketState.products.length > 0 && (
          <div className={styles["maximum-sample-message"]}>
            {sampleMessage()}
          </div>
        )}

        <div className={styles["buttons-container"]}>
          {isSampleOrderAllowed ? (
            !hasSampleInTheBasket() && !basketFull() ? (
              <Button
                className={styles["add-to-basket"]}
                endIcon={<Add />}
                onClick={() => addToBasket(variant)}
              >
                {getMicroCopy("pdp.overview.addSample")}
              </Button>
            ) : hasSampleInTheBasket() ? (
              <Button
                className={styles["remove-from-basket"]}
                endIcon={<Remove />}
                onClick={() => removeFromBasket(variant)}
                variant="text"
              >
                {getMicroCopy("pdp.overview.removeSample")}
              </Button>
            ) : undefined
          ) : undefined}
          {basketState.products.length > 0 && (
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
