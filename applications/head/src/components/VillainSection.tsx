import React from "react";
import { graphql } from "gatsby";
import Section from "@bmi/section";
import Villain from "@bmi/villain";
import { VillainSectionData } from "../templates/types";

const VillainSection = ({ title, hero, isReversed }: VillainSectionData) => {
  const { image, title: villainTitle, subtitle } = hero;

  return (
    <Section>
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
