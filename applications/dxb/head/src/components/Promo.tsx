import { graphql } from "gatsby";
import { RichTextData } from "./RichText";
import { Data as LinkData } from "./Link";
import { TagData } from "./Tag";
import { ContentfulVideoData } from "./Video";
import { Data as ImageData } from "./Image";

export type Data = {
  __typename: "ContentfulPromo";
  id: string;
  name: string;
  title: string | null;
  subtitle: string | null;
  body: RichTextData | null;
  brandLogo: string | null;
  tags: TagData[] | null;
  featuredMedia:
    | (ImageData & {
        thumbnail: {
          src: string;
        };
      })
    | null;
  cta: LinkData | null;
  featuredVideo: ContentfulVideoData | null;
  backgroundColor: "White" | "Alabaster" | null;
};

export const promoQuery = graphql`
  fragment BasePromoFragment on ContentfulPromo {
    __typename
    id
    name
    title
    subtitle
    body {
      ...RichTextFragment
    }
    brandLogo
    tags {
      title
      type
    }
    cta {
      ...LinkFragment
    }
    featuredVideo {
      ...VideoFragment
    }
    backgroundColor
  }
  fragment PromoFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageFragment
    }
  }
  fragment PromoCardFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageCardFragment
    }
  }
  fragment PromoSlideFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageSlideFragment
    }
  }
`;
