import { TableOfContent } from "@bmi-digital/components";
import { graphql } from "gatsby";
import React, { createContext, useMemo } from "react";
import { useConfig } from "../contexts/ConfigProvider";
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
import IframeSection, { Data as IframeSectionData } from "./IframeSection";
import LeadBlockSection, { Data as LeadBlockData } from "./LeadBlockSection";
import ImageGallerySection, {
  Data as ImageGallerySectionData
} from "./MediaGallerySection";
import PromoSection, { Data as PromoSectionData } from "./PromoSection";
import SampleBasketSection from "./SampleBasketSection";
import ServiceLocatorSection, {
  Data as ServiceLocatorSectionData
} from "./service-locator-section/index";
import SignupBlock, { Data as SignupBlockData } from "./SignupBlock";
import SyndicateSection, {
  Data as SyndicateSectionData
} from "./SyndicateSection";
import SystemConfiguratorSection, {
  Data as SystemConfiguratorSectionData
} from "./SystemConfiguratorSection";
import TabsOrAccordionSection, {
  Data as TabsOrAccordionSectionData
} from "./TabsOrAccordionSection";
import TeamSection, { Data as TeamSectionData } from "./TeamSection";
import TitleWithContentSection, {
  Data as TitleWithContentData
} from "./TitleWithContentSection";
import VideoSection, { Data as VideoSectionData } from "./VideoSection";

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
  | TeamSectionData
  | SignupBlockData
  | LeadBlockData;

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
  ContentfulMediaGallerySection: ImageGallerySection,
  ContentfulDocumentDownloadSection: DocumentDownloadSection,
  ContentfulServiceLocatorSection: ServiceLocatorSection,
  ContentfulVideoSection: VideoSection,
  ContentfulIframe: IframeSection,
  ContentfulSystemConfiguratorSection: SystemConfiguratorSection,
  ContentfulTeamSection: TeamSection,
  ContentfulSampleBasketSection: SampleBasketSection,
  ContentfulSignupBlock: SignupBlock,
  ContentfulLeadBlockSection: LeadBlockSection
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
  const {
    config: { isSpaEnabled }
  } = useConfig();
  const themeMap = useMemo(
    () =>
      data.reduce<Context>((carry, section, index) => {
        const previousSection = data[index - 1];
        if (section.__typename !== "ContentfulPromo") {
          return carry;
        }

        const { id, backgroundColor } = section;

        if (previousSection?.__typename !== "ContentfulPromo") {
          return {
            ...carry,
            [id]: {
              isReversed: isSpaEnabled ? false : true,
              backgroundColor: backgroundColor || "White"
            }
          };
        }

        const previousCarry = carry[previousSection.id];

        return {
          ...carry,
          [id]: {
            // eslint-disable-next-line security/detect-object-injection
            isReversed: previousCarry ? !previousCarry.isReversed : true,
            backgroundColor:
              backgroundColor ||
              // eslint-disable-next-line security/detect-object-injection
              (previousCarry?.backgroundColor === "White"
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
            theme={
              // eslint-disable-next-line security/detect-object-injection
              (pageTypename && pageTypenameToThemeMap[pageTypename]) || {}
            }
            key={`section-${index}`}
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
    ...MediaGallerySectionFragment
    ...DocumentDownloadSectionFragment
    ...ServiceLocatorSectionFragment
    ...VideoSectionFragment
    ...IframeSectionFragment
    ...SystemConfiguratorSectionFragment
    ...TeamSectionFragment
    ...SampleBasketSectionFragment
    ...SignupBlockFragment
    ...LeadBlockSectionFragment
  }
  fragment DialogSectionsFragment on ContentfulSection {
    __typename
    ...FormSectionFragmentNonRecursive
  }
`;
