import { graphql } from "gatsby";

export type Data = {
  metaTitle: string | null;
  metaDescription: string | null;
};

export const query = graphql`
  fragment SEOContentFragment on ContentfulSeoContent {
    metaTitle
    metaDescription
  }
`;
