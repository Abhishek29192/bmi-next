import Button, { ButtonProps } from "@bmi-digital/components/button";
import Add from "@bmi-digital/components/icon/Add";
import Remove from "@bmi-digital/components/icon/Remove";
import ShoppingCart from "@bmi-digital/components/icon/ShoppingCart";
import Section from "@bmi-digital/components/section";
import { microCopy } from "@bmi/microcopies";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import React from "react";
import {
  ACTION_TYPES,
  createSample,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { Product } from "../types/pim";
import { createActionLabel } from "../utils/createActionLabelForAnalytics";
import withGTM from "../utils/google-tag-manager";
import { getPathWithCountryCode } from "../utils/path";
import { Data as PageInfoData } from "./PageInfo";
import { useSiteContext } from "./Site";
import {
  StyledSampleOrderContainer,
  classes
} from "./styles/SampleOrderSection.styles";

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
  const [basketHasProducts, setBasketHasProducts] = useState(
    basketState.products.length > 0
  );
  const { countryCode } = useSiteContext();
  useEffect(() => {
    if (product) {
      setHasSampleInTheBasket(
        basketState.products.filter(
          (brasketProduct) => brasketProduct.code === product.code
        ).length > 0
      );
    }
    setIsBasketFull(
      maximumSamples ? basketState?.products?.length >= maximumSamples : false
    );
    setBasketHasProducts(basketState?.products?.length > 0);
  }, [basketState, maximumSamples, product]);
  const GTMButton = withGTM<ButtonProps>(Button);

  const gtmAction =
    actionLabel ||
    createActionLabel(
      product.name,
      product.colour,
      product.textureFamily,
      product.measurements?.label
    );

  const sampleBasketUrl =
    basketHasProducts &&
    sampleBasketLinkInfo &&
    getPathWithCountryCode(countryCode, sampleBasketLinkInfo.path).replace(
      /\/+/gi,
      "/"
    );

  return (
    (isSampleOrderAllowed || basketHasProducts) && (
      <div>
        <StyledSampleOrderContainer>
          <Section
            backgroundColor="white"
            spacing="none"
            hasNoPadding
            id={`sample-order`}
          >
            {basketHasProducts && (
              <div className={classes["sample-message"]}>{sampleMessage()}</div>
            )}

            <div className={classes["buttons-container"]}>
              {isSampleOrderAllowed ? (
                hasSampleInTheBasket ? (
                  <Button
                    endIcon={<Remove />}
                    onClick={() => removeFromBasket(product)}
                    variant="text"
                    data-testid={"remove-from-basket-button"}
                  >
                    {getMicroCopy(microCopy.PDP_OVERVIEW_REMOVE_SAMPLE)}
                  </Button>
                ) : !isBasketFull ? (
                  <GTMButton
                    endIcon={<Add />}
                    onClick={() => addToBasket(product)}
                    gtm={{
                      id: "cta-click1-samples-ordering",
                      label: getMicroCopy(microCopy.PDP_OVERVIEW_ADD_SAMPLE),
                      action: gtmAction
                    }}
                    data-testid={"add-to-basket-button"}
                  >
                    {getMicroCopy(microCopy.PDP_OVERVIEW_ADD_SAMPLE)}
                  </GTMButton>
                ) : undefined
              ) : undefined}
              {sampleBasketUrl && (
                <Button
                  className={classes["complete-order"]}
                  endIcon={<ShoppingCart />}
                  variant="outlined"
                  href={sampleBasketUrl}
                  component={NextLink}
                  gtm={{
                    id: "cta-click1",
                    action: sampleBasketUrl,
                    label: sampleBasketLinkInfo.slug
                  }}
                  data-testid={"complete-order-basket-button"}
                >
                  {getMicroCopy(microCopy.PDP_OVERVIEW_COMPLETE_SAMPLE_ORDER)}
                </Button>
              )}
            </div>
          </Section>
        </StyledSampleOrderContainer>
      </div>
    )
  );
};

export default SampleOrderSection;
