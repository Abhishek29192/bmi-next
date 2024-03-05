import Button from "@bmi-digital/components/button";
import PromoSection from "@bmi-digital/components/promo-section";
import Typography from "@bmi-digital/components/typography";
import React, { useMemo } from "react";
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
  } = promo ?? {};

  const memoizedGetClickableActionFromUrl = useMemo(
    () =>
      getClickableActionFromUrl({
        linkedPage: cta?.linkedPage,
        url: cta?.url,
        countryCode,
        label: cta?.label
      }),
    [cta, countryCode]
  );

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
        <Button action={memoizedGetClickableActionFromUrl}>{cta.label}</Button>
      )}
    </PromoSection>
  );
};

export default ErrorFallback;
