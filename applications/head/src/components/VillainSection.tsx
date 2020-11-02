import React, { useContext } from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Villain, { Props as VillainProps } from "@bmi/villain";
import { Data as PromoData } from "../components/Promo";
import { SiteContext } from "./Site";
import { getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";

export type Data = {
  __typename: "ContentfulVillainSection";
  title: string;
  promo: PromoData | PageInfoData;
};

const VillainSection = ({
  data: { title, promo },
  backgroundColor
}: {
  data: Data;
  backgroundColor: "pearl" | "white";
}) => {
  const { countryCode, resources } = useContext(SiteContext);
  const {
    featuredImage,
    title: villainTitle,
    subtitle,
    ...typePromoData
  } = promo;

  const VillainProperties: VillainProps = {
    title: villainTitle,
    children: subtitle,
    imageSource: featuredImage?.file.url,
    cta: getCTA(typePromoData, countryCode, resources["page.linkLabel"])
  };

  return (
    <Section backgroundColor={backgroundColor}>
      <Section.Title>{title}</Section.Title>
      <Villain {...VillainProperties} />
    </Section>
  );
};

export default VillainSection;

export const query = graphql`
  fragment VillainSectionFragment on ContentfulVillainSection {
    title
    promo {
      ... on ContentfulPromoOrPage {
        ...PromoFragment
        ...PageInfoFragment
      }
    }
  }
`;
