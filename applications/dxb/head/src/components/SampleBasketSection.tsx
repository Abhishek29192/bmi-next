import React, { useState } from "react";
import { graphql } from "gatsby";

import Button from "@bmi/button";
import Section from "@bmi/section";
import { ShoppingCart } from "@material-ui/icons";
import {
  SampleOrderElement,
  useBasketContext
} from "../contexts/SampleBasketContext";
import { extractFeatureValuesByClassification } from "../utils/product-url-path";
import RichText, { RichTextData } from "./RichText";
import SampleBasketSectionProducts, {
  getFeatures
} from "./SampleBasketSectionProducts";
import { useSiteContext } from "./Site";

import FormSection, { Data as FormData } from "./FormSection";
import styles from "./styles/SampleBasketSection.module.scss";

export type Data = {
  __typename: "SampleBasketSection";
  description: RichTextData;
  checkoutFormSection: FormData | null;
};

const SampleBasketSection = ({
  data: { description, checkoutFormSection }
}: {
  data: Data;
}) => {
  const [isCompleteFormShow, setCompleteFormShow] = useState(false);

  const handleCompleteClick = () => setCompleteFormShow(true);

  const { getMicroCopy } = useSiteContext();

  const { basketState } = useBasketContext();
  const samples: SampleOrderElement[] = basketState.products.map((sample) => {
    const { classifications } = sample;

    const [color, texture] = extractFeatureValuesByClassification(
      classifications,
      {
        appearanceAttributes: ["colour", "texturefamily"]
      }
    );

    return {
      id: sample.code,
      title: sample.name,
      url: sample.path,
      color,
      texture
    };
  });

  return (
    <>
      <Section
        backgroundColor="white"
        className={styles["SampleBasketSection"]}
      >
        <RichText document={description} />
        <SampleBasketSectionProducts />
        {!isCompleteFormShow && (
          <div className={styles["complete-button"]}>
            <Button endIcon={<ShoppingCart />} onClick={handleCompleteClick}>
              {getMicroCopy("pdp.overview.completeSampleOrder")}
            </Button>
          </div>
        )}
      </Section>
      {isCompleteFormShow && (
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
  }
`;
