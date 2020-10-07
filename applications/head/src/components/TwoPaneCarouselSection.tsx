import React, { useContext } from "react";
import { graphql } from "gatsby";
import TwoPaneCarousel, { Slide } from "@bmi/two-pane-carousel";
import Section, { Props } from "@bmi/section";
// import { iconMap } from "./Icon";
import { Data as PromoData } from "../components/Promo";
import { PageInfoData as SimplePageInfoData } from "../templates/simple-page";
import { PageInfoData as ContactUsInfoData } from "../templates/contact-us-page";

import { LinkData, getClickableActionFromUrl } from "./Link";
import { SiteContext } from "./Site";

export type Data = {
  __typename: "ContentfulTwoPaneCarouselSection";
  slides: (PromoData | SimplePageInfoData | ContactUsInfoData)[];
  link: LinkData | null;
};

const transformSlide = (
  { title, subtitle, featuredImage, ...rest }: Data["slides"][0],
  countryCode: string,
  linkLabel: string
): Slide => {
  let CTA;

  if (rest.__typename === "ContentfulPromo") {
    const { label, linkedPage, url } = rest.cta;

    CTA = rest.cta && {
      action: getClickableActionFromUrl(linkedPage, url, countryCode),
      label: label
    };
  } else {
    const { slug } = rest;

    CTA = slug && {
      action: getClickableActionFromUrl({ slug: slug }, null, countryCode),
      // TODO: Use microcopy here
      label: linkLabel
    };
  }

  return {
    title,
    // brandIcon: iconMap[brandLogo], // TODO: This will come when a brand page is added to the Enum.
    imageSource: featuredImage.file.url,
    children: subtitle || undefined,
    CTA
  };
};

const TwoPaneCarouselSection = ({
  data: { slides },
  backgroundColor
}: {
  data: Data;
  backgroundColor: Props["backgroundColor"];
}) => {
  const { countryCode, resources } = useContext(SiteContext);
  return (
    <Section backgroundColor={backgroundColor}>
      <TwoPaneCarousel
        slides={slides.map((slide) =>
          transformSlide(slide, countryCode, resources["page.linkLabel"])
        )}
      />
    </Section>
  );
};

export default TwoPaneCarouselSection;

export const query = graphql`
  fragment TwoPaneCarouselSectionFragment on ContentfulTwoPaneCarouselSection {
    __typename
    slides {
      __typename
      ...SimplePageInfoFragment
      ...ContactUsPageInfoFragment
      ...PromoFragment
    }
    # link {
    #   linkedPage {
    #     slug
    #   }
    #   url
    # }
  }
`;
