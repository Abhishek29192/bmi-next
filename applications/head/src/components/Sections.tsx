import React from "react";
import { graphql } from "gatsby";
import TableOfContent from "@bmi/table-of-content";
import FormSection, {
  Data as FormSectionData
} from "../components/FormSection";
import TabsOrAccordionSection, {
  Data as TabsOrAccordionSectionData
} from "../components/TabsOrAccordionSection";
import CarouselSection, {
  Data as CarouselSectionData
} from "../components/CarouselSection";
import CardCollectionSection, {
  Data as CardCollectionSectionData
} from "../components/CardCollectionSection";
import TitleWithContentSection, {
  Data as TitleWithContentData
} from "../components/TitleWithContentSection";
import PromoSection, {
  Data as PromoSectionData
} from "../components/PromoSection";
import ImageGallerySection, {
  Data as ImageGallerySectionData
} from "../components/ImageGallerySection";
import DocumentDownloadSection, {
  Data as DocumentDownloadSectionData
} from "../components/DocumentDownloadSection";
import ServiceLocatorSection, {
  Data as ServiceLocatorSectionData
} from "../components/ServiceLocatorSection";
import SyndicateSection, {
  Data as SyndicateSectionData
} from "./SyndicateSection";

export type Data = (
  | FormSectionData
  | TabsOrAccordionSectionData
  | SyndicateSectionData
  | CarouselSectionData
  | CardCollectionSectionData
  | TitleWithContentData
  | PromoSectionData
  | ImageGallerySectionData
  | DocumentDownloadSectionData
  | ServiceLocatorSectionData
)[];

const sectionsMap = {
  ContentfulFormSection: FormSection,
  ContentfulTabsOrAccordionSection: TabsOrAccordionSection,
  ContentfulSyndicateSection: SyndicateSection,
  ContentfulCarouselSection: CarouselSection,
  ContentfulCardCollectionSection: CardCollectionSection,
  ContentfulTitleWithContent: TitleWithContentSection,
  ContentfulPromo: PromoSection,
  ContentfulImageGallerySection: ImageGallerySection,
  ContentfulDocumentDownloadSection: DocumentDownloadSection,
  ContentfulServiceLocatorSection: ServiceLocatorSection
};

// TODO: This should be exported by the card collection.
type ThemeOptions = "cardCollectionRowType";

type Theme = Partial<Record<ThemeOptions, any>>;

const pageTypenameToThemeMap: Record<string, Theme> = {
  ContentfulHomePage: {
    cardCollectionRowType: "single-row"
  }
};

const Sections = ({
  data,
  startIndex = 0,
  pageTypename
}: {
  data: Data;
  startIndex?: number;
  pageTypename?: string;
}) => {
  return (
    <>
      {data.map((section, index) => {
        const Component = sectionsMap[section.__typename];
        const { title } = section;

        return (
          Component &&
          title && (
            <TableOfContent.Anchor title={title} key={`section-${index}`}>
              <Component
                // @ts-ignore
                data={section}
                position={startIndex + index}
                theme={pageTypenameToThemeMap[pageTypename] || {}}
              />
            </TableOfContent.Anchor>
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
    ...SyndicateSectionFragment
    ...CarouselSectionFragment
    ...CardCollectionSectionFragment
    ...TitleWithContentSectionFragment
    ...PromoSectionFragment
    ...ImageGallerySectionFragment
    ...DocumentDownloadSectionFragment
    ...ServiceLocatorSectionFragment
  }
`;
