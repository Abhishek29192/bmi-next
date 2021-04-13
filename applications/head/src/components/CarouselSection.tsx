import React, { useContext } from "react";
import { graphql } from "gatsby";
import { ButtonBase, ButtonBaseProps } from "@material-ui/core";
import TwoPaneCarousel, {
  Slide as TwoPaneCarouselSlide
} from "@bmi/two-pane-carousel";
import VerticalRoller, {
  Slide as VerticalRollerSlide
} from "@bmi/vertical-roller";
import Section from "@bmi/section";
import Button from "@bmi/button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { Data as PromoData } from "../components/Promo";
import withGTM from "../utils/google-tag-manager";
import { Data as PageInfoData } from "./PageInfo";
import { iconMap } from "./Icon";
import { LinkData, getCTA, getClickableActionFromUrl } from "./Link";
import { SiteContext } from "./Site";
import { VisualiserContext } from "./Visualiser";
import { renderVideo } from "./Video";
import { renderImage } from "./Image";
import styles from "./styles/CarouselSection.module.scss";

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
  const { countryCode, getMicroCopy } = useContext(SiteContext);
  const { open } = useContext(VisualiserContext);

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
            getMicroCopy("page.linkLabel")
          )}
          rollerSectionComponent={(props: ButtonBaseProps) => (
            <GTMButton
              gtm={{
                id: "cta-click1",
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
            getMicroCopy("page.linkLabel")
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
              open(link?.parameters);
            }
          )}
          className={styles["link"]}
          endIcon={<ArrowForwardIcon />}
        >
          {link.label}
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
        ...PromoFragment
        ...PageInfoFragment
      }
    }
    link {
      ...LinkFragment
    }
  }
`;
