import React, { useContext } from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Villain, { Props as VillainProps } from "@bmi/villain";
import { renderVideo } from "./Video";
import { Data as PromoData } from "./Promo";
import { SiteContext } from "./Site";
import { getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import RichText from "./RichText";
import { renderImage } from "./Image";

export type Data = {
  __typename: "ContentfulSyndicateSection";
  title: string | null;
  villains: (PromoData | PageInfoData)[];
  isReversed: boolean;
};

const SyndicateSection = ({
  data: { title, villains, isReversed },
  position
}: {
  data: Data;
  position: number;
}) => {
  const { countryCode, getMicroCopy } = useContext(SiteContext);

  const villainsData = villains.map(
    ({ featuredMedia, title, subtitle, ...typePromoData }, index) => {
      return {
        title,
        children: (typePromoData as PromoData).body ? (
          <RichText document={(typePromoData as PromoData).body} />
        ) : (
          subtitle
        ),
        media: typePromoData.featuredVideo
          ? renderVideo(typePromoData.featuredVideo)
          : renderImage(featuredMedia, { size: "cover" }),
        cta: getCTA(typePromoData, countryCode, getMicroCopy("page.linkLabel"))
      };
    }
  );

  if (villainsData.length === 1) {
    const villainProperties = villainsData[0];

    if (position === 0) {
      return (
        <Section backgroundColor="white">
          {title && <Section.Title>{title}</Section.Title>}
          <Villain {...villainProperties} isReversed={isReversed} />
        </Section>
      );
    }

    return <Villain {...villainProperties} isFullWidth={true} />;
  }

  return (
    <Section backgroundColor="white">
      {title && <Section.Title>{title}</Section.Title>}
      {villainsData.map((villainProperties: VillainProps, index) => (
        <Villain
          key={`${title}${index}`}
          {...villainProperties}
          isReversed={(index + Number(!isReversed)) % 2 === 0}
          isFullWidth={villains.length === 1}
        />
      ))}
    </Section>
  );
};

export default SyndicateSection;

export const query = graphql`
  fragment SyndicateSectionFragment on ContentfulSyndicateSection {
    title
    villains {
      ... on ContentfulPromoOrPage {
        ...PromoFragment
        ...PageInfoFragment
      }
    }
    isReversed
  }
`;
