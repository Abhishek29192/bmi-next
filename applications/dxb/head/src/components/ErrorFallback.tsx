import { Button, PromoSection, Typography } from "@bmi-digital/components";
import React from "react";
import Image from "./Image";
import { getClickableActionFromUrl } from "./Link";
import { Data as PromoData } from "./Promo";
import Video from "./Video";

const ErrorFallback = ({
  countryCode,
  promo
}: {
  countryCode: string;
  promo?: PromoData | null;
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
        featuredVideo ? (
          <Video {...featuredVideo} />
        ) : featuredMedia ? (
          <Image {...featuredMedia} />
        ) : undefined
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
            undefined,
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
