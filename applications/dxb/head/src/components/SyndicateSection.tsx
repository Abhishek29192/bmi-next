import Section from "@bmi-digital/components/section";
import Typography from "@bmi-digital/components/typography";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import Villain, { VillainProps } from "@bmi-digital/components/villain";
import { microCopy, MicroCopyValues } from "@bmi/microcopies";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import RichText from "./RichText";
import { useSiteContext } from "./Site";
import {
  DescriptionGrid,
  DescriptionTypoMultiLine
} from "./styles/SyndicateSection.styles";

import ButtonLink from "./link/ButtonLink";
import createImageProps from "./image/createImageProps";
import createVideoProps from "./video/createVideoProps";
import type { Data as PageInfoData } from "./PageInfo";
import type { Data as PromoData } from "./Promo";

export type Data = {
  __typename: "ContentfulSyndicateSection";
  title: string | null;
  description: {
    description: string | null;
  };
  villains: (PromoData | PageInfoData)[] | null;
  isReversed: boolean;
};

export interface Props {
  data: Data;
  position: number;
}

const SyndicateSection = ({
  data: { description, title, villains, isReversed },
  position
}: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { countryCode, getMicroCopy } = useSiteContext();

  const getCallToAction = (
    data: PromoData | PageInfoData,
    countryCode: string,
    getMicroCopy: (
      path: MicroCopyValues,
      variables?: Record<string, string>
    ) => string
  ) => {
    if (data.cta) {
      const label =
        data.__typename == "ContentfulPromo"
          ? getMicroCopy(microCopy.PAGE_LINK_LABEL)
          : data.cta.label;
      return (
        <ButtonLink data={{ ...data.cta, label }} variant="opaqueOutlined">
          {label}
        </ButtonLink>
      );
    }

    return null;
  };

  const villainsData = useMemo(
    () =>
      villains?.map((data) => {
        return {
          title: transformHyphens(data.title),
          children: (data as PromoData).body ? (
            <RichText document={(data as PromoData).body} hasNoBottomMargin />
          ) : (
            transformHyphens(data.subtitle)
          ),
          media: data.featuredVideo
            ? createVideoProps(data.featuredVideo)
            : data.featuredMedia
              ? createImageProps({
                  ...data.featuredMedia,
                  size: "cover",
                  isMobile
                })
              : undefined,
          cta: getCallToAction(data, countryCode, getMicroCopy)
        };
      }),
    [countryCode, getMicroCopy, isMobile, villains]
  );

  if (villainsData?.length === 1) {
    const { children, ...villainProperties } = villainsData[0];

    if (position === 0) {
      return (
        <Section
          backgroundColor="white"
          data-testid={`syndicate-section-${replaceSpaces(title)}`}
        >
          {title && <Section.Title>{title}</Section.Title>}
          {description && (
            <DescriptionGrid container lg={8} xs={12}>
              <DescriptionTypoMultiLine>
                <Typography>{description.description}</Typography>
              </DescriptionTypoMultiLine>
            </DescriptionGrid>
          )}
          <Villain {...villainProperties} isReversed={isReversed}>
            {children}
          </Villain>
        </Section>
      );
    }

    return (
      <Villain
        {...villainProperties}
        isFullWidth={true}
        isReversed={isReversed}
      >
        {children}
      </Villain>
    );
  }

  return (
    <Section
      backgroundColor="white"
      data-testid={`syndicate-section-${replaceSpaces(title)}`}
    >
      {title && <Section.Title>{title}</Section.Title>}
      {description && (
        <DescriptionGrid container lg={8} xs={12}>
          <DescriptionTypoMultiLine>
            <Typography>{description.description}</Typography>
          </DescriptionTypoMultiLine>
        </DescriptionGrid>
      )}
      {villainsData?.map(
        ({ children, ...villainProperties }: VillainProps, index) => (
          <Villain
            key={`${title}${index}`}
            {...villainProperties}
            isReversed={(index + Number(!isReversed)) % 2 === 0}
            isFullWidth={villains.length === 1}
          >
            {children}
          </Villain>
        )
      )}
    </Section>
  );
};

export default SyndicateSection;

export const query = graphql`
  fragment SyndicateSectionFragment on ContentfulSyndicateSection {
    title
    description {
      description
    }
    villains {
      ... on ContentfulPromoOrPage {
        ...PromoVillainFragment
        ...PageInfoVillainFragment
      }
    }
    isReversed
  }
`;
