import { youtube_v3 } from "googleapis";

const createYoutubeVideoListResponse =
  (): youtube_v3.Schema$VideoListResponse => ({
    etag: "list-response-etag",
    items: [
      {
        etag: "item-etag",
        id: "item-id",
        kind: "youtube#video",
        player: {
          embedHeight: "9999",
          embedWidth: "17776"
        },
        snippet: {
          thumbnails: {
            default: {
              height: 90,
              url: "https://i.ytimg.com/vi/item-id/default.jpg",
              width: 120
            },
            medium: {
              height: 180,
              url: "https://i.ytimg.com/vi/item-id/mqdefault.jpg",
              width: 320
            },
            high: {
              height: 360,
              url: "https://i.ytimg.com/vi/item-id/hqdefault.jpg",
              width: 480
            },
            standard: {
              height: 480,
              url: "https://i.ytimg.com/vi/item-id/sddefault.jpg",
              width: 640
            },
            maxres: {
              height: 720,
              url: "https://i.ytimg.com/vi/item-id/maxresdefault.jpg",
              width: 1280
            }
          }
        },
        status: {
          uploadStatus: "processed"
        }
      }
    ],
    kind: "youtube#videoListResponse",
    pageInfo: {
      resultsPerPage: 1,
      totalResults: 1
    }
  });

export default createYoutubeVideoListResponse;
