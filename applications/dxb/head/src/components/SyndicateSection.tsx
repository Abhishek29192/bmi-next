import React from "react";
import { graphql } from "gatsby";
import Button from "@bmi/button";
import Section from "@bmi/section";
import Villain, { Props as VillainProps } from "@bmi/villain";
import { ColorPairContext } from "@bmi/color-pair";
import { renderVideo } from "./Video";
import { Data as PromoData } from "./Promo";
import { useSiteContext } from "./Site";
import Link, { getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import RichText from "./RichText";
import { renderImage } from "./Image";

export type Data = {
  __typename: "ContentfulSyndicateSection";
  title: string | null;
  villains: (PromoData | PageInfoData)[] | null;
  isReversed: boolean;
};

const SyndicateSection = ({
  data: { title, villains, isReversed },
  position
}: {
  data: Data;
  position: number;
}) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  const { type } = React.useContext(ColorPairContext);

  const villainsData = villains?.map((data) => {
    const callToAction = React.useMemo(() => {
      const cta = getCTA(data, countryCode, getMicroCopy("page.linkLabel"));

      if (data.__typename == "ContentfulPromo" && data.cta) {
        return (
          <Link component={Button} variant="opaqueOutlined" data={data.cta}>
            {data.cta.label}
          </Link>
        );
      }

      if (cta && cta.action) {
        return (
          <Button action={cta.action} variant="opaqueOutlined">
            {getMicroCopy("page.linkLabel")}
          </Button>
        );
      }

      return null;
    }, [data]);

    return {
      title: data.title,
      children: (data as PromoData).body ? (
        <RichText document={(data as PromoData).body} />
      ) : (
        data.subtitle
      ),
      media: data.featuredVideo
        ? renderVideo(data.featuredVideo)
        : renderImage(data.featuredMedia, { size: "cover" }),
      cta: callToAction
    };
  });

  if (villainsData?.length === 1) {
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
      {villainsData?.map((villainProperties: VillainProps, index) => (
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
