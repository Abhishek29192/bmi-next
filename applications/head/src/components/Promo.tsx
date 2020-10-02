import { graphql } from "gatsby";
import { LinkData } from "./Link";

export type Data = {
  title: string;
  subtitle: string;
  slug: string | null;
  image: {
    file: {
      fileName: string;
      url: string;
    };
  };
  cta: LinkData | null;
};

export const promoQuery = graphql`
  fragment PromoFragment on ContentfulContactUsPageContentfulPromoContentfulSimplePageUnion {
    ... on ContentfulSimplePage {
      title
      subtitle
      slug
      image: featuredImage {
        file {
          fileName
          url
        }
      }
    }

    ... on ContentfulContactUsPage {
      title
      subtitle
      slug
      image: featuredImage {
        file {
          fileName
          url
        }
      }
    }

    ... on ContentfulPromo {
      title
      subtitle
      image {
        file {
          fileName
          url
        }
      }
      cta {
        ...LinkFragment
      }
    }
  }
`;
