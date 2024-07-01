import { graphql } from "gatsby";
import type { Logo } from "./BrandLogo";
import type { Data as ImageData } from "./image/types";
import type { Data as SampleBasketSectionData } from "./SampleBasketBase";
import type { TagData } from "./Tag";
import type { ContentfulVideoData } from "./video/types";

export type Data = {
  __typename:
    | "ContentfulSimplePage"
    | "ContentfulContactUsPage"
    | "ContentfulProductListerPage"
    | "ContentfulDocumentLibraryPage"
    | "ContentfulBrandLandingPage"
    | "ContentfulTrainingListerPage";
  id: string;
  title: string;
  subtitle: string | null;
  brandLogo: Logo | null;
  slug: string;
  path: string;
  date: string | null;
  rawDate: string | null;
  tags: TagData[] | null;
  // TODO: Move Video as option of Media.
  featuredMedia: ImageData | null;
  featuredVideo: ContentfulVideoData | null;
  heroType?: string | null;
  sections?:
    | Omit<
        SampleBasketSectionData,
        | "__typename"
        | "description"
        | "checkoutFormSection"
        | "emptyBasketMessage"
        | "browseProductsCTALabel"
        | "browseProductsCTA"
      >[]
    | null; // get only title from SampleBasketSectionData
};

export const query = graphql`
  fragment BasePageInfoFragment on ContentfulPage {
    __typename
    id
    title
    subtitle
    brandLogo
    slug
    path
    tags {
      title
      type
    }
  }
  fragment PageInfoVillainFragment on ContentfulPage {
    ...BasePageInfoFragment
    featuredMedia {
      ...ImageVillainFragment
    }
    featuredVideo {
      ...VideoVillainFragment
    }
  }
  fragment PageInfoHeaderFragment on ContentfulPage {
    ...BasePageInfoFragment
    featuredMedia {
      ...ImageHeaderFragment
    }
    featuredVideo {
      ...VideoHeaderFragment
    }
  }
  fragment PageInfoHeroFragment on ContentfulPage {
    ...BasePageInfoFragment
    featuredMedia {
      ...ImageHeroFragment
    }
    featuredVideo {
      ...VideoHeroFragment
    }
  }
  fragment PageInfoCardFragment on ContentfulPage {
    ...BasePageInfoFragment
    featuredMedia {
      ...ImageCardFragment
    }
    featuredVideo {
      ...VideoCardFragment
    }
    ... on ContentfulSimplePage {
      date
      rawDate
    }
  }
  fragment PageInfoSlideFragment on ContentfulPage {
    ...BasePageInfoFragment
    featuredMedia {
      ...ImageSlideFragment
    }
    featuredVideo {
      ...VideoSlideFragment
    }
  }
`;
