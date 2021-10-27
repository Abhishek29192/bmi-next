import { graphql } from "gatsby";
import { Data as LinkData } from "../components/Link";
import { TagData } from "./Tag";
import { Data as VideoData } from "./Video";
import { Data as ImageData } from "./Image";

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
  featuredMedia:
    | (ImageData & {
        thumbnail: {
          src: string;
        };
      })
    | null;
  featuredVideo: VideoData | null;
  heroType?: string | null;
  cta?: LinkData | null;
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
