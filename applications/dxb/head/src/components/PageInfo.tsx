import type { Logo } from "./BrandLogo";
import type { Data as ImageData } from "./image/contentful-image/types";
import type { Data as SampleBasketSectionData } from "./SampleBasketBase";
import type { TagData } from "./Tag";
import type { ContentfulVideoData } from "./video/types";

export type Data = {
  __typename:
    | "Page"
    | "ContactUsPage"
    | "ProductListerPage"
    | "DocumentLibraryPage"
    | "BrandLandingPage"
    | "TrainingListerPage";
  id: string;
  title: string;
  subtitle: string | null;
  brandLogo: Logo | null;
  slug: string;
  path: string;
  date: string | null;
  rawDate: string | null;
  tags: TagData[] | null;
  // TODO: Move Video as option of Media.
  featuredMedia: ImageData | null;
  featuredVideo: ContentfulVideoData | null;
  heroType?: string | null;
  sections?:
    | Omit<
        SampleBasketSectionData,
        | "__typename"
        | "description"
        | "checkoutFormSection"
        | "emptyBasketMessage"
        | "browseProductsCTALabel"
        | "browseProductsCTA"
      >[]
    | null; // get only title from SampleBasketSectionData
};
