import React, { useContext } from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Villain, { Props as VillainProps } from "@bmi/villain";
import { Data as PromoData } from "../components/Promo";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl } from "./Link";
import { PageInfoData as SimplePageInfoData } from "../templates/simple-page";
import { PageInfoData as ContactUsInfoData } from "../templates/contact-us-page";

export type Data = {
  __typename: "ContentfulVillainSection";
  title: string;
  promo: PromoData | SimplePageInfoData | ContactUsInfoData;
  isReversed: boolean;
};

const VillainSection = ({
  data: { title, promo, isReversed },
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

  let cta;

  if (typePromoData.__typename === "ContentfulPromo") {
    const { cta: ctaData } = typePromoData;

    cta = {
      label: ctaData?.label,
      action: getClickableActionFromUrl(
        ctaData?.linkedPage,
        ctaData?.url,
        countryCode
      )
    };
  } else {
    const { slug } = typePromoData;

    cta = {
      label: resources["page.linkLabel"],
      action: getClickableActionFromUrl({ slug }, null, countryCode)
    };
  }

  const VillainProps: VillainProps = {
    title: villainTitle,
    children: subtitle,
    imageSource: featuredImage?.file.url,
    cta
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
      __typename
      ... on ContentfulContactUsPageContentfulPromoContentfulSimplePageUnion {
        ...ContactUsInfoFragment
        ...SimplePageInfoFragment
        ...PromoFragment
      }
    }
    isReversed
  }
`;
