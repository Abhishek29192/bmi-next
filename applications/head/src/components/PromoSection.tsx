import Button, { ButtonProps } from "@bmi/button";
import { ClickableAction } from "@bmi/clickable";
import PromoSection from "@bmi/promo-section";
import { graphql } from "gatsby";
import React, { useContext } from "react";
import withGTM from "../utils/google-tag-manager";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";
import { getClickableActionFromUrl } from "./Link";
import { Data as PromoData } from "./Promo";
import RichText from "./RichText";
import { SiteContext } from "./Site";
import styles from "./styles/PromoSection.module.scss";
import { VisualiserContext } from "./Visualiser";

export type Data = PromoData;

const IntegratedPromoSection = ({ data }: { data: Data }) => {
  const { countryCode } = useContext(SiteContext);
  const { open } = useContext(VisualiserContext);
  const { title, subtitle, body, featuredMedia, cta, featuredVideo } = data;

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
    >
      {body ? <RichText document={body} /> : subtitle}
      {cta && (
        <div className={styles["link"]}>
          <GTMButton
            gtm={{ id: "cta-click1 ", label: cta.label, action: cta.url }}
            action={getClickableActionFromUrl(
              cta.linkedPage,
              cta.url,
              countryCode,
              cta?.asset?.file?.url,
              cta.label,
              cta?.type,
              () => {
                open(cta?.parameters);
              }
            )}
          >
            {cta.label}
          </GTMButton>
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
