import React, { useContext } from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Villain, { Props as VillainProps } from "@bmi/villain";
import { Data as PromoData } from "../components/Promo";
import { SiteContext } from "./Site";
import { getClickableActionFromUrl } from "./Link";

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
  const { countryCode, resources } = useContext(SiteContext);
  const { image, title: villainTitle, subtitle, cta: promoCta, slug } = promo;

  let cta;

  if (!slug && promoCta) {
    // NOTE: handles case for promo without cta
    cta = {
      label: promoCta?.label,
      action: getClickableActionFromUrl(
        promoCta?.linkedPage,
        promoCta?.url,
        countryCode
      )
    };
  } else if (slug) {
    // NOTE: always cta without promo content type
    cta = {
      label: resources["page.linkLabel"],
      action: getClickableActionFromUrl({ slug }, null, countryCode)
    };
  }

  const VillainProps: VillainProps = {
    title: villainTitle,
    children: subtitle,
    imageSource: image?.file.url,
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
      ...PromoFragment
    }
    isReversed
  }
`;
