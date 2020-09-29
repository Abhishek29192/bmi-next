import React from "react";
import { graphql } from "gatsby";
import TwoPaneCarousel, { Slide } from "@bmi/two-pane-carousel";
import Section, { Props } from "@bmi/section";
import { iconMap } from "./Icon";
import { Data as HeroData } from "./Hero";
import { LinkData } from "./Link";

export type Data = {
  __typename: "ContentfulTwoPaneCarouselSection";
  slides: HeroData[];
  link: LinkData | null;
};

const transformSlide = ({
  title,
  brandLogo,
  subtitle,
  image,
  cta
}: HeroData): Slide => ({
  title,
  brandIcon: iconMap[brandLogo],
  imageSource: image.file.url,
  children: subtitle ? subtitle.subtitle : undefined,
  CTA: cta
    ? {
        label: cta.label
        // TODO: Manage action Hero link
      }
    : undefined
});

const TwoPaneCarouselSection = ({
  data: { slides },
  backgroundColor
}: {
  data: Data;
  backgroundColor: Props["backgroundColor"];
}) => {
  return (
    <Section backgroundColor={backgroundColor}>
      <TwoPaneCarousel slides={slides.map(transformSlide)} />
    </Section>
  );
};

export default TwoPaneCarouselSection;

export const query = graphql`
  fragment TwoPaneCarouselSectionFragment on ContentfulTwoPaneCarouselSection {
    __typename
    slides {
      ...HeroFragment
    }
    # link {
    #   linkedPage {
    #     slug
    #   }
    #   url
    # }
  }
`;
