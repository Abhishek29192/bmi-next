import Button from "@bmi-digital/components/button";
import PromoSection from "@bmi-digital/components/promo-section";
import Typography from "@bmi-digital/components/typography";
import { Link } from "gatsby";
import React from "react";
import { getPathWithCountryCode } from "../utils/path";
import { Data as PromoData } from "./Promo";
import createImageProps from "./image/createImageProps";
import createVideoProps from "./video/createVideoProps";

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
      linkedPage: undefined
    },
    featuredMedia = null,
    featuredVideo = null
  } = promo ?? {};
  const to: string | undefined =
    cta && getPathWithCountryCode(countryCode, cta.linkedPage?.path);
  return (
    <PromoSection
      title={title}
      media={
        featuredVideo
          ? createVideoProps(featuredVideo)
          : featuredMedia
            ? createImageProps(featuredMedia)
            : undefined
      }
    >
      <Typography variant="body2" gutterBottom>
        {subtitle}
      </Typography>
      {cta && (
        <Button
          component={Link}
          to={to}
          gtm={{ id: "cta-click1", action: to, label: cta.label }}
        >
          {cta.label}
        </Button>
      )}
    </PromoSection>
  );
};

export default ErrorFallback;
