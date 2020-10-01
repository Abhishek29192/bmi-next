import React from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Villain, { Props as VillainProps } from "@bmi/villain";
import { Data as PromoData } from "../components/Promo";

export type Data = {
  __typename: "ContentfulVillainSection";
  title: string;
  promo: PromoData;
  isReversed: boolean;
};

const VillainSection = ({
  data: { title, promo, isReversed },
  backgroundColor
}: {
  data: Data;
  backgroundColor: "pearl" | "white";
}) => {
  const { image, title: villainTitle, subtitle } = promo;
  const VillainProps: VillainProps = {
    title: villainTitle,
    children: subtitle,
    imageSource: image?.file.url
  };

  return (
    <Section backgroundColor={backgroundColor}>
      <Section.Title>{title}</Section.Title>
      <Villain {...VillainProps} />
    </Section>
  );
};

export default VillainSection;

export const query = graphql`
  fragment VillainSectionFragment on ContentfulVillainSection {
    title
    promo {
      ...PromoFragment
    }
    isReversed
  }
`;
