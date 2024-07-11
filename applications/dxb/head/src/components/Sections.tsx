import TableOfContent from "@bmi-digital/components/table-of-content";
import { replaceSpaces } from "@bmi-digital/components/utils";
import React, { createContext, useMemo } from "react";
import CardCollectionSection, {
  Data as CardCollectionSectionData
} from "./CardCollectionSection";
import DocumentDownloadSection, {
  Data as DocumentDownloadSectionData
} from "./DocumentDownloadSection";
import EmbeddedScriptSection, {
  Data as EmbeddedScriptSectionData
} from "./EmbeddedScriptSection";
import ExploreBarSection, {
  Data as ExploreBarSectionData
} from "./ExploreBarSection";
import FormSection, { Data as FormSectionData } from "./FormSection";
import IframeSection, { Data as IframeSectionData } from "./IframeSection";
import LeadBlockSection, { Data as LeadBlockData } from "./LeadBlockSection";
import MediaGallerySection, {
  Data as ImageGallerySectionData
} from "./MediaGallerySection";
import PromoSection, { Data as PromoSectionData } from "./PromoSection";
import SampleBasketSection from "./SampleBasketSection";
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
import CarouselSection, {
  Data as CarouselSectionData
} from "./carousel-section/CarouselSection";
import ServiceLocatorSection, {
  Data as ServiceLocatorSectionData
} from "./service-locator-section/index";

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
  | LeadBlockData
  | EmbeddedScriptSectionData;

export type Data = SectionData[];

export type SectionsProps = {
  data: Data;
  startIndex?: number;
  pageTypename?: string;
};

export const sectionsMap = {
  Form: FormSection,
  ContentfulTabsOrAccordionSection: TabsOrAccordionSection,
  VillainSection: SyndicateSection,
  CarouselSection: CarouselSection,
  CardCollectionSection: CardCollectionSection,
  Navigation: ExploreBarSection,
  TitleWithContent: TitleWithContentSection,
  Promo: PromoSection,
  ContentfulMediaGallerySection: MediaGallerySection,
  ContentfulDocumentDownloadSection: DocumentDownloadSection,
  ServiceLocatorSection: ServiceLocatorSection,
  VideoSection: VideoSection,
  Iframe: IframeSection,
  ContentfulSystemConfiguratorSection: SystemConfiguratorSection,
  ContentfulTeamSection: TeamSection,
  SampleBasketSection: SampleBasketSection,
  SignupBlock: SignupBlock,
  LeadBlockSection: LeadBlockSection,
  EmbeddedScriptSection: EmbeddedScriptSection
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

type Theme = Partial<Record<ThemeOptions, unknown>>;

const pageTypenameToThemeMap: Record<string, Theme> = {
  HomePage: {
    cardCollectionRowType: "single-row"
  }
};

const createThemeMap = (data: SectionsProps["data"]): Context => {
  return data.reduce<Context>((carry, section, index) => {
    const previousSection = data[index - 1];
    if (section.__typename !== "Promo") {
      return carry;
    }

    const { id, backgroundColor } = section;

    if (previousSection?.__typename !== "Promo") {
      return {
        ...carry,
        [id]: {
          isReversed: true,
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
          (previousCarry?.backgroundColor === "White" ? "Alabaster" : "White")
      }
    };
  }, {});
};

const Sections = (props: SectionsProps) => {
  const { data, startIndex, pageTypename } = props;
  const themeMap = useMemo(() => createThemeMap(data), [data]);

  return (
    <SectionsContext.Provider value={themeMap}>
      {data.map((section, index) => {
        const Component: React.ElementType = sectionsMap[section.__typename];
        const title =
          // TODO: Nav could do with a refactor to align title/label/name fields.
          section.__typename === "Navigation" ? section.label : section.title;

        const sectionId = `section-${index}`;
        const sectionComponent = (
          <Component
            id={sectionId}
            data={section}
            position={startIndex ?? 0 + index}
            theme={
              // eslint-disable-next-line security/detect-object-injection
              (pageTypename && pageTypenameToThemeMap[pageTypename]) || {}
            }
            key={sectionId}
            data-testid={`section-${title ? replaceSpaces(title) : index}`}
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

// export const query = graphql`
//   fragment SectionsFragment on ContentfulSection {
//     __typename
//     ...ExploreBarSectionFragment
//     ...FormSectionFragment
//     ...TabsOrAccordionSectionFragment
//     ...SyndicateSectionFragment
//     ...CarouselSectionFragment
//     ...CardCollectionSectionFragment
//     ...TitleWithContentSectionFragment
//     ...PromoSectionFragment
//     ...MediaGallerySectionFragment
//     ...DocumentDownloadSectionFragment
//     ...ServiceLocatorSectionFragment
//     ...VideoSectionFragment
//     ...IframeSectionFragment
//     ...SystemConfiguratorSectionFragment
//     ...TeamSectionFragment
//     ...SampleBasketSectionFragment
//     ...SignupBlockFragment
//     ...LeadBlockSectionFragment
//     ...EmbeddedScriptSectionFragment
//   }
//   fragment DialogSectionsFragment on ContentfulSection {
//     __typename
//     ...FormSectionFragmentNonRecursive
//   }
// `;
