import { Button, Section } from "@bmi/components";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import React, { useEffect, useState } from "react";
import { microCopy } from "../constants/microCopies";
import {
  ACTION_TYPES,
  SampleOrderElement,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { createActionLabel } from "../utils/createActionLabelForAnalytics";
import { getPathWithCountryCode } from "../utils/path";
import FormSection from "./FormSection";
import { getCTA } from "./Link";
import RichText from "./RichText";
import { Data } from "./SampleBasketBase";
import SampleBasketSectionProducts from "./SampleBasketSectionProducts";
import { useSiteContext } from "./Site";
import styles from "./styles/SampleBasketSection.module.scss";

const formatSamples = (samples: SampleOrderElement[]) =>
  samples
    .map((sample) =>
      Object.entries(sample)
        .filter(([_, value]) => !!value)
        .map(([key, value]) => `${key}: ${value}`)
        .join("<br>")
    )
    .join("<br><br>");

const SampleBasketSection = ({
  data: {
    description,
    checkoutFormSection,
    emptyBasketMessage,
    browseProductsCTALabel,
    browseProductsCTA
  }
}: {
  data: Data;
}) => {
  const [isCompleteFormShow, setCompleteFormShow] = useState(false);
  const [hasSamplesInTheBasket, setHasSamplesInTheBasket] = useState(false);
  const { basketState, basketDispatch } = useBasketContext();

  const { getMicroCopy, countryCode } = useSiteContext();

  useEffect(() => {
    setHasSamplesInTheBasket(basketState && basketState.products.length > 0);
  }, [basketState]);

  const handleCompleteClick = () => setCompleteFormShow(true);
  const handleSuccess = () =>
    basketDispatch({ type: ACTION_TYPES.BASKET_CLEAR });

  const actionLabels = [];
  const samples: SampleOrderElement[] = basketState.products.map((sample) => {
    const actionLabel = createActionLabel(
      sample.name,
      sample.colour,
      sample.textureFamily,
      sample.measurements
    );
    actionLabels.push(actionLabel);
    return {
      id: sample.code,
      title: sample.name,
      url: `${window.location.origin}${getPathWithCountryCode(
        countryCode,
        sample.path
      )}`,
      color: sample.colour,
      texture: sample.textureFamily,
      measurements: sample.measurements
    };
  });

  const basketCta =
    browseProductsCTALabel &&
    browseProductsCTA &&
    getCTA(browseProductsCTA, countryCode, browseProductsCTALabel);
  return (
    <>
      <Section
        backgroundColor="white"
        className={styles["SampleBasketSection"]}
      >
        <RichText document={description} />
        <SampleBasketSectionProducts />
        {!hasSamplesInTheBasket && <RichText document={emptyBasketMessage} />}

        {!hasSamplesInTheBasket && basketCta && basketCta.action && (
          <Button
            endIcon={<ArrowForwardIcon />}
            variant="outlined"
            action={basketCta.action}
          >
            {browseProductsCTALabel}
          </Button>
        )}
        {!isCompleteFormShow && hasSamplesInTheBasket && (
          <div className={styles["complete-button"]}>
            <Button endIcon={<ShoppingCart />} onClick={handleCompleteClick}>
              {getMicroCopy(microCopy.PDP_OVERVIEW_COMPLETE_SAMPLE_ORDER)}
            </Button>
          </div>
        )}
      </Section>
      {isCompleteFormShow && hasSamplesInTheBasket && (
        <Section>
          <FormSection
            data={checkoutFormSection}
            backgroundColor="pearl"
            additionalValues={{
              samples: formatSamples(samples)
            }}
            isSubmitDisabled={samples.length === 0}
            gtmOverride={{
              label: "samples ordering basket form submitted",
              action: actionLabels.join(", ")
            }}
            onSuccess={handleSuccess}
          />
        </Section>
      )}
    </>
  );
};

export default SampleBasketSection;
