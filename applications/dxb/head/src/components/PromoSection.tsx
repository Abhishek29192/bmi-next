import PromoSection from "@bmi-digital/components/promo-section";
import React, { useContext } from "react";
import RichText from "./RichText";
import { SectionsContext } from "./Sections";
import ButtonLink from "./link/ButtonLink";
import { PromoSectionLink } from "./styles/PromoSectionStyles";
import createImageProps from "./image/createImageProps";
import createVideoProps from "./video/createVideoProps";
import type { Data as PromoData } from "./Promo";
import type { ImageWidths } from "./image/types";

export type Data = PromoData;

const backgroundColorMap = {
  White: "white" as const,
  Alabaster: "alabaster" as const
};

const mediaWidths: ImageWidths = [561, 436, 516, 916, 920];

const IntegratedPromoSection = ({ data }: { data: Data }) => {
  const {
    id,
    title,
    subtitle,
    body,
    featuredMedia,
    cta,
    featuredVideo,
    backgroundColor
  } = data;

  const { [id]: theme } = useContext(SectionsContext);

  return (
    <PromoSection
      title={title}
      media={
        featuredVideo
          ? createVideoProps({
              ...featuredVideo,
              previewMediaWidths: mediaWidths
            })
          : featuredMedia
            ? createImageProps({
                ...featuredMedia,
                position: "top left",
                widths: mediaWidths
              })
            : undefined
      }
      backgroundColor={
        theme
          ? backgroundColorMap[theme.backgroundColor ?? "White"]
          : // eslint-disable-next-line security/detect-object-injection
            backgroundColorMap[backgroundColor ?? "White"]
      }
      isReversed={theme ? theme.isReversed : undefined}
      data-testid="promo-section"
    >
      {body ? <RichText document={body} hasNoBottomMargin /> : subtitle}
      {cta && (
        <PromoSectionLink>
          <ButtonLink data={cta}>{cta.label}</ButtonLink>
        </PromoSectionLink>
      )}
    </PromoSection>
  );
};

export default IntegratedPromoSection;
