import createEntrySys from "./entrySysHelper";
import { createFullyPopulatedImage } from "./imageHelper";
import type { TypeVideo } from "../types";
import type { EntryPartial } from "./helperTypes";

export const createFullyPopulatedVideo = (
  contentfulVideo?: EntryPartial<TypeVideo<undefined, "en-US">>
): TypeVideo<undefined, "en-US"> => {
  const video = createVideo(contentfulVideo);
  return {
    ...video,
    fields: {
      subtitle: "video subtitle",
      previewImage: undefined, // Should be deleted
      previewMedia: createFullyPopulatedImage(),
      ...video.fields
    }
  };
};

const createVideo = (
  contentfulVideo?: EntryPartial<TypeVideo<undefined, "en-US">>
): TypeVideo<undefined, "en-US"> => ({
  sys: {
    ...createEntrySys(),
    contentType: {
      sys: {
        type: "Link",
        linkType: "ContentType",
        id: "video"
      }
    },
    ...contentfulVideo?.sys
  },
  metadata: {
    tags: [],
    ...contentfulVideo?.metadata
  },
  fields: {
    title: "video title",
    label: "video label",
    youtubeId: "video-youtube-id",
    ...contentfulVideo?.fields
  }
});

export default createVideo;
