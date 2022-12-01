import { graphql } from "gatsby";
import { Data as LinkData } from "../components/Link";
import { Data as SDPSpecificationNotesData } from "./ContentfulSpecificationNotes";
import { Data as ExploreBarData } from "./ExploreBar";
import { Data as MicroCopyData } from "./MicroCopy";
import { Data as NextBestActionsData } from "./NextBestActions";
import { Data as PageInfoData } from "./PageInfo";
import { Data as PromoData } from "./Promo";
import { RichTextData } from "./RichText";
import { Data as ShareWidgetSectionData } from "./ShareWidgetSection";
import { Data as SignupBlockData } from "./SignupBlock";
import { Data as TitleWithContentData } from "./TitleWithContent";

export type DocumentDisplayFormatType = "Asset type" | "Asset name";

export type Data = {
  microCopy: MicroCopyData[] | null;
  pdpSidebarItems: TitleWithContentData[] | null;
  pdpCardsTitle: string | null;
  pdpCards: (PromoData | PageInfoData)[] | null;
  pdpExploreBar: ExploreBarData | null;
  pdpShareWidget: ShareWidgetSectionData | null;
  sdpShareWidget: ShareWidgetSectionData | null;
  sdpLeadBlockCta: LinkData | null;
  sdpSidebarItems: TitleWithContentData[] | null;
  sdpBimDescription: RichTextData | null;
  visualiserShareWidget: ShareWidgetSectionData | null;
  pdpSignupBlock: SignupBlockData | null;
  searchPageSearchTips: TitleWithContentData | null;
  searchPageSidebarItems: TitleWithContentData | null;
  searchPageNextBestActions: NextBestActionsData | null;
  searchPageExploreBar: ExploreBarData | null;
  errorFourOFour: PromoData | null;
  errorGeneral: PromoData | null;
  welcomeDialogTitle: string | null;
  welcomeDialogBrands: [string] | null;
  welcomeDialogBody: RichTextData | null;
  ieDialogTitle: string | null;
  ieDialogBody: RichTextData | null;
  ieDialogActionLabel: string | null;
  ieDialogActionLink: string | null;
  countryNavigationIntroduction?: RichTextData | null;
  maximumSamples: number | null;
  sampleBasketLink: PageInfoData | null;
  keyAssetTypes: string[] | null;
  pdpFixingToolTitle: string | null;
  pdpFixingToolDescription: RichTextData | null;
  pdpSpecificationTitle: string | null;
  pdpSpecificationDescription: RichTextData | null;
  sdpSpecificationNotesCta: SDPSpecificationNotesData | null;
  documentDisplayFormat: DocumentDisplayFormatType | null;
};

export const query = graphql`
  fragment ResourcesFragment on ContentfulResources {
    microCopy {
      ...MicroCopyFragment
    }
    pdpSidebarItems {
      ...TitleWithContentFragment
    }
    pdpCardsTitle
    keyAssetTypes
    maximumSamples
    documentDisplayFormat
    sampleBasketLink {
      ... on ContentfulSimplePage {
        ...PageInfoFragment
        sections {
          ... on ContentfulSampleBasketSection {
            title
          }
        }
      }
    }
    pdpCards {
      ... on ContentfulPromoOrPage {
        ...PromoFragment
        ...PageInfoFragment
      }
    }
    pdpExploreBar {
      ...ExploreBarFragment
    }
    pdpShareWidget {
      ...ShareWidgetSectionFragment
    }
    sdpShareWidget {
      ...ShareWidgetSectionFragment
    }
    sdpLeadBlockCta {
      ...LinkFragment
    }
    visualiserShareWidget {
      ...ShareWidgetSectionFragment
    }
    pdpSignupBlock {
      ...SignupBlockFragment
    }
    searchPageSearchTips {
      ...TitleWithContentFragment
    }
    searchPageSidebarItems {
      ...TitleWithContentFragment
    }
    searchPageNextBestActions {
      ...NextBestActionsFragment
    }
    searchPageExploreBar {
      ...ExploreBarFragment
    }
    errorFourOFour {
      ...PromoFragment
    }
    errorGeneral {
      ...PromoFragment
    }
    sdpSidebarItems {
      ...TitleWithContentFragment
    }
    ...WelcomeDialogFragment
    ...IEDialogFragment
    ...HeaderLanguageFragment
    sdpBimDescription {
      ...RichTextFragment
    }
    pdpFixingToolTitle
    pdpFixingToolDescription {
      ...RichTextFragment
    }
    pdpSpecificationTitle
    pdpSpecificationDescription {
      ...RichTextFragment
    }
    sdpSpecificationNotesCta {
      ...SpecificationNotesFragment
    }
  }
`;
