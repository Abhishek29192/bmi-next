import React from "react";
import { graphql } from "gatsby";
import TabsOrAccordionSection, {
  Data as TabsOrAccordionSectionData
} from "../components/TabsOrAccordionSection";
import VillainSection, {
  Data as VillainSectionData
} from "../components/VillainSection";
import TwoPaneCarouselSection, {
  Data as TwoPaneCarouselSectionData
} from "../components/TwoPaneCarouselSection";

export type Data = (
  | TabsOrAccordionSectionData
  | VillainSectionData
  | TwoPaneCarouselSectionData
)[];

const sectionsMap = {
  ContentfulTabsOrAccordionSection: TabsOrAccordionSection,
  ContentfulVillainSection: VillainSection,
  ContentfulTwoPaneCarouselSection: TwoPaneCarouselSection
};

const Sections = ({ data }: { data: Data }) => {
  return (
    <>
      {data.map((section, index) => {
        const Component = sectionsMap[section.__typename];
        return (
          <Component
            key={`section${index}`}
            // @ts-ignore
            data={section}
            // TODO: Robust theme-based solution required.
            backgroundColor={index % 2 === 0 ? "pearl" : "white"}
          />
        );
      })}
    </>
  );
};

export default Sections;

export const query = graphql`
  # NOTE: This union type name is not ideal, but the best option so far.
  fragment SectionsFragment on ContentfulTabsOrAccordionSectionContentfulVillainSectionUnion {
    __typename
    ...TabsOrAccordionSectionFragment
    ...VillainSectionFragment
    # ...TwoPaneCarouselSectionFragment
  }
`;
