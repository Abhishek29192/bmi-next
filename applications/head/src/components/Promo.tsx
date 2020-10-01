import { graphql } from "gatsby";

export type Data = {
  title: string;
  subtitle: string;
  image: {
    file: {
      fileName: string;
      url: string;
    };
  };
};

export const promoQuery = graphql`
  fragment PromoFragment on ContentfulContactUsPageContentfulPromoContentfulSimplePageUnion {
    ... on ContentfulSimplePage {
      title
      subtitle
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
    }
  }
`;
