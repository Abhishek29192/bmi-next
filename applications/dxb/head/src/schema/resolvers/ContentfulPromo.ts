import resolveLink from "./ContentfulLink";
import resolveVideo from "./ContentfulVideo";
import resolveRichText from "./ContentfulRichText";
import resolveImage from "./ContentfulImage";
import type { ContentfulPromo } from "./types/Promo";
import type { Data as PromoData } from "../../components/Promo";

const resolvePromo = async (promoData: ContentfulPromo): Promise<PromoData> => {
  const { body, cta, featuredMedia, featuredVideo, tagsCollection, ...rest } =
    promoData;

  return {
    ...rest,
    featuredMedia: featuredMedia ? resolveImage(featuredMedia) : null,
    body: body ? await resolveRichText(body) : null,
    cta: cta ? await resolveLink(cta) : null,
    featuredVideo: featuredVideo ? await resolveVideo(featuredVideo) : null,
    tags: tagsCollection ? tagsCollection.items : null
  };
};

export default resolvePromo;
