import { graphql } from "gatsby";
import { RichTextData } from "../components/RichText";
import { LinkData } from "./Link";
import { TagData } from "./Tag";
import { Data as VideoData } from "./Video";
import { Data as ImageData } from "./Image";

export type Data = {
  __typename: "ContentfulPromo";
  title: string;
  subtitle: string | null;
  body: RichTextData | null;
  brandLogo: string | null;
  tags: TagData[] | null;
  featuredMedia: ImageData | null;
  cta: LinkData | null;
  featuredVideo: VideoData | null;
};

export const promoQuery = graphql`
  fragment PromoFragment on ContentfulPromo {
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
    featuredMedia {
      ...ImageFragment
    }
    cta {
      ...LinkFragment
    }
    featuredVideo {
      ...VideoFragment
    }
  }
`;
