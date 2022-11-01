import {
  Button,
  Section,
  transformHyphens,
  Villain,
  VillainProps
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React from "react";
import { microCopy } from "../constants/microCopies";
import { useConfig } from "../contexts/ConfigProvider";
import { renderImage } from "./Image";
import Link, { getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import { Data as PromoData } from "./Promo";
import RichText from "./RichText";
import { useSiteContext } from "./Site";
import { renderVideo } from "./Video";

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
  const {
    config: { isSpaEnabled }
  } = useConfig();
  const villainsData = villains?.map((data) => {
    const callToAction = React.useMemo(() => {
      const cta = getCTA(
        data,
        countryCode,
        getMicroCopy(microCopy.PAGE_LINK_LABEL)
      );

      if (data.__typename == "ContentfulPromo" && data.cta) {
        return (
          <Link
            component={Button}
            variant={isSpaEnabled ? "contained" : "opaqueOutlined"}
            data={data.cta}
          >
            {data.cta.label}
          </Link>
        );
      }

      if (cta && cta.action) {
        return (
          <Button action={cta.action} variant="opaqueOutlined">
            {getMicroCopy(microCopy.PAGE_LINK_LABEL)}
          </Button>
        );
      }

      return null;
    }, [data]);

    return {
      title: transformHyphens(data.title),
      children: (data as PromoData).body ? (
        <RichText document={(data as PromoData).body} />
      ) : (
        transformHyphens(data.subtitle)
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

    return (
      <Villain
        {...villainProperties}
        isFullWidth={true}
        isReversed={isReversed}
      />
    );
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
