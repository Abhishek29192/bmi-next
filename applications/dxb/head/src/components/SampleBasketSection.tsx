import React, { useState } from "react";
import { graphql } from "gatsby";

import Button from "@bmi/button";
import Section from "@bmi/section";
import { ShoppingCart } from "@material-ui/icons";
import RichText, { RichTextData } from "./RichText";
import SampleBasketSectionProducts from "./SampleBasketSectionProducts";
import { useSiteContext } from "./Site";

import FormSection, { Data as FormData } from "./FormSection";
import styles from "./styles/SampleBasketSection.module.scss";

export type Data = {
  __typename: "SampleBasketSection";
  description: RichTextData;
  sections: FormData | null;
};

const SampleBasketSection = ({
  data: { description, sections }
}: {
  data: Data;
}) => {
  const [isCompleteFormShow, setCompleteFormShow] = useState(false);

  const handleCompleteClick = () => setCompleteFormShow(true);

  const { getMicroCopy } = useSiteContext();

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
          <FormSection data={sections} backgroundColor="pearl" />
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
    sections {
      ...FormSectionFragment
    }
  }
`;
