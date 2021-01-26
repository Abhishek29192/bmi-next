import React, { useContext } from "react";
import { graphql } from "gatsby";
import PromoSection from "@bmi/promo-section";
import Button from "@bmi/button";
import { Data as PromoData } from "./Promo";
import { getClickableActionFromUrl } from "./Link";
import { SiteContext } from "./Site";
import styles from "./styles/PromoSection.module.scss";

export type Data = PromoData;

const IntegratedPromoSection = ({ data }: { data: Data }) => {
  const { countryCode } = useContext(SiteContext);
  const { title, subtitle, featuredImage, cta } = data;

  return (
    <PromoSection
      title={title}
      imageSource={featuredImage?.resize.src}
      className={styles["PromoSection"]}
    >
      {subtitle}
      {cta && (
        <div className={styles["link"]}>
          <Button
            action={getClickableActionFromUrl(
              cta.linkedPage,
              cta.url,
              countryCode,
              cta?.asset?.file?.url
            )}
          >
            {cta.label}
          </Button>
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
