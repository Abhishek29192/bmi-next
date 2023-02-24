import { graphql } from "gatsby";
import { Data as LinkData } from "../components/Link";
import { Data as ImageData } from "./Image";
import { Data as SampleBasketSectionData } from "./SampleBasketBase";
import { TagData } from "./Tag";
import { ContentfulVideoData } from "./Video";
import { Logo } from "./BrandLogo";

export type Data = {
  __typename:
    | "ContentfulSimplePage"
    | "ContentfulContactUsPage"
    | "ContentfulProductListerPage"
    | "ContentfulDocumentLibraryPage"
    | "ContentfulBrandLandingPage";
  id: string;
  title: string;
  subtitle: string | null;
  brandLogo: Logo | null;
  slug: string;
  path: string;
  date: string | null;
  tags: TagData[] | null;
  // TODO: Move Video as option of Media.
  featuredMedia: ImageData | null;
  featuredVideo: ContentfulVideoData | null;
  heroType?: string | null;
  cta?: LinkData | null;
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
