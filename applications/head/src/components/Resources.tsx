import { graphql } from "gatsby";
import { Data as MicroCopyData } from "./MicroCopy";
import { Data as TitleWithContentData } from "./TitleWithContent";
import { Data as PromoData } from "./Promo";
import { Data as PageInfoData } from "./PageInfo";

type FeaturedImage = {
  featuredImage: {
    resize: {
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
        FeaturedImage)
    | null;
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
            resize(width: 350) {
              src
            }
          }
        }

        ... on ContentfulPage {
          featuredImage {
            resize(width: 350) {
              src
            }
          }
        }
      }
    }
  }
`;
