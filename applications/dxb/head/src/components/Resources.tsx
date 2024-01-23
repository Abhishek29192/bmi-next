import { graphql } from "gatsby";
import { CTACardPageInfoData, CTACardPromoData } from "./types/CTACardTypes";
import type { Data as SDPSpecificationNotesData } from "./ContentfulSpecificationNotes";
import type { Data as ExploreBarData } from "./ExploreBar";
import type { Data as MicroCopyData } from "./MicroCopy";
import type { Data as PageInfoData } from "./PageInfo";
import type { Data as PromoData } from "./Promo";
import type { RichTextData } from "./RichText";
import type { Data as ShareWidgetSectionData } from "./ShareWidgetSection";
import type { Data as SignupBlockData } from "./SignupBlock";
import type { Data as TitleWithContentData } from "./TitleWithContent";
import type { Data as LinkData } from "./link/types";
import type { Data as NextBestActionsData } from "./next-best-actions/NextBestActions";

export type DocumentDisplayFormatType = "Asset type" | "Asset name";

export type GoodBetterBestIcons = "Thumb Up" | "Heart" | "Star";

export type Data = {
  microCopy: MicroCopyData[] | null;
  pdpSidebarItems: TitleWithContentData[] | null;
  pdpCardsTitle: string | null;
  pdpCards: (CTACardPromoData | CTACardPageInfoData)[] | null;
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
  gbbGoodIndicator?: GoodBetterBestIcons;
  gbbBetterIndicator?: GoodBetterBestIcons;
  gbbBestIndicator?: GoodBetterBestIcons;
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
        ...BasePageInfoFragment
        sections {
          ... on ContentfulSampleBasketSection {
            title
          }
        }
      }
    }
    pdpCards {
      ... on ContentfulPromoOrPage {
        ...PromoCardFragment
        ...PageInfoCardFragment
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
