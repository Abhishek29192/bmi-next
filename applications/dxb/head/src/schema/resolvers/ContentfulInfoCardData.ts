import resolveVideo from "./ContentfulVideo";
import { resolvePath, getUrlFromPath } from "./utils/path";
import resolveImage from "./ContentfulImage";
import type { ContentfulPageInfoCardData } from "./types/PageInfoCardData";
import type { Data as PageInfoData } from "../../components/PageInfo";

const resolveInfoCardData = async (
  pageData: ContentfulPageInfoCardData
): Promise<PageInfoData> => {
  const {
    parentPage,
    featuredMedia,
    featuredVideo,
    tagsCollection,
    date,
    sys,
    ...rest
  } = pageData;

  const path = await resolvePath({
    title: rest.title,
    slug: rest.slug,
    sys,
    parentPage
  });

  return {
    ...rest,
    id: sys.id,
    path: getUrlFromPath(path),
    featuredMedia: featuredMedia ? resolveImage(featuredMedia) : null,
    featuredVideo: featuredVideo ? await resolveVideo(featuredVideo) : null,
    tags: tagsCollection ? tagsCollection.items : null,
    rawDate: date ?? null,
    date: date ? transformDate(date) : null
  };
};

const transformDate = (date: string) =>
  new Intl.DateTimeFormat(process.env.NEXT_PUBLIC_MARKET_LOCALE_CODE!, {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(date));

export default resolveInfoCardData;
