import { graphql } from "gatsby";
import { LinkData } from "./Link";

export type Data = {
  title: string;
  subtitle: string;
  featuredImage: {
    file: {
      fileName: string;
      url: string;
    };
  };
  cta?: LinkData | null;
};

export const promoQuery = graphql`
  fragment PromoFragment on ContentfulPromo {
    title
    subtitle
    featuredImage: image {
      file {
        fileName
        url
      }
    }
    cta {
      ...LinkFragment
    }
  }
`;
