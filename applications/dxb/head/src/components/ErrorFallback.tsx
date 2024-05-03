import Button from "@bmi-digital/components/button";
import PromoSection from "@bmi-digital/components/promo-section";
import Typography from "@bmi-digital/components/typography";
import { Link } from "gatsby";
import { getPathWithCountryCode } from "../utils/path";
import createImageProps from "./image/createImageProps";
import createVideoProps from "./video/createVideoProps";
import type { Data as PromoData } from "./Promo";
import type { ImageWidths } from "./image/types";

const mediaWidths: ImageWidths = [561, 436, 516, 916, 920];

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
          ? createVideoProps({
              ...featuredVideo,
              previewMediaWidths: mediaWidths
            })
          : featuredMedia
            ? createImageProps({ ...featuredMedia, widths: mediaWidths })
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
