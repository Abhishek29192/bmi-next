import Button from "@bmi/button/src";
import React, { Fragment, useEffect } from "react";
import { useContext } from "react";
import BasketContext, { ACTION_TYPES } from "./SampleBasketContext";
import { VariantOption } from "./types/ProductBaseTypes";

const SampleSectionTest = ({ variant }: { variant: VariantOption }) => {
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
  return (
    <Fragment>
      {!hasSampleInTheBasket() ? (
        <Button onClick={() => addToBasket(variant)}>Add to sample</Button>
      ) : (
        <Button onClick={() => removeFromBasket(variant)}>remove sample</Button>
      )}
      {basketState.products.length && <Button>complete sample order</Button>}
    </Fragment>
  );
};
export default SampleSectionTest;
