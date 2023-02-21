/* eslint-disable @typescript-eslint/no-unused-vars */
import { graphql } from "gatsby";
import { Data as ImageData } from "./Image";
import { Data as LinkData } from "./Link";
import { RichTextData } from "./RichText";
import { TagData } from "./Tag";
import { ContentfulVideoData } from "./Video";

export type Data = {
  __typename: "ContentfulPromo";
  id: string;
  name: string;
  title: string | null;
  subtitle: string | null;
  body: RichTextData | null;
  brandLogo: string | null;
  tags: TagData[] | null;
  featuredMedia: ImageData | null;
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
    backgroundColor
  }
  fragment PromoFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageVillainFragment
    }
    featuredVideo {
      ...VideoVillainFragment
    }
  }
  fragment PromoVillainFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageVillainFragment
    }
    featuredVideo {
      ...VideoVillainFragment
    }
  }
  fragment PromoHeaderFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageHeaderFragment
    }
    featuredVideo {
      ...VideoHeaderFragment
    }
  }
  fragment PromoHeroFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageHeroFragment
    }
    featuredVideo {
      ...VideoHeroFragment
    }
  }
  fragment PromoCardFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageCardFragment
    }
    featuredVideo {
      ...VideoCardFragment
    }
  }
  fragment PromoSlideFragment on ContentfulPromo {
    ...BasePromoFragment
    featuredMedia {
      ...ImageSlideFragment
    }
    featuredVideo {
      ...VideoSlideFragment
    }
  }
`;
