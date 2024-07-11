import type { Data as PromoData } from "../../../components/Promo";
import type { ContentfulLink } from "./Link";
import type { Video as ContentfulVideo } from "./Video";
import type { TagData } from "../../../components/Tag";
import type { ContentfulRichText } from "./RichText";

export type ContentfulPromo = Omit<
  PromoData,
  "body" | "cta" | "featuredVideo" | "tags"
> & {
  body: ContentfulRichText | null;
  cta: ContentfulLink | null;
  featuredVideo: ContentfulVideo | null;
  tagsCollection: {
    items: TagData[];
  } | null;
};
