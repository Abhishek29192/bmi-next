import { graphql } from "gatsby";

export type Data = {
  __typename:
    | "ContentfulSimplePage"
    | "ContentfulContactUsPage"
    | "ContentfulTeamPage"
    | "ContentfulProductListerPage"
    | "ContentfulDocumentLibraryPage";
  title: string;
  subtitle: string | null;
  brandLogo: string | null;
  slug: string;
  tag: {
    title: string;
  } | null;
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
    tag {
      title
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
