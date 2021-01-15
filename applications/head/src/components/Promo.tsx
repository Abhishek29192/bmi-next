import { graphql } from "gatsby";
import { LinkData } from "./Link";

export type Data = {
  __typename: "ContentfulPromo";
  title: string;
  subtitle: string | null;
  brandLogo: string | null;
  tag: {
    title: string;
  } | null;
  featuredImage: {
    resize: {
      src: string;
    };
    file: {
      fileName: string;
      url: string;
    };
  };
  cta: LinkData | null;
};

export const promoQuery = graphql`
  fragment PromoFragment on ContentfulPromo {
    title
    subtitle
    brandLogo
    tag {
      title
    }
    featuredImage {
      resize(width: 1000, toFormat: JPG, jpegProgressive: true, quality: 60) {
        src
      }
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
