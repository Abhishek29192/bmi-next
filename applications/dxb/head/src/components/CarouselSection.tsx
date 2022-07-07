import {
  Button,
  Section,
  transformHyphens,
  TwoPaneCarousel,
  TwoPaneCarouselSlide,
  VerticalRoller,
  VerticalRollerSlide
} from "@bmi/components";
import ButtonBase, { ButtonBaseProps } from "@material-ui/core/ButtonBase";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { graphql } from "gatsby";
import React, { useContext } from "react";
import { Data as PromoData } from "../components/Promo";
import { microCopy } from "../constants/microCopies";
import withGTM from "../utils/google-tag-manager";
import { iconMap } from "./Icon";
import { renderImage } from "./Image";
import { Data as LinkData, getClickableActionFromUrl, getCTA } from "./Link";
import { Data as PageInfoData } from "./PageInfo";
import { CalculatorContext } from "./PitchedRoofCalcualtor";
import { useSiteContext } from "./Site";
import styles from "./styles/CarouselSection.module.scss";
import { renderVideo } from "./Video";
import { VisualiserContext } from "./Visualiser";

type Slide = PromoData | PageInfoData;

export type Data = {
  __typename: "ContentfulCarouselSection";
  title?: string;
  variant: string;
  slides: Slide[];
  link: LinkData | null;
};

const GTMButton = withGTM<ButtonBaseProps>(ButtonBase, { label: "children" });

const parseSlides = (
  slides: Slide[],
  countryCode: string,
  linkLabel: string
): (TwoPaneCarouselSlide | VerticalRollerSlide)[] => {
  return slides.map((slide) => {
    const {
      title,
      subtitle,
      brandLogo,
      featuredVideo,
      featuredMedia,
      ...rest
    } = slide;
    const cta = getCTA(rest, countryCode, linkLabel);

    return {
      title,
      // eslint-disable-next-line security/detect-object-injection
      brandIcon: brandLogo && iconMap[brandLogo],
      media: featuredVideo
        ? renderVideo(featuredVideo)
        : renderImage(featuredMedia),
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
    >
      {variant === "vertical" ? (
        <VerticalRoller
          title={title}
          slides={parseSlides(
            slides,
            countryCode,
            getMicroCopy(microCopy.PAGE_LINK_LABEL)
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
            getMicroCopy(microCopy.PAGE_LINK_LABEL)
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
          endIcon={<ArrowForwardIcon />}
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
