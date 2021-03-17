import Button, { ButtonProps } from "@bmi/button";
import { ClickableAction } from "@bmi/clickable";
import PromoSection from "@bmi/promo-section";
import { graphql } from "gatsby";
import React, { useContext } from "react";
import withGTM from "../utils/google-tag-manager";
import { getClickableActionFromUrl } from "./Link";
import { Data as PromoData } from "./Promo";
import RichText from "./RichText";
import { SiteContext } from "./Site";
import styles from "./styles/PromoSection.module.scss";

export type Data = PromoData;

const IntegratedPromoSection = ({ data }: { data: Data }) => {
  const { countryCode } = useContext(SiteContext);
  const { title, subtitle, body, featuredImage, cta } = data;

  const GTMButton = withGTM<
    ButtonProps & {
      action?: ClickableAction;
    }
  >(Button);

  return (
    <PromoSection
      title={title}
      imageSource={featuredImage?.resize.src}
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
              cta.label
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
