import {
  Button,
  replaceSpaces,
  Section,
  transformHyphens,
  Typography,
  Villain,
  VillainProps
} from "@bmi-digital/components";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { graphql } from "gatsby";
import React, { useMemo } from "react";
import { microCopy, MicroCopyValues } from "@bmi/microcopies";
import { useConfig } from "../contexts/ConfigProvider";
import { DescriptionGrid } from "./styles/SyndicateSection.styles";
import Image from "./Image";
import Link, { getCTA } from "./Link";
import RichText from "./RichText";
import { useSiteContext } from "./Site";
import Video from "./Video";

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
  const { isSpaEnabled } = useConfig();

  const getCallToAction = (
    data: PromoData | PageInfoData,
    countryCode: string,
    getMicroCopy: (
      path: MicroCopyValues,
      variables?: Record<string, string>
    ) => string,
    isSpaEnabled: boolean
  ) => {
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
          media: data.featuredVideo ? (
            <Video {...data.featuredVideo} />
          ) : data.featuredMedia ? (
            <Image {...data.featuredMedia} size="cover" isMobile={isMobile} />
          ) : undefined,
          cta: getCallToAction(data, countryCode, getMicroCopy, isSpaEnabled)
        };
      }),
    [countryCode, getMicroCopy, isMobile, isSpaEnabled, villains]
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
              <Typography>{description.description}</Typography>
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
          <Typography>{description.description}</Typography>
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
