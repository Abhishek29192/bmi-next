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
import React, { useContext } from "react";
import withGTM from "../../utils/google-tag-manager";
import BrandLogo from "../BrandLogo";
import Image from "../Image";
import { Data as LinkData, getCTA, getClickableActionFromUrl } from "../Link";
import { Data as PageInfoData } from "../PageInfo";
import { CalculatorContext } from "../PitchedRoofCalcualtor";
import { Data as PromoData } from "../Promo";
import { useSiteContext } from "../Site";
import Video from "../Video";
import { VisualiserContext } from "../Visualiser";
import { LinkElement, SectionElement } from "../styles/CarouselSectionStyles";

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
          media: featuredVideo ? (
            <Video
              {...featuredVideo}
              className="video-preview-image"
              data-testid={`carousel-section-slide-video-${index}`}
            />
          ) : featuredMedia ? (
            <Image
              {...featuredMedia}
              data-testid={`carousel-section-slide-image-${index}`}
            />
          ) : undefined,
          description: subtitle || undefined,
          cta
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
  const { open: openVisualiser } = useContext(VisualiserContext);
  const { open: openCalculator } = useContext(CalculatorContext);

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
          action={getClickableActionFromUrl(
            link?.linkedPage,
            link?.url,
            countryCode,
            undefined,
            link.label,
            link?.type,
            () => {
              if (link?.type === "Visualiser" && openVisualiser) {
                openVisualiser(link?.parameters);
              } else if (link?.type === "Calculator" && openCalculator) {
                openCalculator(link?.parameters);
              }
            }
          )}
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
