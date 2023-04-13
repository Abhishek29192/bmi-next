import {
  Button,
  replaceSpaces,
  Section,
  transformHyphens,
  TwoPaneCarousel,
  TwoPaneCarouselSlide,
  VerticalRoller,
  VerticalRollerSlide
} from "@bmi-digital/components";
import { ArrowForward as ArrowForwardIcon } from "@bmi-digital/components/icon";
import ButtonBase, { ButtonBaseProps } from "@mui/material/ButtonBase";
import { graphql } from "gatsby";
import React, { useContext } from "react";
import { Data as PromoData } from "../Promo";
import { microCopy } from "../../constants/microCopies";
import withGTM from "../../utils/google-tag-manager";
import BrandLogo from "../BrandLogo";
import Image from "../Image";
import { Data as LinkData, getClickableActionFromUrl, getCTA } from "../Link";
import { Data as PageInfoData } from "../PageInfo";
import { CalculatorContext } from "../PitchedRoofCalcualtor";
import { useSiteContext } from "../Site";
import styles from "../styles/CarouselSection.module.scss";
import Video from "../Video";
import { VisualiserContext } from "../Visualiser";

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
    .map((slide, index) => {
      const {
        title,
        subtitle,
        brandLogo,
        featuredVideo,
        featuredMedia,
        ...rest
      } = slide;
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
            className={styles["video-preview-image"]}
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
    });
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
    <Section
      backgroundColor={variant === "vertical" ? "pearl" : "white"}
      className={styles["CarouselSection"]}
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
        <Button
          action={getClickableActionFromUrl(
            link?.linkedPage,
            link?.url,
            countryCode,
            null,
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
          className={styles["link"]}
          endIcon={
            <ArrowForwardIcon
              data-testid={"carousel-section-arrow-forward-icon"}
            />
          }
          data-testid={"carousel-section-link"}
        >
          {transformHyphens(link.label)}
        </Button>
      )}
    </Section>
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
