import React, { useContext } from "react";
import { graphql } from "gatsby";
import TwoPaneCarousel, {
  Slide as TwoPaneCarouselSlide
} from "@bmi/two-pane-carousel";
import VerticalRoller, {
  Slide as VerticalRollerSlide
} from "@bmi/vertical-roller";
import Section, { Props } from "@bmi/section";
import { Data as PromoData } from "../components/Promo";
import { PageInfoData as SimplePageInfoData } from "../templates/simple-page";
import { PageInfoData as ContactUsInfoData } from "../templates/contact-us-page";
import { PageInfoData as ProductListerPageInfoData } from "../templates/product-lister-page";
import { iconMap } from "./Icon";
import { LinkData, getCTA } from "./Link";
import { SiteContext } from "./Site";

type Slide =
  | PromoData
  | SimplePageInfoData
  | ContactUsInfoData
  | ProductListerPageInfoData;

export type Data = {
  __typename: "ContentfulCarouselSection";
  title?: string;
  variant: string;
  slides: Slide[];
  link: LinkData | null;
};

const parseSlides = (
  slides: Slide[],
  countryCode: string,
  linkLabel: string
): (TwoPaneCarouselSlide | VerticalRollerSlide)[] => {
  return slides.map((slide) => {
    const { title, subtitle, brandLogo, featuredImage, ...rest } = slide;
    const cta = getCTA(rest, countryCode, linkLabel);

    return {
      title,
      brandIcon: brandLogo && iconMap[brandLogo],
      imageSource: featuredImage ? featuredImage.file.url : null,
      description: subtitle || undefined,
      cta
    };
  });
};

const CarouselSection = ({
  data: { slides, title, variant },
  backgroundColor
}: {
  data: Data;
  backgroundColor: Props["backgroundColor"];
}) => {
  const { countryCode, resources } = useContext(SiteContext);

  return (
    <Section backgroundColor={backgroundColor}>
      {variant === "vertical" ? (
        <VerticalRoller
          title={title}
          slides={parseSlides(slides, countryCode, resources["page.linkLabel"])}
        />
      ) : (
        <TwoPaneCarousel
          slides={parseSlides(slides, countryCode, resources["page.linkLabel"])}
        />
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
        ...ContactUsPageInfoFragment
        ...SimplePageInfoFragment
        ...ProductListerPageInfoFragment
      }
    }
  }
`;
