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
      file {
        fileName
        url
      }
    }
  }
`;
