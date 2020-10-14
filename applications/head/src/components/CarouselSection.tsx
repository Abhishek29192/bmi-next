import React, { useContext } from "react";
import { graphql } from "gatsby";
import TwoPaneCarousel, {
  Slide as TwoPaneCarouselctaData
} from "@bmi/two-pane-carousel";
import VerticalRoller, {
  Slide as VerticalRollerctaData
} from "@bmi/vertical-roller";
import Section, { Props } from "@bmi/section";
import { Data as PromoData } from "../components/Promo";
import { PageInfoData as SimplePageInfoData } from "../templates/simple-page";
import { PageInfoData as ContactUsInfoData } from "../templates/contact-us-page";

import { LinkData, getPromoOrPageCta } from "./Link";
import { SiteContext } from "./Site";

type Slide = PromoData | SimplePageInfoData | ContactUsInfoData;

export type Data = {
  title?: string;
  variant: string;
  __typename: "ContentfulCarouselSection";
  slides: Slide[];
  link: LinkData | null;
};

const parseTwoPaneCarouselSlides = (
  slides: Slide[],
  countryCode: string,
  linkLabel: string
): TwoPaneCarouselctaData[] => {
  return slides.map((slide) => {
    const { title, subtitle, featuredImage, ...rest } = slide;
    const CTA = getPromoOrPageCta(rest, countryCode, linkLabel);

    return {
      title,
      // brandIcon: iconMap[brandLogo], // TODO: This will come when a brand page is added to the Enum.
      imageSource: featuredImage ? featuredImage.file.url : null,
      children: subtitle || undefined,
      CTA
    };
  });
};

const parseVerticalRollerSlides = (
  slides: Slide[],
  countryCode: string,
  linkLabel: string
): VerticalRollerctaData[] => {
  return slides.map((slide) => {
    const { title, subtitle, featuredImage, ...rest } = slide;
    const cta = getPromoOrPageCta(rest, countryCode, linkLabel);

    return {
      title,
      description: subtitle,
      imageSource: featuredImage ? featuredImage.file.url : null,
      children: subtitle || undefined,
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
          slides={parseVerticalRollerSlides(
            slides,
            countryCode,
            resources["page.linkLabel"]
          )}
        />
      ) : (
        <TwoPaneCarousel
          slides={parseTwoPaneCarouselSlides(
            slides,
            countryCode,
            resources["page.linkLabel"]
          )}
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
      __typename
      ...PromoFragment
      ...ContactUsPageInfoFragment
      ...SimplePageInfoFragment
    }
  }
`;
