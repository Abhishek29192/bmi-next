import { graphql } from "gatsby";

export type Data = {
  metaTitle: string | null;
  metaDescription: string | null;
  noIndex: boolean | null;
};

export const query = graphql`
  fragment SEOContentFragment on ContentfulSeoContent {
    metaTitle
    metaDescription
    noIndex
  }
`;
