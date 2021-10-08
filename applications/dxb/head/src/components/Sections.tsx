import TableOfContent from "@bmi/table-of-content";
import { graphql } from "gatsby";
import React, { createContext, useMemo } from "react";
import CardCollectionSection, {
  Data as CardCollectionSectionData
} from "./CardCollectionSection";
import CarouselSection, {
  Data as CarouselSectionData
} from "./CarouselSection";
import DocumentDownloadSection, {
  Data as DocumentDownloadSectionData
} from "./DocumentDownloadSection";
import ExploreBarSection, {
  Data as ExploreBarSectionData
} from "./ExploreBarSection";
import FormSection, { Data as FormSectionData } from "./FormSection";
import ImageGallerySection, {
  Data as ImageGallerySectionData
} from "./ImageGallerySection";
import PromoSection, { Data as PromoSectionData } from "./PromoSection";
import ServiceLocatorSection, {
  Data as ServiceLocatorSectionData
} from "./ServiceLocatorSection";
import SyndicateSection, {
  Data as SyndicateSectionData
} from "./SyndicateSection";
import TabsOrAccordionSection, {
  Data as TabsOrAccordionSectionData
} from "./TabsOrAccordionSection";
import TitleWithContentSection, {
  Data as TitleWithContentData
} from "./TitleWithContentSection";
import TeamSection, { Data as TeamSectionData } from "./TeamSection";
import VideoSection, { Data as VideoSectionData } from "./VideoSection";
import IframeSection, { Data as IframeSectionData } from "./IframeSection";
import SystemConfiguratorSection, {
  Data as SystemConfiguratorSectionData
} from "./SystemConfiguratorSection";
import SampleBasetSection from "./SampleBasketSection";

export type SectionData =
  | ExploreBarSectionData
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
  | VideoSectionData
  | IframeSectionData
  | SystemConfiguratorSectionData
  | TeamSectionData;

export type Data = SectionData[];

export const sectionsMap = {
  ContentfulFormSection: FormSection,
  ContentfulTabsOrAccordionSection: TabsOrAccordionSection,
  ContentfulSyndicateSection: SyndicateSection,
  ContentfulCarouselSection: CarouselSection,
  ContentfulCardCollectionSection: CardCollectionSection,
  ContentfulNavigation: ExploreBarSection,
  ContentfulTitleWithContent: TitleWithContentSection,
  ContentfulPromo: PromoSection,
  ContentfulImageGallerySection: ImageGallerySection,
  ContentfulDocumentDownloadSection: DocumentDownloadSection,
  ContentfulServiceLocatorSection: ServiceLocatorSection,
  ContentfulVideoSection: VideoSection,
  ContentfulIframe: IframeSection,
  ContentfulSystemConfiguratorBlock: SystemConfiguratorSection,
  ContentfulTeamSection: TeamSection,
  ContentfulSampleBasketSection: SampleBasetSection
};

type DisplayProps = {
  backgroundColor: PromoSectionData["backgroundColor"];
  isReversed: boolean;
};

type Context = {
  [id: string]: DisplayProps;
};

export const SectionsContext = createContext<Context>({});

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
  const themeMap = useMemo(
    () =>
      data.reduce<Context>((carry, section, index) => {
        if (section.__typename !== "ContentfulPromo") {
          return carry;
        }

        const { id, backgroundColor } = section;

        return {
          ...carry,
          [id]: {
            // @ts-ignore Property 'id' does not exist on type 'SectionData'.
            isReversed: !carry[data[index - 1]?.id]?.isReversed,
            backgroundColor:
              backgroundColor ||
              // @ts-ignore Property 'id' does not exist on type 'SectionData'.
              (carry[data[index - 1]?.id]?.backgroundColor === "White"
                ? "Alabaster"
                : "White")
          }
        };
      }, {}),
    [data]
  );

  return (
    <SectionsContext.Provider value={themeMap}>
      {data.map((section, index) => {
        const Component: React.ElementType = sectionsMap[section.__typename];
        const title =
          // TODO: Nav could do with a refactor to align title/label/name fields.
          section.__typename === "ContentfulNavigation"
            ? section.label
            : section.title;

        if (!Component) {
          return;
        }
        const sectionComponent = (
          <Component
            data={section}
            position={startIndex + index}
            theme={pageTypenameToThemeMap[pageTypename] || {}}
          />
        );

        return title ? (
          <TableOfContent.Anchor title={title} key={`section-${index}`}>
            {sectionComponent}
          </TableOfContent.Anchor>
        ) : (
          sectionComponent
        );
      })}
    </SectionsContext.Provider>
  );
};

export default Sections;

export const query = graphql`
  fragment SectionsFragment on ContentfulSection {
    __typename
    ...ExploreBarSectionFragment
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
    ...VideoSectionFragment
    ...IframeSectionFragment
    ...SystemConfiguratorBlockFragment
    ...TeamSectionFragment
    ...SampleBasketSectionFragment
  }
  fragment DialogSectionsFragment on ContentfulSection {
    __typename
    ...FormSectionFragmentNonRecursive
  }
`;
