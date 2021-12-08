import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";

import Button from "@bmi/button";
import Section from "@bmi/section";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import {
  ACTION_TYPES,
  SampleOrderElement,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { createActionLabel } from "../utils/createActionLabelForAnalytics";
import { getPathWithCountryCode } from "../utils/path";
import { extractFeatureValuesByClassification } from "../utils/features-from-classifications-transfroms";
import RichText, { RichTextData } from "./RichText";
import SampleBasketSectionProducts from "./SampleBasketSectionProducts";
import { useSiteContext } from "./Site";

import FormSection, { Data as FormData } from "./FormSection";
import styles from "./styles/SampleBasketSection.module.scss";
import { ClassificationCodeEnum, FeatureCodeEnum } from "./types/pim";
import { Data as PageInfoData } from "./PageInfo";
import { getCTA } from "./Link";

const classificationConfig = {
  [ClassificationCodeEnum.APPEARANCE_ATTRIBUTE]: [
    { attrName: FeatureCodeEnum.COLOUR },
    {
      attrName: FeatureCodeEnum.TEXTURE_FAMILY,
      separator: " | ",
      fromStart: true
    }
  ],
  [ClassificationCodeEnum.MEASUREMENTS]: [
    { attrName: FeatureCodeEnum.LENGTH, separator: "x" },
    { attrName: FeatureCodeEnum.WIDTH, separator: "x" },
    { attrName: FeatureCodeEnum.HEIGHT, separator: "x" }
  ]
};

export type Data = {
  __typename: "SampleBasketSection";
  description: RichTextData | null;
  checkoutFormSection: FormData | null;
  emptyBasketMessage: RichTextData | null;
  browseProductsCTALabel: string | null;
  browseProductsCTA: PageInfoData | null;
};

const formatSamples = (samples: SampleOrderElement[]) =>
  samples
    .map((sample) =>
      Object.entries(sample)
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

  let actionLabels = [];
  const samples: SampleOrderElement[] = basketState.products.map((sample) => {
    const { classifications } = sample;
    const featureAttributeMapForUrl = {
      [ClassificationCodeEnum.APPEARANCE_ATTRIBUTE]: [
        { attrName: FeatureCodeEnum.COLOUR },
        { attrName: FeatureCodeEnum.TEXTURE_FAMILY }
      ]
    };
    const [color, texture] = extractFeatureValuesByClassification(
      classifications,
      featureAttributeMapForUrl
    );

    const actionLabel = createActionLabel(
      sample.name,
      classifications,
      classificationConfig
    );
    actionLabels.push(actionLabel);
    return {
      id: sample.code,
      title: sample.name,
      url: `${window.location.origin}${getPathWithCountryCode(
        countryCode,
        sample.path
      )}`,
      color,
      texture
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
              {getMicroCopy("pdp.overview.completeSampleOrder")}
            </Button>
          </div>
        )}
      </Section>
      {isCompleteFormShow && hasSamplesInTheBasket && (
        <Section>
          <FormSection
            data={checkoutFormSection}
            backgroundColor="pearl"
            additionalValues={{ samples: formatSamples(samples) }}
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

export const query = graphql`
  fragment SampleBasketSectionFragment on ContentfulSampleBasketSection {
    description {
      ...RichTextFragment
    }
    checkoutFormSection {
      ...FormSectionFragment
    }
    emptyBasketMessage {
      ...RichTextFragment
    }
    browseProductsCTALabel
    browseProductsCTA {
      ... on ContentfulHomePage {
        path
      }
      ... on ContentfulPage {
        path
      }
    }
  }
`;
