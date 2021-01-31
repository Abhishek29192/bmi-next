import { graphql } from "gatsby";
import { TagData } from "./Tag";

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
  tags: TagData[] | null;
  featuredImage: {
    title: string;
    resize: {
      src: string;
    };
    file: {
      fileName: string;
      url: string;
    };
  } | null;
};

export const query = graphql`
  fragment PageInfoFragment on ContentfulPage {
    __typename
    title
    subtitle
    brandLogo
    slug
    tags {
      title
      type
    }
    featuredImage {
      title
      resize(width: 1000, toFormat: JPG, jpegProgressive: true, quality: 60) {
        src
      }
      file {
        fileName
        url
      }
    }
  }
`;
