import Section from "@bmi-digital/components/section";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import Villain from "@bmi-digital/components/villain";
import { microCopy, MicroCopyValues } from "@bmi/microcopies";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import React, { useMemo } from "react";
import Button from "@bmi-digital/components/button";
import RichText from "./RichText";
import { useSiteContext } from "./Site";
import {
  DescriptionGrid,
  DescriptionTypoMultiLine
} from "./styles/SyndicateSection.styles";
import { getCTA } from "./link/utils";
import createImageProps from "./image/createImageProps";
import createVideoProps from "./video/createVideoProps";
import type { VillainProps } from "@bmi-digital/components/villain";
import type { Data as PageInfoData } from "./PageInfo";
import type { Data as PromoData } from "./Promo";
import type { ImageWidths } from "./image/types";

export type Data = {
  __typename: "VillainSection";
  title: string | null;
  description: string | null;
  villains: (PromoData | PageInfoData)[] | null;
  isReversed: boolean;
};

export interface Props {
  data: Data;
  position: number;
}

const mediaWidths: ImageWidths = [561, 436, 516, 916, 920];

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
    const cta = getCTA(
      data,
      countryCode,
      getMicroCopy(microCopy.PAGE_LINK_LABEL)
    );

    const label =
      data.__typename == "Promo" && data.cta
        ? data.cta.label
        : getMicroCopy(microCopy.PAGE_LINK_LABEL);

    if (cta) {
      return (
        <Button {...cta} variant="opaqueOutlined">
          {label}
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
          media: data.featuredVideo
            ? createVideoProps({
                ...data.featuredVideo,
                previewMediaWidths: mediaWidths
              })
            : data.featuredMedia
              ? createImageProps({
                  ...data.featuredMedia,
                  size: "cover",
                  isMobile,
                  widths: mediaWidths
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
              <DescriptionTypoMultiLine
                data-testid={"syndicate-section-description"}
              >
                {description}
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
          <DescriptionTypoMultiLine
            data-testid={"syndicate-section-description"}
          >
            {description}
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
