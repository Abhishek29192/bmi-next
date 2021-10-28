import React from "react";

import { ShoppingCart } from "@material-ui/icons";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Button from "@bmi/button";
import styles from "./styles/SampleBasketSection.module.scss";
import RichText, { RichTextData } from "./RichText";
import SampleBasketSectionProducts from "./SampleBasketSectionProducts";
import { useSiteContext } from "./Site";

export type Data = {
  __typename: "SampleBasketSection";
  description: RichTextData;
};

const SampleBasketSection = ({ data: { description } }: { data: Data }) => {
  const { getMicroCopy } = useSiteContext();

  return (
    <Section backgroundColor="white" className={styles["SampleBasketSection"]}>
      <RichText document={description} />
      <SampleBasketSectionProducts />
      <div className={styles["complete-button"]}>
        <Button endIcon={<ShoppingCart />}>
          {getMicroCopy("pdp.overview.completeSampleOrder")}
        </Button>
      </div>
    </Section>
  );
};

export default SampleBasketSection;

export const query = graphql`
  fragment SampleBasketSectionFragment on ContentfulSampleBasketSection {
    description {
      ...RichTextFragment
    }
  }
`;
