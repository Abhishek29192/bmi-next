import Button from "@bmi/button";
import { Add, Remove, ShoppingCart } from "@material-ui/icons";
import Section from "@bmi/section";
import React, { useEffect } from "react";
import { useContext } from "react";
import styles from "./styles/SampleOrderSection.module.scss";
import { useSiteContext } from "./Site";

import BasketContext, { ACTION_TYPES } from "./SampleBasketContext";
import { VariantOption } from "./types/pim";

const SampleOrderSection = ({
  onlyDisplayCompleteOrder = false,
  variant
}: {
  variant?: VariantOption;
  onlyDisplayCompleteOrder?: Boolean;
}) => {
  const { basketState, basketDispatch } = useContext(BasketContext);
  //actions
  const addToBasket = (variant: VariantOption) => {
    basketDispatch({ type: ACTION_TYPES.BASKET_ADD, payload: variant });
  };
  const removeFromBasket = (variant: VariantOption) => {
    basketDispatch({ type: ACTION_TYPES.BASKET_REMOVE, payload: variant });
  };
  const hasSampleInTheBasket = (): boolean => {
    return (
      basketState.products.filter((product) => product.code === variant.code)
        .length > 0
    );
  };

  useEffect(() => {
    localStorage.setItem("basketItems", JSON.stringify(basketState.products));
  }, [basketState]);
  const { getMicroCopy } = useSiteContext();

  return (
    <Section
      backgroundColor="white"
      spacing="none"
      className={styles["SampleOrderSection"]}
      hasNoPadding
    >
      <div
        className={
          onlyDisplayCompleteOrder
            ? styles["buttons-container-complete-sample-order-only"]
            : styles["buttons-container"]
        }
      >
        {variant ? (
          !hasSampleInTheBasket() ? (
            <Button endIcon={<Add />} onClick={() => addToBasket(variant)}>
              {getMicroCopy("pdp.overview.addSample")}
            </Button>
          ) : (
            <Button
              endIcon={<Remove />}
              onClick={() => removeFromBasket(variant)}
              variant="text"
            >
              {getMicroCopy("pdp.overview.removeSample")}
            </Button>
          )
        ) : undefined}
        {basketState.products.length && (
          <Button endIcon={<ShoppingCart />} variant="outlined">
            {getMicroCopy("pdp.overview.completeSampleOrder")}
          </Button>
        )}
      </div>
    </Section>
  );
};

export default SampleOrderSection;
