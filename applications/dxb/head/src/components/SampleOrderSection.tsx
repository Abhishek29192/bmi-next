import { Button, ButtonProps, Section } from "@bmi-digital/components";
import { Add, Remove, ShoppingCart } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import { microCopy } from "../constants/microCopies";
import {
  ACTION_TYPES,
  createSample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { Product } from "../types/pim";
import { createActionLabel } from "../utils/createActionLabelForAnalytics";
import withGTM from "../utils/google-tag-manager";
import { getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import { useSiteContext } from "./Site";
import styles from "./styles/SampleOrderSection.module.scss";

const SampleOrderSection = ({
  isSampleOrderAllowed,
  product,
  maximumSamples,
  sampleBasketLinkInfo,
  actionLabel
}: {
  isSampleOrderAllowed: boolean;
  product: Product;
  maximumSamples?: number;
  sampleBasketLinkInfo?: PageInfoData;
  actionLabel?: string;
}) => {
  const { basketState, basketDispatch } = useBasketContext();
  //actions
  const addToBasket = (product: Product) => {
    basketDispatch({
      type: ACTION_TYPES.BASKET_ADD,
      payload: createSample(product)
    });
  };
  const removeFromBasket = (product: Product) => {
    basketDispatch({
      type: ACTION_TYPES.BASKET_REMOVE,
      payload: createSample(product)
    });
  };

  const { getMicroCopy } = useSiteContext();

  const sampleMessage = () => {
    if (isBasketFull) {
      return getMicroCopy(microCopy.PDP_OVERVIEW_SAMPLE_LIMIT_REACHED_MESSAGE);
    }
    if (isSampleOrderAllowed) {
      return getMicroCopy(microCopy.PDP_OVERVIEW_CAN_ADD_MORE_MESSAGE);
    }
    return getMicroCopy(microCopy.PDP_OVERVIEW_CAN_ADD_OTHER_MESSAGE);
  };
  const [hasSampleInTheBasket, setHasSampleInTheBasket] = useState(false);
  const [isBasketFull, setIsBasketFull] = useState(false);
  const [basketHasProducts, setBasketHasProducts] = useState(false);
  const { countryCode } = useSiteContext();
  useEffect(() => {
    if (product) {
      setHasSampleInTheBasket(
        basketState.products.filter(
          (brasketProduct) => brasketProduct.code === product.code
        ).length > 0
      );
    }
    setIsBasketFull(basketState?.products?.length >= maximumSamples);
    setBasketHasProducts(basketState?.products?.length > 0);
  }, [basketState]);
  const cta =
    sampleBasketLinkInfo &&
    getCTA(sampleBasketLinkInfo, countryCode, sampleBasketLinkInfo.slug);
  const GTMButton = withGTM<ButtonProps>(Button);

  const gtmAction =
    actionLabel ||
    createActionLabel(
      product.name,
      product.colour,
      product.textureFamily,
      product.measurements?.label
    );

  return (
    (isSampleOrderAllowed || basketHasProducts) && (
      <div className={styles["SampleOrderSection"]}>
        <div className={styles["container"]}>
          <Section backgroundColor="white" spacing="none" hasNoPadding>
            {basketHasProducts && (
              <div className={styles["sample-message"]}>{sampleMessage()}</div>
            )}

            <div className={styles["buttons-container"]}>
              {isSampleOrderAllowed ? (
                hasSampleInTheBasket ? (
                  <Button
                    className={styles["remove-from-basket"]}
                    endIcon={<Remove />}
                    onClick={() => removeFromBasket(product)}
                    variant="text"
                  >
                    {getMicroCopy(microCopy.PDP_OVERVIEW_REMOVE_SAMPLE)}
                  </Button>
                ) : !isBasketFull ? (
                  <GTMButton
                    className={styles["add-to-basket"]}
                    endIcon={<Add />}
                    onClick={() => addToBasket(product)}
                    gtm={{
                      id: "cta-click1-samples-ordering",
                      label: getMicroCopy(microCopy.PDP_OVERVIEW_ADD_SAMPLE),
                      action: gtmAction
                    }}
                  >
                    {getMicroCopy(microCopy.PDP_OVERVIEW_ADD_SAMPLE)}
                  </GTMButton>
                ) : undefined
              ) : undefined}
              {basketHasProducts && cta && cta.action && (
                <Button
                  className={styles["complete-order"]}
                  endIcon={<ShoppingCart />}
                  variant="outlined"
                  action={cta.action}
                >
                  {getMicroCopy(microCopy.PDP_OVERVIEW_COMPLETE_SAMPLE_ORDER)}
                </Button>
              )}
            </div>
          </Section>
        </div>
      </div>
    )
  );
};

export default SampleOrderSection;
