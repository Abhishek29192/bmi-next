import React, { useEffect, useState } from "react";
import { graphql } from "gatsby";
import { Button, Section } from "@bmi/components";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import {
  ACTION_TYPES,
  SampleOrderElement,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { createActionLabel } from "../utils/createActionLabelForAnalytics";
import { getPathWithCountryCode } from "../utils/path";
import { microCopy } from "../constants/microCopies";
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

const formatSamples = (
  samples: SampleOrderElement[],
  attributeSeparator: string,
  sampleSeparator: string
) =>
  samples
    .map((sample) =>
      Object.entries(sample)
        .filter(([_, value]) => !!value)
        .map(([key, value]) => `${key}: ${value}`)
        .join(attributeSeparator)
    )
    .join(sampleSeparator);

const emailFormatSamples = (samples: SampleOrderElement[]) =>
  formatSamples(samples, "<br>", "<br><br>");

const hubSpotFormatSamples = (samples: SampleOrderElement[]) =>
  formatSamples(samples, ", ", " | ");

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
    const { classifications } = sample;

    let color: string | undefined;
    let texture: string | undefined;
    let width: string | undefined;
    let length: string | undefined;
    let height: string | undefined;
    let unit: string | undefined;
    classifications
      .filter(
        (classification) =>
          classification.code === ClassificationCodeEnum.APPEARANCE_ATTRIBUTE ||
          classification.code === ClassificationCodeEnum.MEASUREMENTS
      )
      .forEach((classification) =>
        classification.features.forEach((feature) => {
          const featureCode = feature.code.split("/").pop();
          if (
            featureCode ===
            `${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.COLOUR}`
          ) {
            color = feature.featureValues[0]?.value;
            return;
          }
          if (
            featureCode ===
            `${ClassificationCodeEnum.APPEARANCE_ATTRIBUTE}.${FeatureCodeEnum.TEXTURE_FAMILY}`
          ) {
            texture = feature.featureValues[0]?.value;
            return;
          }
          if (
            featureCode ===
            `${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.WIDTH}`
          ) {
            width = feature.featureValues[0]?.value;
            unit = feature.featureUnit?.symbol;
            return;
          }
          if (
            featureCode ===
            `${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.LENGTH}`
          ) {
            length = feature.featureValues[0]?.value;
            unit = feature.featureUnit?.symbol;
            return;
          }
          if (
            featureCode ===
            `${ClassificationCodeEnum.MEASUREMENTS}.${FeatureCodeEnum.HEIGHT}`
          ) {
            height = feature.featureValues[0]?.value;
            unit = feature.featureUnit?.symbol;
            return;
          }
        })
      );

    const measurements = [width, length, height].filter(Boolean).join("x");

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
      texture,
      measurements: measurements
        ? `${measurements}${unit ? ` ${unit}` : ""}`
        : undefined
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
              samples:
                checkoutFormSection.source === "HubSpot"
                  ? hubSpotFormatSamples(samples)
                  : emailFormatSamples(samples)
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
