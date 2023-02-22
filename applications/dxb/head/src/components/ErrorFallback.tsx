import { Button, PromoSection, Typography } from "@bmi-digital/components";
import React from "react";
import { renderImage } from "./Image";
import { getClickableActionFromUrl } from "./Link";
import { Data as PromoData } from "./Promo";
import { renderVideo } from "./Video";

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
