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
