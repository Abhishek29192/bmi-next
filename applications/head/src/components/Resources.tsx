import { graphql } from "gatsby";
import { Data as MicroCopyData } from "./MicroCopy";
import { Data as TitleWithContentData } from "./TitleWithContent";
import { Data as PromoData } from "./Promo";
import { Data as PageInfoData } from "./PageInfo";
import { Data as ExploreBarData } from "./ExploreBar";
import { Data as ShareWidgetSectionData } from "./ShareWidgetSection";
import { Data as InputBannerData } from "./InputBanner";
import { Data as NextBestActionsData } from "./NextBestActions";
import { RichTextData } from "./RichText";

type FeaturedImage = {
  featuredImage: {
    resized: {
      src: string;
    };
  } | null;
};

export type Data = {
  microCopy: MicroCopyData[] | null;
  pdpSidebarItems: TitleWithContentData[] | null;
  pdpCardsTitle: string | null;
  pdpCards:
    | ((
        | Omit<PromoData, "featuredImage">
        | Omit<PageInfoData, "featuredImage">
      ) &
        FeaturedImage)[]
    | null;
  pdpExploreBar: ExploreBarData | null;
  pdpShareWidget: ShareWidgetSectionData | null;
  pdpInputBanner: InputBannerData | null;
  searchPageSearchTips: TitleWithContentData | null;
  searchPageSidebarItems: TitleWithContentData | null;
  searchPageNextBestActions: NextBestActionsData | null;
  searchPageExploreBar: ExploreBarData | null;
  errorFourOFour: PromoData | null;
  errorGeneral: PromoData | null;
  welcomeDialogTitle: string | null;
  welcomeDialogBrands: [string] | null;
  welcomeDialogBody: RichTextData | null;
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
    pdpCards {
      ... on ContentfulPromoOrPage {
        ...PromoFragment
        ...PageInfoFragment

        ... on ContentfulPromo {
          featuredImage {
            resized: resize(
              width: 350
              toFormat: WEBP
              jpegProgressive: false
            ) {
              src
            }
          }
        }

        ... on ContentfulPage {
          featuredImage {
            resized: resize(
              width: 350
              toFormat: WEBP
              jpegProgressive: false
            ) {
              src
            }
          }
        }
      }
    }
    pdpExploreBar {
      ...ExploreBarFragment
    }
    pdpShareWidget {
      ...ShareWidgetSectionFragment
    }
    pdpInputBanner {
      ...InputBannerFragment
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
    ...WelcomeDialogFragment
  }
`;
