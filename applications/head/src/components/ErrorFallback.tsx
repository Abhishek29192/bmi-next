import React from "react";
import Button from "@bmi/button";
import Typography from "@bmi/typography";
import { Data as PromoData } from "./Promo";
import PromoSection from "@bmi/promo-section";
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
    featuredImage = null
  } = promo || {};
  return (
    <PromoSection title={title} imageSource={featuredImage?.resize.src}>
      <Typography variant="body2" gutterBottom>
        {subtitle}
      </Typography>
      {cta && (
        <Button
          action={getClickableActionFromUrl(
            cta?.linkedPage,
            cta?.url,
            countryCode
          )}
        >
          {cta.label}
        </Button>
      )}
    </PromoSection>
  );
};

export default ErrorFallback;
