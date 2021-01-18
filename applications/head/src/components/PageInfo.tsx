import { graphql } from "gatsby";
import { TagData } from "./Tag";

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
  tags: TagData[] | null;
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
    tags {
      title
      type
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
