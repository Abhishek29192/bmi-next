import React from "react";
import Button from "@bmi-digital/components/button";
import Typography from "@bmi-digital/components/typography";
import PromoSection from "@bmi-digital/components/promo-section";
import { Data as PromoData } from "./Promo";
import { getClickableActionFromUrl } from "./Link";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";

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
    featuredMedia = null,
    featuredVideo = null
  } = promo || {};
  return (
    <PromoSection
      title={title}
      media={
        featuredVideo ? renderVideo(featuredVideo) : renderImage(featuredMedia)
      }
    >
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
