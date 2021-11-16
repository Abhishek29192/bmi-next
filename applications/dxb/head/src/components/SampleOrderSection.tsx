import Button from "@bmi/button";
import { Add, Remove, ShoppingCart } from "@material-ui/icons";
import Section from "@bmi/section";
import React, { useEffect, useState } from "react";
import {
  ACTION_TYPES,
  createSample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import styles from "./styles/SampleOrderSection.module.scss";
import { useSiteContext } from "./Site";
import { getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import { Product, VariantOption } from "./types/pim";

const SampleOrderSection = ({
  isSampleOrderAllowed,
  product,
  variant,
  maximumSamples,
  sampleBasketLinkInfo
}: {
  isSampleOrderAllowed: Boolean;
  product: Product;
  variant?: VariantOption;
  maximumSamples?: number;
  sampleBasketLinkInfo?: PageInfoData;
}) => {
  const { basketState, basketDispatch } = useBasketContext();
  //actions
  const addToBasket = (variant: VariantOption) => {
    basketDispatch({
      type: ACTION_TYPES.BASKET_ADD,
      payload: createSample(product, variant)
    });
  };
  const removeFromBasket = (variant: VariantOption) => {
    basketDispatch({
      type: ACTION_TYPES.BASKET_REMOVE,
      payload: createSample(product, variant)
    });
  };
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
  const [hasSampleInTheBasket, setHasSampleInTheBasket] = useState(false);
  const { countryCode } = useSiteContext();
  useEffect(() => {
    if (variant) {
      setHasSampleInTheBasket(
        basketState.products.filter((product) => product.code === variant.code)
          .length > 0
      );
    }
  }, [basketState]);
  const cta =
    sampleBasketLinkInfo &&
    getCTA(sampleBasketLinkInfo, countryCode, sampleBasketLinkInfo?.slug);

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
          {basketHasProducts && cta && cta.action && (
            <Button
              className={styles["complete-order"]}
              endIcon={<ShoppingCart />}
              variant="outlined"
              action={cta.action}
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
