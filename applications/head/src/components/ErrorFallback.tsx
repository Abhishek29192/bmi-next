import React from "react";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import PromoSection from "@bmi/promo-section";
import { Data as PromoData } from "./Promo";
import { getClickableActionFromUrl } from "./Link";

const ErrorFallback = ({
  countryCode,
  promo
}: {
  countryCode: string;
  promo: PromoData;
}) => {
  const {
    title = "Error:General.title",
    subtitle = "Error:General.subtitle",
    cta = {
      label: "Error:General.cta.label",
      linkedPage: undefined,
      url: undefined
    },
    featuredMedia = null
  } = promo || {};
  return (
    <PromoSection title={title} imageSource={featuredMedia?.image?.resize.src}>
      <Typography variant="body2" gutterBottom>
        {subtitle}
      </Typography>
      {cta && (
        <Button
          action={getClickableActionFromUrl(
            cta?.linkedPage,
            cta?.url,
            countryCode,
            null,
            cta.label
          )}
        >
          {cta.label}
        </Button>
      )}
    </PromoSection>
  );
};

export default ErrorFallback;
