import { graphql } from "gatsby";
import { LinkData } from "./Link";
import { TagData } from "./Tag";

export type Data = {
  __typename: "ContentfulPromo";
  title: string;
  subtitle: string | null;
  brandLogo: string | null;
  tags: TagData[] | null;
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
    tags {
      title
      type
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
