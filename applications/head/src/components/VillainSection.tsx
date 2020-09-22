import React from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Villain from "@bmi/villain";
import { Data as HeroData } from "./Hero";

export type Data = {
  __typename: string;
  backgroundColor: "pearl" | "white";
  title: string;
  hero: HeroData;
  isReversed: boolean;
};

const VillainSection = ({ title, hero, isReversed, backgroundColor }: Data) => {
  const { image, title: villainTitle, subtitle } = hero;

  return (
    <Section backgroundColor={backgroundColor}>
      <Section.Title>{title}</Section.Title>
      <Villain
        title={villainTitle}
        imageSource={image && image.file.url}
        isReversed
      >
        {subtitle && subtitle.subtitle}
      </Villain>
    </Section>
  );
};

export default VillainSection;

export const query = graphql`
  fragment VillainSectionFragment on ContentfulVillainSection {
    title
    hero {
      title
      subtitle {
        subtitle
      }
      image {
        file {
          url
        }
      }
    }
    isReversed
  }
`;
