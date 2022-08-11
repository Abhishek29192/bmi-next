import { graphql } from "gatsby";
import { Data as LinkData } from "../components/Link";
import { ContentfulImageData } from "./Image";
import { Data as SampleBasketSectionData } from "./SampleBasketBase";
import { TagData } from "./Tag";
import { ContentfulVideoData } from "./Video";

export type ImageWithThumbnail = ContentfulImageData & {
  thumbnail: {
    src: string;
  };
};

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
  brandLogo: string | null;
  slug: string;
  path: string;
  date: string | null;
  tags: TagData[] | null;
  // TODO: Move Video as option of Media.
  featuredMedia: ImageWithThumbnail | null;
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
    featuredVideo {
      ...VideoFragment
    }
  }
  fragment PageInfoFragment on ContentfulPage {
    ...BasePageInfoFragment
    featuredMedia {
      ...ImageFragment
    }
  }
  fragment PageInfoCardFragment on ContentfulPage {
    ...BasePageInfoFragment
    featuredMedia {
      ...ImageCardFragment
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
  }
`;
