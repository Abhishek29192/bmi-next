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
import { graphql } from "gatsby";
import React from "react";
import withGTM from "../../utils/google-tag-manager";
import BrandLogo from "../BrandLogo";
import { Data as PageInfoData } from "../PageInfo";
import { Data as PromoData } from "../Promo";
import { useSiteContext } from "../Site";
import { getCTA } from "../link/utils";
import { SectionElement, LinkElement } from "../styles/CarouselSectionStyles";
import createImageProps from "../image/createImageProps";
import createVideoProps from "../video/createVideoProps";
import type { Data as LinkData } from "../link/types";

type Slide = PromoData | PageInfoData;

export type Data = {
  __typename: "ContentfulCarouselSection";
  title: string;
  variant: "horizontal" | "vertical";
  slides: Slide[];
  link: LinkData | null;
};

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
                "data-testid": `carousel-section-slide-video-${index}`
              })
            : featuredMedia
              ? createImageProps({
                  ...featuredMedia,
                  "data-testid": `carousel-section-slide-image-${index}`
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

export const query = graphql`
  fragment CarouselSectionFragment on ContentfulCarouselSection {
    __typename
    title
    variant
    slides {
      ... on ContentfulPromoOrPage {
        ...PromoSlideFragment
        ...PageInfoSlideFragment
      }
    }
    link {
      ...LinkFragment
    }
  }
`;
