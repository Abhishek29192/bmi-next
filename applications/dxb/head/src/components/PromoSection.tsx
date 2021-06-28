import Button, { ButtonProps } from "@bmi/button";
import { ClickableAction } from "@bmi/clickable";
import PromoSection from "@bmi/promo-section";
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../utils/google-tag-manager";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";
import Link from "./Link";
import { Data as PromoData } from "./Promo";
import RichText from "./RichText";
import styles from "./styles/PromoSection.module.scss";

export type Data = PromoData;

const backgroundColorMap = {
  White: "white" as "white",
  Alabaster: "alabaster" as "alabaster"
};

const IntegratedPromoSection = ({ data }: { data: Data }) => {
  const {
    title,
    subtitle,
    body,
    featuredMedia,
    cta,
    featuredVideo,
    backgroundColor
  } = data;

  const GTMButton =
    withGTM<
      ButtonProps & {
        action?: ClickableAction;
      }
    >(Button);

  return (
    <PromoSection
      title={title}
      media={
        featuredVideo
          ? renderVideo(featuredVideo)
          : renderImage(featuredMedia, { position: "top left" })
      }
      className={styles["PromoSection"]}
      backgroundColor={
        backgroundColor ? backgroundColorMap[backgroundColor] : null
      }
    >
      {body ? <RichText document={body} /> : subtitle}
      {cta && (
        <div className={styles["link"]}>
          <Link
            component={GTMButton}
            data={cta}
            gtm={{ id: "cta-click1 ", label: cta.label, action: cta.url }}
          >
            {cta.label}
          </Link>
        </div>
      )}
    </PromoSection>
  );
};

export default IntegratedPromoSection;

export const query = graphql`
  fragment PromoSectionFragment on ContentfulSection {
    ...PromoFragment
  }
`;
