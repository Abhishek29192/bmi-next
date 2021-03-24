import { graphql } from "gatsby";
import { TagData } from "./Tag";
import { Data as VideoData } from "./Video";
import { Data as ImageData } from "./Image";

export type Data = {
  __typename:
    | "ContentfulSimplePage"
    | "ContentfulContactUsPage"
    | "ContentfulTeamPage"
    | "ContentfulProductListerPage"
    | "ContentfulDocumentLibraryPage"
    | "ContentfulBrandLandingPage";
  title: string;
  subtitle: string | null;
  brandLogo: string | null;
  slug: string;
  path: string;
  tags: TagData[] | null;
  // TODO: Move Video as option of Media.
  featuredMedia: ImageData | null;
  featuredVideo: VideoData | null;
};

export const query = graphql`
  fragment PageInfoFragment on ContentfulPage {
    __typename
    title
    subtitle
    brandLogo
    slug
    path
    tags {
      title
      type
    }
    featuredMedia {
      ...ImageFragment
    }
    featuredVideo {
      ...VideoFragment
    }
  }
`;
