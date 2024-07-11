import type { Logo } from "./BrandLogo";
import type { Data as ImageData } from "./image/contentful-image/types";
import type { RichTextData } from "./RichText";
import type { TagData } from "./Tag";
import type { ContentfulVideoData } from "./video/types";
import type { Data as LinkData } from "./link/types";

export type Data = {
  __typename: "Promo";
  id: string;
  name: string;
  title: string | null;
  subtitle: string | null;
  body: RichTextData | null;
  brandLogo: Logo | null;
  tags: TagData[] | null;
  featuredMedia: ImageData | null;
  cta: LinkData | null;
  featuredVideo: ContentfulVideoData | null;
  backgroundColor: "White" | "Alabaster" | null;
};
