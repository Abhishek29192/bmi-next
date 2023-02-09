import {
  Button,
  ButtonProps,
  ClickableAction,
  PromoSection
} from "@bmi-digital/components";
import { graphql } from "gatsby";
import React, { useContext } from "react";
import withGTM from "../utils/google-tag-manager";
import { renderImage } from "./Image";
import Link from "./Link";
import { Data as PromoData } from "./Promo";
import RichText from "./RichText";
import { SectionsContext } from "./Sections";
import styles from "./styles/PromoSection.module.scss";
import { renderVideo } from "./Video";

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
        featuredVideo
          ? renderVideo(featuredVideo)
          : renderImage(featuredMedia, { position: "top left" })
      }
      className={styles["PromoSection"]}
      backgroundColor={
        theme
          ? backgroundColorMap[theme.backgroundColor]
          : // eslint-disable-next-line security/detect-object-injection
            backgroundColorMap[backgroundColor]
      }
      isReversed={theme ? theme.isReversed : null}
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
