import React from "react";
import { graphql } from "gatsby";
import FormSection, {
  Data as FormSectionData
} from "../components/FormSection";
import TabsOrAccordionSection, {
  Data as TabsOrAccordionSectionData
} from "../components/TabsOrAccordionSection";
import VillainSection, {
  Data as VillainSectionData
} from "../components/VillainSection";
import CarouselSection, {
  Data as CarouselSectionData
} from "../components/CarouselSection";
import LeadBlockSection, {
  Data as LeadBlockSectionData
} from "../components/LeadBlockSection";
import CardCollectionSection, {
  Data as CardCollectionSectionData
} from "../components/CardCollectionSection";
import TitleWithContentSection, {
  Data as TitleWithContentData
} from "../components/TitleWithContentSection";

export type Data = (
  | FormSectionData
  | TabsOrAccordionSectionData
  | VillainSectionData
  | CarouselSectionData
  | LeadBlockSectionData
  | CardCollectionSectionData
  | TitleWithContentData
)[];

const sectionsMap = {
  ContentfulFormSection: FormSection,
  ContentfulTabsOrAccordionSection: TabsOrAccordionSection,
  ContentfulVillainSection: VillainSection,
  ContentfulCarouselSection: CarouselSection,
  ContentfulLeadBlockSection: LeadBlockSection,
  ContentfulCardCollectionSection: CardCollectionSection,
  ContentfulTitleWithContent: TitleWithContentSection
};

const Sections = ({ data }: { data: Data }) => {
  return (
    <>
      {data.map((section, index) => {
        const Component = sectionsMap[section.__typename];
        return (
          Component && (
            <Component
              key={`section${index}`}
              // @ts-ignore
              data={section}
              // TODO: Robust theme-based solution required.
              backgroundColor={index % 2 === 1 ? "pearl" : "white"}
            />
          )
        );
      })}
    </>
  );
};

export default Sections;

export const query = graphql`
  fragment SectionsFragment on ContentfulSection {
    __typename
    ...FormSectionFragment
    ...TabsOrAccordionSectionFragment
    ...VillainSectionFragment
    ...CarouselSectionFragment
    ...LeadBlockSectionFragment
    ...CardCollectionSectionFragment
    ...TitleWithContentSectionFragment
  }
`;
