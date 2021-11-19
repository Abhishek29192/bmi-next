import React, { useState, useEffect } from "react";
import { graphql } from "gatsby";

import Button from "@bmi/button";
import Section from "@bmi/section";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import {
  SampleOrderElement,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { extractFeatureValuesByClassification } from "../utils/product-url-path";
import RichText, { RichTextData } from "./RichText";
import SampleBasketSectionProducts from "./SampleBasketSectionProducts";
import { useSiteContext } from "./Site";

import FormSection, { Data as FormData } from "./FormSection";
import styles from "./styles/SampleBasketSection.module.scss";
import { ClassificationCodeEnum, FeatureCodeEnum } from "./types/pim";
import { Data as PageInfoData } from "./PageInfo";
import { getCTA } from "./Link";

export type Data = {
  __typename: "SampleBasketSection";
  description: RichTextData | null;
  checkoutFormSection: FormData | null;
  emptyBasketMessage: RichTextData | null;
  browseProductsCTALabel: string | null;
  browseProductsCTA: PageInfoData | null;
};

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

  const handleCompleteClick = () => setCompleteFormShow(true);

  const { getMicroCopy, countryCode } = useSiteContext();

  const { basketState } = useBasketContext();

  useEffect(() => {
    setHasSamplesInTheBasket(basketState && basketState.products.length > 0);
  }, [basketState]);

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

    return {
      id: sample.code,
      title: sample.name,
      url: sample.path,
      color,
      texture
    };
  });

  const basketCta =
    browseProductsCTA &&
    getCTA(browseProductsCTA, countryCode, browseProductsCTA.title);

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
            additionalValues={{ samples }}
            isSubmitDisabled={samples.length === 0}
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
      ...PageInfoFragment
    }
  }
`;
