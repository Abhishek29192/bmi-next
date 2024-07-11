import type { ParentPage } from "./Common";
import type { Data as PageInfoData } from "../../../components/PageInfo";
import type { Video } from "./Video";
import type { TagData } from "../../../components/Tag";

export type ContentfulPageInfoCardData = Omit<
  PageInfoData,
  "featuredVideo" | "tags" | "rawDate" | "id" | "path"
> & {
  featuredVideo: Video | null;
  parentPage: ParentPage;
  sys: {
    id: string;
  };
  tagsCollection: {
    items: TagData[];
  } | null;
};
