import Button, { ButtonProps } from "@bmi-digital/components/button";
import { ClickableAction } from "@bmi-digital/components/clickable";
import PromoSection from "@bmi-digital/components/promo-section";
import { graphql } from "gatsby";
import React, { useContext } from "react";
import withGTM from "../utils/google-tag-manager";
import Image from "./Image";
import Link from "./Link";
import { Data as PromoData } from "./Promo";
import RichText from "./RichText";
import { SectionsContext } from "./Sections";
import Video from "./Video";
import { PromoSectionLink } from "./styles/PromoSectionStyles";

export type Data = PromoData;

const backgroundColorMap = {
  White: "white" as const,
  Alabaster: "alabaster" as const
};

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

  const GTMButton = withGTM<
    ButtonProps & {
      action?: ClickableAction;
    }
  >(Button);

  const { [id]: theme } = useContext(SectionsContext);

  return (
    <PromoSection
      title={title}
      media={
        featuredVideo ? (
          <Video {...featuredVideo} />
        ) : featuredMedia ? (
          <Image {...featuredMedia} position="top left" />
        ) : undefined
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
          <Link
            component={GTMButton}
            data={cta}
            gtm={{ id: "cta-click1 ", label: cta.label, action: cta.url }}
          >
            {cta.label}
          </Link>
        </PromoSectionLink>
      )}
    </PromoSection>
  );
};

export default IntegratedPromoSection;

export const query = graphql`
  fragment PromoSectionFragment on ContentfulSection {
    ...PromoVillainFragment
  }
`;
