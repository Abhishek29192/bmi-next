import ArrowForwardIcon from "@bmi-digital/components/icon/ArrowForward";
import TwoPaneCarousel, {
  Slide as TwoPaneCarouselSlide
} from "@bmi-digital/components/two-pane-carousel";
import { replaceSpaces, transformHyphens } from "@bmi-digital/components/utils";
import VerticalRoller, {
  Slide as VerticalRollerSlide
} from "@bmi-digital/components/vertical-roller";
import { microCopy } from "@bmi/microcopies";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";
import React from "react";
import withGTM from "../../utils/google-tag-manager";
import BrandLogo from "../BrandLogo";
import { useSiteContext } from "../Site";
import { getCTA } from "../link/utils";
import { LinkElement, SectionElement } from "../styles/CarouselSectionStyles";
import createImageProps from "../image/createImageProps";
import createVideoProps from "../video/createVideoProps";
import type { Data as PromoData } from "../Promo";
import type { Data as PageInfoData } from "../PageInfo";
import type { Data as LinkData } from "../link/types";
import type { ImageWidths } from "../image/types";

type Slide = PromoData | PageInfoData;

export type Data = {
  __typename: "CarouselSection";
  title: string;
  variant: "horizontal" | "vertical";
  slides: Slide[];
  link: LinkData | null;
};

const mediaWidths: ImageWidths = [561, 665, 381, 681, 920];

const GTMButton = withGTM<ButtonBaseProps>(ButtonBase, { label: "children" });

const parseSlides = (
  slides: Slide[],
  countryCode: string,
  linkLabel: string,
  variant: string
): (TwoPaneCarouselSlide | VerticalRollerSlide)[] => {
  return slides
    .filter((slide) => slide.title)
    .map(
      (
        { title, subtitle, brandLogo, featuredVideo, featuredMedia, ...rest },
        index
      ) => {
        const cta = getCTA(rest, countryCode, linkLabel);
        const brandLogoIcons = brandLogo ? (
          <BrandLogo
            brandName={brandLogo}
            brandWhiteBox={variant === "vertical"}
            data-testid={`carousel-section-slide-brand-logo-${index}`}
          />
        ) : undefined;
        return {
          title,
          brandIcon: brandLogoIcons,
          media: featuredVideo
            ? createVideoProps({
                ...featuredVideo,
                className: "video-preview-image",
                "data-testid": `carousel-section-slide-video-${index}`,
                previewMediaWidths: mediaWidths
              })
            : featuredMedia
              ? createImageProps({
                  ...featuredMedia,
                  "data-testid": `carousel-section-slide-image-${index}`,
                  widths: mediaWidths
                })
              : undefined,
          description: subtitle || undefined,
          cta: cta ? { ...cta, children: title } : undefined
        };
      }
    );
};

const CarouselSection = ({
  data: { slides, title, variant, link }
}: {
  data: Data;
}) => {
  const { countryCode, getMicroCopy } = useSiteContext();
  return (
    <SectionElement
      backgroundColor={variant === "vertical" ? "pearl" : "white"}
      data-testid={`carousel-section-${replaceSpaces(title)}`}
    >
      {variant === "vertical" ? (
        <VerticalRoller
          title={title}
          slides={parseSlides(
            slides,
            countryCode,
            getMicroCopy(microCopy.PAGE_LINK_LABEL),
            variant
          )}
          rollerSectionComponent={(props: ButtonBaseProps) => (
            <GTMButton
              gtm={{
                id: "selector-card3",
                label: props.children[0],
                action: "Selector - Cards"
              }}
              {...props}
            />
          )}
        />
      ) : (
        <TwoPaneCarousel
          slides={parseSlides(
            slides,
            countryCode,
            getMicroCopy(microCopy.PAGE_LINK_LABEL),
            variant
          )}
        />
      )}
      {link && (
        <LinkElement
          data={link}
          endIcon={
            <ArrowForwardIcon
              data-testid={"carousel-section-arrow-forward-icon"}
            />
          }
          data-testid={"carousel-section-link"}
        >
          {transformHyphens(link.label)}
        </LinkElement>
      )}
    </SectionElement>
  );
};

export default CarouselSection;
